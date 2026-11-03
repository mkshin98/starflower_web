"""CMG 1000 카탈로그 자료 빌드 스크립트.

원본 자료는 cmg_1000_catalog.json 하나뿐입니다. 이 스크립트는 같은 폴더에
  1) cmg_1000_catalog.csv  — 엑셀 등에서 보기 위한 표
  2) cmg_1000_catalog.js   — 웹 페이지가 <script src>로 불러 쓰는 자료
                             (window.CMG1000_DATA = {metadata, galaxies})
를 만듭니다. JS 파일은 파일을 더블클릭해 열 때(file://)도, 웹 서버에서도 동작합니다.

사용법:
  python build.py                 # 이 스크립트가 있는 폴더의 JSON 사용
  python build.py <자료 폴더>      # 자료 폴더를 다른 곳으로 옮긴 경우
"""
import csv
import json
import sys
from pathlib import Path

JSON_NAME = 'cmg_1000_catalog.json'
CSV_NAME = 'cmg_1000_catalog.csv'
JS_NAME = 'cmg_1000_catalog.js'

CSV_COLUMNS = [
    'no', 'primary_id', 'alt_ids', 'messier', 'caldwell', 'omeara', 'arp', 'catalogs',
    'name_ko', 'descriptor_ko', 'common_names_ko', 'latin_name', 'accentuated_name',
    'descriptor_en', 'constellation_ko', 'constellation', 'eq_coord', 'gal_coord',
    'sgal_coord', 'atlases', 'd_ma', 'd_mi', 'pa', 'inclination', 'm_vis', 'sb', 'b_v',
    'm_b', 'hs_class', 'rc3_class', 'morph_group', 'activity', 'arm_class', 't_lc',
    'group_cluster', 'z', 'v_hc', 'v_gc', 'dh_mpc', 'd_mpc', 'diameter_kly',
    'supernovae', 'explanation_ko', 'explanation_en', 'page', 'book_page',
    'rank_brightest', 'rank_largest', 'rank_smallest', 'person',
]


def csv_value(v):
    if v is None:
        return ''
    if isinstance(v, dict):
        return '; '.join(f'{k}={x}' for k, x in v.items())
    if isinstance(v, list):
        return '; '.join(str(x) for x in v)
    return str(v)


def main():
    data_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent
    json_path = data_dir / JSON_NAME
    if not json_path.exists():
        raise SystemExit(f'{json_path} 를 찾을 수 없습니다.')

    doc = json.loads(json_path.read_text(encoding='utf-8'))
    galaxies = doc['galaxies']

    with (data_dir / CSV_NAME).open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(CSV_COLUMNS)
        for g in galaxies:
            w.writerow([csv_value(g.get(c)) for c in CSV_COLUMNS])

    payload = json.dumps(doc, ensure_ascii=False, separators=(',', ':'))
    (data_dir / JS_NAME).write_text(
        '/* CMG 1000 은하 자료 — build.py가 cmg_1000_catalog.json에서 자동 생성. 직접 고치지 마세요. */\n'
        f'window.CMG1000_DATA = {payload};\n',
        encoding='utf-8', newline='\n')

    print(f'{len(galaxies)}개 은하 → {CSV_NAME}, {JS_NAME} 생성 완료 ({data_dir})')


if __name__ == '__main__':
    main()
