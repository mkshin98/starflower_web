"""CMG 1000 은하 사진 백업 스크립트.

카탈로그 페이지(z41_cmg1000)는 사진을 먼저 이 스크립트가 받아 둔 파일에서 찾고,
없을 때만 사진 서버에 직접 요청합니다. 서버가 멈춰도 사진이 보이도록 두 크기로 받아 둡니다.
  z41_cmg1000/img/dss240/0001.jpg   목록 썸네일 (240×240)
  z41_cmg1000/img/dss480/0001.jpg   상세 창 사진 (480×480)
  z41_cmg1000/img/sources.js        사진마다 받은 서버 (페이지의 사진 출처 표시용)

사진 서버는 아래 순서로 시도합니다. 두 크기는 늘 같은 서버에서 받습니다.
  1. dss         CDS hips2fits — DSS2 컬러 (전천, 기본)
  2. ls-dr10     Legacy Survey 컷아웃 — DESI Legacy Imaging Surveys DR10 (CDS가 멈췄을 때 예비)
  3. unwise-neo7 Legacy Survey 컷아웃 — unWISE 적외선 (DR10이 찍지 않은 하늘일 때)
서버 접속 자체가 안 되면 그 실행에서는 그 서버를 건너뜁니다.
사진 주소 계산(좌표·시야)은 z41_cmg1000/cmg1000.js 의 imageUrl()·legacyCutoutUrl()과 같습니다.
한쪽을 고치면 다른 쪽도 같이 고치세요.

사용법:
  python fetch_images.py            # 없는 사진만 받음 (중간에 끊겨도 다시 실행하면 이어서 받음)
  python fetch_images.py --upgrade  # 예비 서버에서 받은 사진을 DSS2로 다시 받음 (CDS 복구 후)
  python fetch_images.py --force    # 모두 다시 받음
"""
import io
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

DATA_DIR = Path(__file__).resolve().parent
IMG_DIR = DATA_DIR.parent.parent / 'z41_cmg1000' / 'img'
SOURCES_JS = IMG_DIR / 'sources.js'
JSON_NAME = 'cmg_1000_catalog.json'

HIPS2FITS = 'https://alasky.cds.unistra.fr/hips-image-services/hips2fits'
HIPS = 'CDS/P/DSS2/color'
LEGACY_CUTOUT = 'https://www.legacysurvey.org/viewer/cutout.jpg'
# 사진 출처 → 서버 (cmg1000.js IMAGE_SOURCES의 이름과 같음)
SOURCES = {'dss': 'CDS', 'ls-dr10': 'Legacy', 'unwise-neo7': 'Legacy'}
SIZES = (240, 480)
# 하늘에서 너무 큰 천체(소·대마젤란은하, 우리은하, 궁수 왜소타원체은하)는 사진 없음
NO_IMAGE_NOS = {36, 990, 993, 998}
FOV_FACTOR_DSS = 1.2
DELAY_SEC = 0.3
RETRIES = 3


def parse_j2000(s):
    m = re.match(r'^J(\d{2})(\d{2})(\d{2}(?:\.\d+)?)([+-])(\d{2})(\d{2})(\d{2}(?:\.\d+)?)', s or '')
    if not m:
        return None
    ra = (int(m[1]) + int(m[2]) / 60 + float(m[3]) / 3600) * 15
    dec = (-1 if m[4] == '-' else 1) * (int(m[5]) + int(m[6]) / 60 + float(m[7]) / 3600)
    return ra, dec


def sky_pos(g):
    return None if g['no'] in NO_IMAGE_NOS else parse_j2000(g.get('eq_coord'))


def fov_deg(g):
    d = g.get('d_ma_arcmin') or 2.5
    return min(4, max(2 / 60, d * FOV_FACTOR_DSS / 60))


def image_url(g, px, source):
    ra, dec = sky_pos(g)
    if source == 'dss':
        return (f'{HIPS2FITS}?hips={urllib.parse.quote(HIPS, safe="")}'
                f'&ra={ra:.5f}&dec={dec:.5f}&fov={fov_deg(g):.4f}&width={px}&height={px}&projection=TAN&format=jpg')
    # Legacy Survey 컷아웃은 시야 대신 픽셀 크기(초각/픽셀)를 받음 → 같은 범위가 되도록 환산
    pixscale = fov_deg(g) * 3600 / px
    return f'{LEGACY_CUTOUT}?ra={ra:.5f}&dec={dec:.5f}&layer={source}&pixscale={pixscale:.3f}&size={px}'


def is_blank(body):
    """관측하지 않은 하늘은 한 가지 색으로 채워져 옴. 픽셀 절반 이상이 같은 밝기면 빈 사진으로 봄."""
    hist = Image.open(io.BytesIO(body)).convert('L').histogram()
    return max(hist) > 0.5 * sum(hist)


class ServerDown(Exception):
    pass


def fetch(url):
    """사진 한 장을 JPEG 바이트로 받음.
    접속 단계 실패(연결 거부·접속 시간 초과)가 계속되면 ServerDown, 그 밖의 실패는 ValueError."""
    req = urllib.request.Request(url, headers={'User-Agent': 'starflower.info CMG1000 backup'})
    last, conn_fail = None, 0
    for attempt in range(1, RETRIES + 1):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                body = r.read()
            if not body.startswith(b'\xff\xd8'):
                raise ValueError('JPEG가 아닌 응답')
            return body
        except urllib.error.HTTPError as e:      # 서버는 살아 있음 (HTTPError는 URLError의 하위 클래스라 먼저 받음)
            last = e
        except urllib.error.URLError as e:       # 접속 자체가 안 됨
            last, conn_fail = e.reason, conn_fail + 1
        except (TimeoutError, OSError, ValueError) as e:   # 접속은 됐지만 응답이 늦거나 이상함
            last = e
        if attempt < RETRIES:
            time.sleep(2 * attempt)
    if conn_fail == RETRIES:
        raise ServerDown(str(last))
    raise ValueError(str(last))


def load_sources():
    if not SOURCES_JS.exists():
        return {}
    m = re.search(r'=\s*(\{.*\})\s*;', SOURCES_JS.read_text(encoding='utf-8'), re.S)
    return json.loads(m.group(1)) if m else {}


def save_sources(sources):
    body = json.dumps(dict(sorted(sources.items())), separators=(',', ':'))
    SOURCES_JS.write_text(
        '// fetch_images.py가 만듦. 백업 사진마다 받은 서버: dss = DSS2 컬러(CDS), '
        'ls-dr10 = DESI Legacy Surveys DR10, unwise-neo7 = unWISE 적외선\n'
        f'window.CMG1000_IMAGE_SOURCES = {body};\n', encoding='utf-8')


def main():
    force = '--force' in sys.argv
    upgrade = '--upgrade' in sys.argv
    galaxies = json.loads((DATA_DIR / JSON_NAME).read_text(encoding='utf-8'))['galaxies']
    for px in SIZES:
        (IMG_DIR / f'dss{px}').mkdir(parents=True, exist_ok=True)
    sources = load_sources()
    down = set()                      # 이번 실행에서 접속이 안 된 서버
    count = dict.fromkeys(SOURCES, 0)
    skipped = failed = 0

    for g in galaxies:
        if not sky_pos(g):
            continue
        key = f'{g["no"]:04d}'
        paths = [IMG_DIR / f'dss{px}' / f'{key}.jpg' for px in SIZES]
        have = all(p.exists() and p.stat().st_size > 0 for p in paths)
        want_upgrade = upgrade and have and sources.get(key, 'dss') != 'dss'
        if have and not force and not want_upgrade:
            skipped += 1
            continue

        got = None
        for source, server in SOURCES.items():
            if server in down:
                continue
            if want_upgrade and source != 'dss':
                break                 # 업그레이드는 DSS2로만. 못 받으면 기존 사진 유지
            try:
                bodies = [fetch(image_url(g, px, source)) for px in SIZES]
            except ServerDown as e:
                down.add(server)
                print(f'  {server} 서버에 접속할 수 없음 ({e}) → 이번 실행에서는 건너뜀', flush=True)
                continue
            except ValueError as e:
                print(f'  {key} {source} 실패: {e}', flush=True)
                continue
            finally:
                time.sleep(DELAY_SEC)
            if source != 'dss' and any(is_blank(b) for b in bodies):
                continue              # 이 탐사가 찍지 않은 하늘 → 다음 서버
            got = (source, bodies)
            break

        if got:
            source, bodies = got
            for p, b in zip(paths, bodies):
                p.write_bytes(b)
            sources[key] = source
            count[source] += 1
        elif not have:
            failed += 1
            print(f'  {key} 사진을 받지 못함', flush=True)

        if g['no'] % 25 == 0:
            save_sources(sources)
            print(f'{g["no"]}/{len(galaxies)} 처리 (받음 {sum(count.values())}, 이미 있음 {skipped}, 실패 {failed})', flush=True)
        if set(SOURCES.values()) <= down:
            print('사진 서버에 모두 접속할 수 없어 멈춥니다. 나중에 다시 실행하세요.')
            break

    save_sources(sources)
    detail = ', '.join(f'{s} {n}' for s, n in count.items() if n)
    print(f'끝: 받음 {sum(count.values())}개 은하 ({detail or "없음"}), 이미 있음 {skipped}, 실패 {failed} → {IMG_DIR}')
    if failed:
        print('실패한 사진은 다시 실행하면 그것만 다시 받습니다.')
    if any(v != 'dss' for v in sources.values()):
        print('예비 서버 사진은 CDS가 복구된 뒤 "python fetch_images.py --upgrade"로 DSS2로 바꿀 수 있습니다.')


if __name__ == '__main__':
    main()
