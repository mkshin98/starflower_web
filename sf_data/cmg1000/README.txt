CMG 1000 은하 자료 (2026-10-21 작성, 2026-11-03 starflower_web으로 이전)

이 폴더가 CMG 1000 자료의 유일한 원본입니다.
(예전 D:\33.천문학\80.CMG 은하목록\starflower_site 는 더 이상 쓰지 않습니다.)

  sf_data/cmg1000/          여러 페이지가 함께 쓰는 CMG 1000 은하 자료
    cmg_1000_catalog.json   원본 자료 (여기만 수정)
    build.py                python build.py → .js / .csv 다시 생성
    fetch_images.py         python fetch_images.py → 은하 사진 백업 (아래 참고)
    cmg_1000_catalog.js     웹 페이지가 불러 쓰는 자료 (자동 생성)
    cmg_1000_catalog.csv    내려받기용 표 (자동 생성)
    ※ 서버에는 .js(필수)와 .csv(선택)만 올려도 됩니다.

  z41_cmg1000/              CMG 1000 은하 카탈로그 페이지
    index41_cmg1000.html    → ../sf_data/cmg1000/cmg_1000_catalog.js 를 불러옴
    cmg1000.css, cmg1000.js 화면 스타일·동작
    img/dss240, img/dss480  은하 사진 백업 (fetch_images.py가 만듦)

은하 사진
  페이지는 DSS2 사진을 img/dss240(목록), img/dss480(상세 창)에서 먼저 찾고,
  없으면 CDS hips2fits 서버에 직접 요청합니다. 둘 다 실패하면 목록 썸네일은 숨깁니다.
  고해상도(Legacy Surveys) 사진은 백업하지 않고 항상 CDS에서 받습니다.
  - 백업 만들기: CDS 서버가 살아 있을 때 이 폴더에서 python fetch_images.py
    (없는 사진만 받으므로 중간에 끊겨도 다시 실행하면 이어서 받음)
  - 서버에 올릴 때 z41_cmg1000/img 폴더도 함께 올리기
  - 사진 주소 계산(좌표·시야)은 cmg1000.js의 imageUrl()과 fetch_images.py가 같아야 함
  - cmg1000.js를 고치면 index41_cmg1000.html의 cmg1000.js?v=날짜 도 갱신 (브라우저 캐시 때문)

내용을 고친 뒤 할 일
  1. 자료를 고쳤으면 이 폴더에서 python build.py 실행
  2. index41_cmg1000.html 하단의 "최종 변경" 날짜 갱신

다른 페이지에서 자료 쓰기 (예: z23_const_deepsky/const_cygnus.html)
  <script src="../sf_data/cmg1000/cmg_1000_catalog.js"></script>
  <script>
    const cygnus = window.CMG1000_DATA.galaxies.filter(g => g.constellation === 'Cygnus');
  </script>
