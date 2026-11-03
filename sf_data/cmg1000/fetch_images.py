"""CMG 1000 은하 사진 백업 스크립트.

카탈로그 페이지(z41_cmg1000)는 사진을 먼저 이 스크립트가 받아 둔 파일에서 찾고,
없을 때만 CDS hips2fits 서버에 직접 요청합니다. CDS 서버가 멈춰도 사진이 보이도록
DSS2 컬러 사진을 두 크기로 받아 둡니다.
  z41_cmg1000/img/dss240/0001.jpg   목록 썸네일 (240×240)
  z41_cmg1000/img/dss480/0001.jpg   상세 창 사진 (480×480)
사진 주소 계산(좌표·시야)은 z41_cmg1000/cmg1000.js 의 imageUrl()과 같습니다.
한쪽을 고치면 다른 쪽도 같이 고치세요.

사용법:
  python fetch_images.py          # 없는 사진만 받음 (중간에 끊겨도 다시 실행하면 이어서 받음)
  python fetch_images.py --force  # 모두 다시 받음
"""
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent
IMG_DIR = DATA_DIR.parent.parent / 'z41_cmg1000' / 'img'
JSON_NAME = 'cmg_1000_catalog.json'

HIPS2FITS = 'https://alasky.cds.unistra.fr/hips-image-services/hips2fits'
HIPS = 'CDS/P/DSS2/color'
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


def fov_deg(g):
    d = g.get('d_ma_arcmin') or 2.5
    return min(4, max(2 / 60, d * FOV_FACTOR_DSS / 60))


def image_url(g, px):
    pos = None if g['no'] in NO_IMAGE_NOS else parse_j2000(g.get('eq_coord'))
    if not pos:
        return None
    ra, dec = pos
    return (f'{HIPS2FITS}?hips={urllib.parse.quote(HIPS, safe="")}'
            f'&ra={ra:.5f}&dec={dec:.5f}&fov={fov_deg(g):.4f}&width={px}&height={px}&projection=TAN&format=jpg')


def download(url, path):
    req = urllib.request.Request(url, headers={'User-Agent': 'starflower.info CMG1000 backup'})
    for attempt in range(1, RETRIES + 1):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                body = r.read()
            if not body.startswith(b'\xff\xd8'):
                raise ValueError('JPEG가 아닌 응답')
            path.write_bytes(body)
            return True
        except (urllib.error.URLError, TimeoutError, ValueError) as e:
            print(f'  {path.name} 실패 ({attempt}/{RETRIES}): {e}')
            time.sleep(2 * attempt)
    return False


def main():
    force = '--force' in sys.argv
    galaxies = json.loads((DATA_DIR / JSON_NAME).read_text(encoding='utf-8'))['galaxies']
    for px in SIZES:
        (IMG_DIR / f'dss{px}').mkdir(parents=True, exist_ok=True)

    done = skipped = failed = 0
    for g in galaxies:
        for px in SIZES:
            url = image_url(g, px)
            if not url:
                continue
            path = IMG_DIR / f'dss{px}' / f'{g["no"]:04d}.jpg'
            if path.exists() and path.stat().st_size > 0 and not force:
                skipped += 1
                continue
            if download(url, path):
                done += 1
            else:
                failed += 1
            time.sleep(DELAY_SEC)
        if g['no'] % 50 == 0:
            print(f'{g["no"]}/{len(galaxies)} 처리 (받음 {done}, 건너뜀 {skipped}, 실패 {failed})')

    print(f'끝: 받음 {done}, 이미 있음 {skipped}, 실패 {failed} → {IMG_DIR}')
    if failed:
        print('실패한 사진은 다시 실행하면 그것만 다시 받습니다.')


if __name__ == '__main__':
    main()
