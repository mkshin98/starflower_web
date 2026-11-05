/* CMG 1000 은하 카탈로그 — 화면 동작 (자료: window.CMG1000_DATA) */
(function() {
  // 자료는 cmg_1000_catalog.js(build.py가 JSON에서 생성)가 window.CMG1000_DATA에 넣어 둠
  const DATA_DOC = window.CMG1000_DATA || { metadata: {}, galaxies: [] };
  const ALL_GALAXIES = Array.isArray(DATA_DOC) ? DATA_DOC : (DATA_DOC.galaxies || []);
  const META = Array.isArray(DATA_DOC) ? {} : (DATA_DOC.metadata || {});
  const GALAXY_BY_NO = new Map(ALL_GALAXIES.map(g => [g.no, g]));

  // 원서 통계 장(2_Introduction.pdf p.24–28)의 특별 목록: 목록 순서(순위)를 기억해 둠
  const LISTS = META.lists || {};
  const LIST_ORDER = {};
  Object.entries(LISTS).forEach(([key, def]) => {
    const pos = new Map();
    (def.order || []).forEach((item, i) => (Array.isArray(item) ? item : [item]).forEach(no => pos.set(no, i)));
    LIST_ORDER[key] = pos;
  });

  // 표준 한글 별자리 이름 (IAU 88개 별자리, 영문 알파벳순)
  const CONST_KO = {
    'Andromeda': '안드로메다', 'Antlia': '공기펌프', 'Apus': '극락조', 'Aquarius': '물병', 'Aquila': '독수리',
    'Ara': '제단', 'Aries': '양', 'Auriga': '마차부', 'Boötes': '목동', 'Caelum': '조각칼',
    'Camelopardalis': '기린', 'Cancer': '게', 'Canes Venatici': '사냥개', 'Canis Major': '큰개', 'Canis Minor': '작은개',
    'Capricornus': '염소', 'Carina': '용골', 'Cassiopeia': '카시오페이아', 'Centaurus': '센타우루스', 'Cepheus': '세페우스',
    'Cetus': '고래', 'Chamaeleon': '카멜레온', 'Circinus': '컴퍼스', 'Columba': '비둘기', 'Coma Berenices': '머리털',
    'Corona Australis': '남쪽왕관', 'Corona Borealis': '북쪽왕관', 'Corvus': '까마귀', 'Crater': '컵', 'Crux': '남십자',
    'Cygnus': '백조/고니', 'Delphinus': '돌고래', 'Dorado': '황새치', 'Draco': '용', 'Equuleus': '조랑말',
    'Eridanus': '에리다누스', 'Fornax': '화로', 'Gemini': '쌍둥이', 'Grus': '두루미', 'Hercules': '헤르쿨레스',
    'Horologium': '시계', 'Hydra': '큰물뱀', 'Hydrus': '물뱀', 'Indus': '인디언', 'Lacerta': '도마뱀',
    'Leo': '사자', 'Leo Minor': '작은사자', 'Lepus': '토끼', 'Libra': '천칭', 'Lupus': '이리',
    'Lynx': '살쾡이', 'Lyra': '거문고', 'Mensa': '테이블산', 'Microscopium': '현미경', 'Monoceros': '외뿔소',
    'Musca': '파리', 'Norma': '직각자', 'Octans': '팔분의', 'Ophiuchus': '뱀주인', 'Orion': '오리온',
    'Pavo': '공작', 'Pegasus': '페가수스', 'Perseus': '페르세우스', 'Phoenix': '봉황', 'Pictor': '화가',
    'Pisces': '물고기', 'Piscis Austrinus': '남쪽물고기', 'Puppis': '고물', 'Pyxis': '나침반', 'Reticulum': '그물눈',
    'Sagitta': '화살', 'Sagittarius': '궁수', 'Scorpius': '전갈', 'Sculptor': '조각가', 'Scutum': '방패',
    'Serpens': '뱀', 'Sextans': '육분의', 'Taurus': '황소', 'Telescopium': '망원경', 'Triangulum': '삼각형',
    'Triangulum Australe': '남쪽삼각형', 'Tucana': '큰부리새', 'Ursa Major': '큰곰', 'Ursa Minor': '작은곰', 'Vela': '돛',
    'Virgo': '처녀', 'Volans': '날치', 'Vulpecula': '여우',
    'Serpens Caput': '뱀 머리', 'Serpens Cauda': '뱀 꼬리', 'Argo Navis': '아르고'
  };
  ALL_GALAXIES.forEach(g => {
    if (g.constellation && g.constellation !== '-') {
      g.constellation_ko = g.constellation.split(/\s*,\s*/).map(c => CONST_KO[c] || c).join('·');
    }
  });

  // 검색용 문자열은 로드할 때 한 번만 만들어 둠
  function compactQuery(s) {
    return s.replace(/\s+/g, '').replace(/ngc0+/g, 'ngc').replace(/ic0+/g, 'ic');
  }
  ALL_GALAXIES.forEach(g => {
    g._hay = [
      'cmg' + g.no,
      String(g.no),
      g.primary_id,
      (g.alt_ids || []).join(' '),
      g.messier || '',
      g.caldwell || '',
      g.omeara || '',
      g.arp || '',
      g.name_ko,
      g.descriptor_ko,
      (g.common_names_ko || []).join(' '),
      (g.common_names_en || []).join(' '),
      g.latin_name,
      g.accentuated_name,
      g.descriptor_en,
      g.constellation_ko,
      g.constellation,
      g.explanation_ko,
      g.explanation_en,
      g.group_cluster,
      (g.supernovae || []).join(' ')
    ].join(' ').toLowerCase();
    // "m31", "c72", "ngc253" 같은 축약형 검색 지원
    g._hayCompact = compactQuery(g._hay).replace(/messier/g, 'm').replace(/caldwell/g, 'c');
  });

  // Safe localStorage wrapper
  function getBookmarks() {
    try {
      const saved = localStorage.getItem('starflower_cmg_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  }
  function saveBookmarks(bSet) {
    try {
      localStorage.setItem('starflower_cmg_bookmarks', JSON.stringify(Array.from(bSet)));
    } catch (e) {}
  }

  // 화면 설정(보기 방식)은 브라우저에 저장
  const PREFS_KEY = 'starflower_cmg_prefs';
  function getPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ view: state.view }));
    } catch (e) {}
  }

  let bookmarks = getBookmarks();
  const prefs = getPrefs();
  // 화면 테마는 운영체제의 밝은/어두운 모드 설정을 따름
  const themeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', themeQuery && themeQuery.matches ? 'light' : 'dark');
  }
  applyTheme();
  if (themeQuery && themeQuery.addEventListener) themeQuery.addEventListener('change', applyTheme);
  let state = {
    cat: 'Beautiful50',
    query: '',
    view: prefs.view === 'table' ? 'table' : 'card',
    langMode: 'both',  // 한글 우선 + 원문 토글
    page: 1,
    perPage: 48
  };

  // 필터 상태는 URL 해시에 저장 → 링크로 공유 가능 (예: #cat=Messier&q=m31&page=2)
  const HASH_KEYS = { cat: 'cat', q: 'query', page: 'page' };
  const HASH_DEFAULTS = { cat: 'Beautiful50', query: '', page: 1 };
  function readHash() {
    const params = new URLSearchParams(location.hash.slice(1));
    Object.entries(HASH_KEYS).forEach(([key, field]) => {
      const v = params.get(key);
      state[field] = v === null ? HASH_DEFAULTS[field] : (field === 'page' ? Math.max(1, parseInt(v, 10) || 1) : v);
    });
  }
  function writeHash() {
    const params = new URLSearchParams();
    Object.entries(HASH_KEYS).forEach(([key, field]) => {
      if (state[field] !== HASH_DEFAULTS[field]) params.set(key, state[field]);
    });
    const hash = params.toString();
    const url = location.pathname + location.search + (hash ? '#' + hash : '');
    try {
      if (url !== location.pathname + location.search + location.hash) history.replaceState(null, '', url);
    } catch (e) {}
  }
  readHash();
  let expandedOrigSet = new Set();

  // 목록별 은하 개수
  const catCounts = {
    ALL: ALL_GALAXIES.length,
    Messier: 0,
    Caldwell: 0,
    OMeara: 0,
    Challenge: 0,
    Beautiful50: 0,
    Brightest50: 0,
    Largest10: 0,
    Smallest10: 0,
    NamedPersons: 0
  };

  ALL_GALAXIES.forEach(g => {
    const cats = g.catalogs || [];
    if (cats.includes('Messier')) catCounts.Messier++;
    if (cats.includes('Caldwell')) catCounts.Caldwell++;
    if (cats.includes('OMeara')) catCounts.OMeara++;
    if (cats.includes('Challenge') || g.arp) catCounts.Challenge++;
    if (cats.includes('Beautiful50')) catCounts.Beautiful50++;
    if (cats.includes('Brightest50')) catCounts.Brightest50++;
    if (cats.includes('Largest10')) catCounts.Largest10++;
    if (cats.includes('Smallest10')) catCounts.Smallest10++;
    if (cats.includes('NamedPersons')) catCounts.NamedPersons++;
  });

  // 목록 선택 상자: 각 항목 뒤에 은하 개수 표시
  const catalogSelect = document.getElementById('catalogSelect');
  function setCatCount(k, n) {
    const opt = catalogSelect.querySelector(`option[value="${k}"]`);
    if (opt) opt.textContent = `${opt.getAttribute('data-label')} (${n})`;
  }
  Object.keys(catCounts).forEach(k => setCatCount(k, catCounts[k]));
  function updateBookmarkCount() {
    setCatCount('BOOKMARK', bookmarks.size);
  }
  updateBookmarkCount();

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 카드용 한글 이름: 별자리는 바로 위 배지에 있으므로 이름 앞의 별자리를 뺌.
  // 단, 기술어 자체가 별자리 이름인 은하(전갈·고래·게·궁수·뱀·용·컴퍼스)는
  // 다른 별자리에 있는 것으로 오해하지 않도록 "조각가의 전갈 은하"처럼 별자리를 남김.
  const KEEP_CONSTELLATION_NOS = new Set([65, 335, 554, 614, 791, 795, 846, 957]);
  function cardNameKo(g) {
    const prefix = (g.constellation_ko || '') + ' ';
    if (!g.name_ko || !g.name_ko.startsWith(prefix)) return g.name_ko || '';
    const rest = g.name_ko.slice(prefix.length);
    return KEEP_CONSTELLATION_NOS.has(g.no) ? `${g.constellation_ko}의 ${rest}` : rest;
  }

  function filterAndSort() {
    const q = state.query.trim().toLowerCase();
    const qCompact = compactQuery(q);
    let list = ALL_GALAXIES.filter(g => {
      // Category tab
      const cats = g.catalogs || [];
      if (state.cat === 'Messier' && !cats.includes('Messier')) return false;
      if (state.cat === 'Caldwell' && !cats.includes('Caldwell')) return false;
      if (state.cat === 'OMeara' && !cats.includes('OMeara')) return false;
      if (state.cat === 'Challenge' && !(cats.includes('Challenge') || g.arp)) return false;
      if (state.cat === 'Beautiful50' && !cats.includes('Beautiful50')) return false;
      if (state.cat === 'Brightest50' && !cats.includes('Brightest50')) return false;
      if (state.cat === 'Largest10' && !cats.includes('Largest10')) return false;
      if (state.cat === 'Smallest10' && !cats.includes('Smallest10')) return false;
      if (state.cat === 'NamedPersons' && !cats.includes('NamedPersons')) return false;
      if (state.cat === 'BOOKMARK' && !bookmarks.has(g.no)) return false;

      // Query string
      if (q && !g._hay.includes(q) && !g._hayCompact.includes(qCompact)) return false;
      return true;
    });

    // 정렬: CMG 번호순, 특별 목록은 원서의 목록 순서(순위)대로
    const listPos = LIST_ORDER[state.cat];
    list.sort((a, b) => {
      if (listPos) return (listPos.get(a.no) ?? 999) - (listPos.get(b.no) ?? 999) || a.no - b.no;
      return a.no - b.no;
    });

    return list;
  }

  function renderPagination(totalItems, totalPages) {
    const topEl = document.getElementById('topPagination');
    const botEl = document.getElementById('bottomPagination');
    if (totalPages <= 1) {
      topEl.innerHTML = '';
      botEl.innerHTML = '';
      return;
    }

    let html = `<button class="page-btn" data-page="${state.page - 1}" ${state.page <= 1 ? 'disabled' : ''}>◀ 이전</button>`;
    const startP = Math.max(1, state.page - 3);
    const endP = Math.min(totalPages, state.page + 3);
    if (startP > 1) {
      html += `<button class="page-btn" data-page="1">1</button>`;
      if (startP > 2) html += `<span style="padding:0 0.25rem;">...</span>`;
    }
    for (let p = startP; p <= endP; p++) {
      html += `<button class="page-btn ${p === state.page ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
    if (endP < totalPages) {
      if (endP < totalPages - 1) html += `<span style="padding:0 0.25rem;">...</span>`;
      html += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    html += `<button class="page-btn" data-page="${state.page + 1}" ${state.page >= totalPages ? 'disabled' : ''}>다음 ▶</button>`;

    topEl.innerHTML = html;
    botEl.innerHTML = html;
  }

  function render() {
    if (!ALL_GALAXIES.length) {
      document.getElementById('catalogContent').innerHTML = `<div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:3rem; text-align:center; color:var(--text-secondary);">은하 자료 파일(<code>cmg_1000_catalog.js</code>)을 불러오지 못했습니다. HTML의 자료 경로를 확인하거나 <code>python build.py</code>로 자료 파일을 만들어 주세요.</div>`;
      document.getElementById('resultSummaryText').textContent = '';
      return;
    }
    writeHash();
    renderListInfo();
    const filtered = filterAndSort();
    const total = filtered.length;
    // 특별 목록(최대 54개)은 나누지 않고 한 페이지에 모두
    const perPage = LIST_ORDER[state.cat] ? Math.max(1, total) : state.perPage;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    if (state.page > totalPages) state.page = totalPages;

    const startIdx = (state.page - 1) * perPage;
    const pageItems = filtered.slice(startIdx, startIdx + perPage);

    document.getElementById('resultSummaryText').innerHTML =
      `검색 결과: 총 <strong>${total.toLocaleString()}</strong>개 은하 (현재 ${state.page} / ${totalPages} 페이지 · ${startIdx + (total ? 1 : 0)}~${startIdx + pageItems.length}번째 표시)`;
    document.getElementById('bottomSummaryText').innerHTML =
      `총 ${total.toLocaleString()}개 중 ${startIdx + (total ? 1 : 0)}~${startIdx + pageItems.length}번째 은하`;

    renderPagination(total, totalPages);

    const container = document.getElementById('catalogContent');
    if (total === 0) {
      container.innerHTML = `<div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:3rem; text-align:center; color:var(--text-secondary);">조건에 일치하는 은하가 없습니다. 검색어나 필터를 초기화해 보세요.</div>`;
      return;
    }

    if (state.view === 'card') {
      const cardsHtml = pageItems.map(g => {
        const isSaved = bookmarks.has(g.no);
        const showOrig = state.langMode === 'all_open' || state.langMode === 'en_only' || expandedOrigSet.has(g.no);
        const showKo = state.langMode !== 'en_only';

        const constBadge = g.constellation && g.constellation !== '-' ? `<span class="badge">${escapeHtml(g.constellation_ko)} (${escapeHtml(g.constellation)})</span>` : '';
        let badges = '';
        if (g.messier) badges += `<span class="badge messier">${escapeHtml(g.messier)}</span>`;
        if (g.caldwell) badges += `<span class="badge caldwell">${escapeHtml(g.caldwell)}</span>`;
        if (g.omeara) badges += `<span class="badge omeara">${escapeHtml(g.omeara)}</span>`;
        badges += rankBadges(g);

        const commonKoStr = (g.common_names_ko && g.common_names_ko.length)
          ? ` · <span style="color:var(--accent-gold);">${escapeHtml(g.common_names_ko.join(', '))}</span>`
          : '';

        const distDisp = g.d_mpc !== '-' ? `${g.d_mpc} Mpc` : (g.dh_mpc !== '-' ? `${g.dh_mpc} Mpc (DH)` : '-');
        const sizeDisp = g.d_mi && g.d_mi !== '-' ? `${g.d_ma} × ${g.d_mi}` : g.d_ma;
        const morphDisp = g.rc3_class !== '-' ? g.rc3_class : g.hs_class;

        return `
        <article class="galaxy-card" data-no="${g.no}">
          <div class="card-top">
            <div>
              <div class="id-group">
                <span class="cmg-no">CMG #${g.no}</span>
                ${constBadge}
                <span class="primary-id">${escapeHtml(g.primary_id)}</span>
                ${g.alt_ids && g.alt_ids.length ? `<span class="alt-ids">(${escapeHtml(g.alt_ids.join(', '))})</span>` : ''}
              </div>
              ${badges ? `<div class="badge-row" style="margin-top:0.4rem;">${badges}</div>` : ''}
            </div>
            <button class="bookmark-btn ${isSaved ? 'saved' : ''}" data-bm="${g.no}" type="button" title="관측 북마크 저장/해제">
              ${isSaved ? '★' : '☆'}
            </button>
          </div>

          <div class="naming-box naming-one-line">
            ${showKo ? `<span class="name-ko-line" title="${escapeHtml(g.name_ko)}"><span class="desc-ko-highlight">${escapeHtml(cardNameKo(g))}</span>${commonKoStr}</span>` : ''}
            <span class="name-orig-line">${escapeHtml(g.accentuated_name)} — "${escapeHtml(g.descriptor_en)}"</span>
          </div>

          ${personBox(g)}

          <div class="card-body-row">
            ${cardThumb(g)}
            <div class="exp-box">
              ${showKo ? `<div class="exp-ko">${escapeHtml(g.explanation_ko)}</div>` : ''}
              ${showOrig ? `<div class="exp-en"><strong>[원문 제10열]</strong> ${escapeHtml(g.accentuated_name)} – ${escapeHtml(g.explanation_en)}</div>` : ''}
            </div>
          </div>

          <div class="specs-grid">
            <div class="spec-item"><span class="spec-label">겉보기등급 (m_vis)</span><span class="spec-val">${escapeHtml(g.m_vis)} (SB: ${escapeHtml(g.sb)})</span></div>
            <div class="spec-item"><span class="spec-label">시직경 (장×단)</span><span class="spec-val">${escapeHtml(sizeDisp)}</span></div>
            <div class="spec-item"><span class="spec-label">형태분류 (RC3)</span><span class="spec-val" title="${escapeHtml(morphDisp)}">${escapeHtml(morphDisp)}</span></div>
            <div class="spec-item"><span class="spec-label">거리 / 실제지름</span><span class="spec-val">${escapeHtml(distDisp)} / ${escapeHtml(g.diameter_kly)}</span></div>
          </div>

          <div class="card-actions">
            <span style="color:var(--text-muted);">J2000: ${escapeHtml(g.eq_coord)} · <span title="CMG Vol. I 원서 쪽수">CMG p.${g.book_page || g.page + 30}</span></span>
            <div>
              ${state.langMode === 'both' ? `<button class="link-btn" data-toggle-orig="${g.no}" type="button">${showOrig ? '원문 접기 ▲' : '원문 보기 ▼'}</button>` : ''}
              <button class="link-btn" data-open-detail="${g.no}" type="button">1~10열 상세 제원 ➔</button>
            </div>
          </div>
        </article>`;
      }).join('');
      container.innerHTML = `<div class="cards-grid">${cardsHtml}</div>`;
    } else {
      // 10-Column Standard Table View
      const rowsHtml = pageItems.map(g => {
        const showOrig = state.langMode === 'all_open' || state.langMode === 'en_only' || expandedOrigSet.has(g.no);
        const showKo = state.langMode !== 'en_only';
        return `
        <tr data-open-detail="${g.no}" tabindex="0" aria-label="${escapeHtml(g.primary_id)} 상세 제원 열기">
          <td><strong>${g.no}</strong>${rankBadges(g, true)}</td>
          <td>
            <strong>${escapeHtml(g.primary_id)}</strong><br>
            <span style="color:var(--text-secondary); font-size:0.75rem;">${escapeHtml((g.alt_ids || []).join(', '))}</span>
          </td>
          <td>
            ${escapeHtml(g.eq_coord)}<br>
            <strong>${escapeHtml(g.constellation_ko)}</strong> (${escapeHtml(g.constellation)})<br>
            <span style="color:var(--text-muted); font-size:0.73rem;">${escapeHtml(g.atlases)}</span>
          </td>
          <td>
            d<sub>ma</sub>: ${escapeHtml(g.d_ma)}<br>
            d<sub>mi</sub>: ${escapeHtml(g.d_mi)}<br>
            PA: ${escapeHtml(g.pa)} / i: ${escapeHtml(g.inclination)}
          </td>
          <td>
            m<sub>vis</sub>: <strong>${escapeHtml(g.m_vis)}</strong><br>
            SB: ${escapeHtml(g.sb)}<br>
            B-V: ${escapeHtml(g.b_v)}<br>
            M<sub>B</sub>: ${escapeHtml(g.m_b)}
          </td>
          <td>
            HS: ${escapeHtml(g.hs_class)}<br>
            RC3: ${escapeHtml(g.rc3_class)}<br>
            ${g.activity !== '-' ? `Act: ${escapeHtml(g.activity)}<br>` : ''}
            ${escapeHtml(g.t_lc)}<br>
            <span style="color:var(--accent-primary);">${escapeHtml(g.group_cluster)}</span>
          </td>
          <td>
            z: ${escapeHtml(g.z)}<br>
            v<sub>hc</sub>: ${escapeHtml(g.v_hc)}<br>
            D<sub>H</sub>: ${escapeHtml(g.dh_mpc)} Mpc<br>
            D: ${escapeHtml(g.d_mpc)} Mpc
          </td>
          <td>
            <strong>${escapeHtml(g.diameter_kly)}</strong><br>
            <span style="color:var(--accent-gold); font-size:0.74rem;">${escapeHtml((g.supernovae || []).join(', ') || '-')}</span>
          </td>
          <td>
            ${showKo ? `<strong style="color:var(--accent-primary);">${escapeHtml(g.descriptor_ko)}</strong><br>` : ''}
            <em>${escapeHtml(g.latin_name)}</em><br>
            <span style="color:var(--text-secondary);">"${escapeHtml(g.descriptor_en)}"</span>
          </td>
          <td style="min-width:320px;">
            ${showKo ? `<div style="margin-bottom:0.35rem;">${escapeHtml(g.explanation_ko)}</div>` : ''}
            ${showOrig ? `<div style="color:var(--text-secondary); font-size:0.76rem; border-top:1px dashed var(--border-color); padding-top:0.3rem;"><strong>${escapeHtml(g.accentuated_name)}</strong> – ${escapeHtml(g.explanation_en)}</div>` : ''}
          </td>
        </tr>`;
      }).join('');

      container.innerHTML = `
      <div class="table-wrap">
        <table class="cmg-table">
          <thead>
            <tr>
              <th>1. No.</th>
              <th>2. Identification</th>
              <th>3. Coordinates &amp; Atlases</th>
              <th>4. d_ma / d_mi / PA / i</th>
              <th>5. m_vis / SB / B-V / M_B</th>
              <th>6. Classification &amp; Group</th>
              <th>7. z / v / Distance</th>
              <th>8. Diameter &amp; SN</th>
              <th>9. Name &amp; Translation</th>
              <th>10. Explanation (한글 &amp; 원문)</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;
    }
  }

  // ===== 은하 사진: 좌표와 겉보기 크기로 사진 서버에서 바로 받아 옴 =====
  // 저해상도 사진은 sf_data/cmg1000/fetch_images.py로 img/dss240, img/dss480에 백업해 두고 먼저 보여 줌.
  // 시도 순서: 백업 파일 → CDS hips2fits → Legacy Survey 컷아웃 (CDS가 멈췄을 때 예비)
  // 주소 계산은 fetch_images.py와 같아야 함
  // 하늘에서 너무 큰 천체(소·대마젤란은하, 우리은하, 궁수 왜소타원체은하)는 사진 대신 링크만
  const NO_IMAGE_NOS = new Set([36, 990, 993, 998]);
  const CDS_HOST = 'alasky.cds.unistra.fr';
  let cdsDown = false;   // CDS가 응답하지 않으면 true → 그 뒤로는 예비 서버로 바로 받음
  const IMAGE_SURVEYS = {
    dss: { hips: 'CDS/P/DSS2/color', label: 'DSS2 컬러 (전천)' },
    legacy: { hips: 'CDS/P/DESI-Legacy-Surveys/DR10/color', label: '고해상도 (Legacy Surveys)' }
  };
  // 사진 출처별 표시 (이름은 fetch_images.py의 SOURCES와 같음)
  const IMAGE_SOURCES = {
    dss: 'DSS2 (POSS-II/UKSTU, © AURA/STScI), CDS hips2fits',
    legacy: 'DESI Legacy Imaging Surveys DR10, CDS hips2fits',
    'ls-dr10': 'DESI Legacy Imaging Surveys DR10, legacysurvey.org',
    'unwise-neo7': 'unWISE 적외선 (NASA WISE/NEOWISE), legacysurvey.org'
  };
  // 백업 사진마다 받은 서버 (img/sources.js, fetch_images.py가 만듦). 없으면 모두 DSS2로 봄
  const BACKUP_SOURCES = window.CMG1000_IMAGE_SOURCES || {};
  function parseJ2000(s) {
    const m = /^J(\d{2})(\d{2})(\d{2}(?:\.\d+)?)([+-])(\d{2})(\d{2})(\d{2}(?:\.\d+)?)/.exec(s || '');
    if (!m) return null;
    const ra = (Number(m[1]) + Number(m[2]) / 60 + Number(m[3]) / 3600) * 15;
    const dec = (m[4] === '-' ? -1 : 1) * (Number(m[5]) + Number(m[6]) / 60 + Number(m[7]) / 3600);
    return { ra, dec };
  }
  function skyPos(g) {
    return NO_IMAGE_NOS.has(g.no) ? null : parseJ2000(g.eq_coord);
  }
  // 사진 시야 = 은하 장축 × 배율 (최소 2′, 최대 4°). 크기 값이 없으면 장축 2.5′로 봄.
  // 저해상도(DSS2)는 은하를 크게 보이도록 1.2배, 고해상도는 주변까지 1.8배
  const FOV_FACTOR = { dss: 1.2, legacy: 1.8 };
  function fovDeg(g, survey) {
    const d = g.d_ma_arcmin || 2.5;
    return Math.min(4, Math.max(2 / 60, d * (FOV_FACTOR[survey] || 1.2) / 60));
  }
  function fovText(g, survey) {
    const a = fovDeg(g, survey) * 60;
    return a >= 60 ? `${(a / 60).toFixed(1)}°` : `${a.toFixed(1)}′`;
  }
  function photoCaption(g, survey, source) {
    return `시야 ${fovText(g, survey)} · 북쪽 위, 동쪽 왼쪽 · 사진: ${IMAGE_SOURCES[source || survey]}`;
  }
  function imageUrl(g, survey, px) {
    const p = skyPos(g);
    if (!p) return '';
    return 'https://alasky.cds.unistra.fr/hips-image-services/hips2fits?hips=' + encodeURIComponent(IMAGE_SURVEYS[survey].hips) +
      `&ra=${p.ra.toFixed(5)}&dec=${p.dec.toFixed(5)}&fov=${fovDeg(g, survey).toFixed(4)}&width=${px}&height=${px}&projection=TAN&format=jpg`;
  }
  // Legacy Survey 컷아웃: 시야 대신 픽셀 크기(초각/픽셀)를 받으므로 같은 범위가 되도록 환산
  function legacyCutoutUrl(g, survey, px) {
    const p = skyPos(g);
    if (!p) return '';
    const pixscale = (fovDeg(g, survey) * 3600 / px).toFixed(3);
    return `https://www.legacysurvey.org/viewer/cutout.jpg?ra=${p.ra.toFixed(5)}&dec=${p.dec.toFixed(5)}&layer=ls-dr10&pixscale=${pixscale}&size=${px}`;
  }
  function backupUrl(g, survey, px) {
    return survey === 'dss' && skyPos(g) ? `img/dss${px}/${String(g.no).padStart(4, '0')}.jpg` : '';
  }
  // 시도할 사진 주소 목록 [[주소, 출처], ...]
  function photoChain(g, survey, px) {
    const chain = [];
    const backup = backupUrl(g, survey, px);
    if (backup) chain.push([backup, BACKUP_SOURCES[String(g.no).padStart(4, '0')] || 'dss']);
    // Legacy 컷아웃은 처음 만드는 사진이면 가끔 실패하고 다시 요청하면 뜸 → 한 번 더 시도
    const ls = legacyCutoutUrl(g, survey, px);
    chain.push([imageUrl(g, survey, px), survey], [ls, 'ls-dr10'], [ls + '&retry=1', 'ls-dr10']);
    return cdsDown ? chain.filter(([url]) => !url.includes(CDS_HOST)) : chain;
  }
  // <img> 속성: 첫 주소를 src로, 나머지를 data-fallback("주소|출처" 공백 구분)으로
  function photoAttrs(g, survey, px) {
    const [[src, source], ...rest] = photoChain(g, survey, px);
    return `src="${src}" data-source="${source}" data-fallback="${rest.map(x => x.join('|')).join(' ')}"`;
  }
  function setPhoto(img, g, survey, px) {
    const [[src, source], ...rest] = photoChain(g, survey, px);
    img.setAttribute('data-fallback', rest.map(x => x.join('|')).join(' '));
    img.setAttribute('data-source', source);
    img.src = src;
  }
  // 다음 주소로 넘어감. CDS가 응답하지 않는다고 판단했으면 CDS 주소는 건너뜀.
  // 넘어갈 주소가 없으면 목록 썸네일은 숨김
  function nextPhoto(img) {
    let rest = (img.getAttribute('data-fallback') || '').split(' ').filter(Boolean);
    if (cdsDown) rest = rest.filter(x => !x.includes(CDS_HOST));
    const [next, ...more] = rest;
    img.removeAttribute('data-t');
    if (next) {
      const [url, source] = next.split('|');
      img.setAttribute('data-fallback', more.join(' '));
      img.setAttribute('data-source', source);
      img.src = url;
    } else {
      img.setAttribute('data-fallback', '');
      if (img.parentNode.classList.contains('card-thumb')) img.parentNode.classList.add('img-failed');
    }
  }
  // (img의 error·load 이벤트는 버블링되지 않아 capture 단계에서 받음)
  document.addEventListener('error', e => {
    if (e.target instanceof HTMLImageElement && e.target.hasAttribute('data-source')) nextPhoto(e.target);
  }, true);
  // CDS가 멈추면 오류 없이 접속만 오래 기다리는 경우가 있음 → 화면에 보이는 CDS 사진이
  // 8초 안에 뜨지 않으면 CDS가 멈춘 것으로 보고, 그 뒤로는 CDS를 건너뛰고 예비 서버로 받음
  setInterval(() => {
    const now = Date.now();
    document.querySelectorAll(`img[data-source][src*="${CDS_HOST}"]`).forEach(img => {
      if (img.complete) return;
      if (cdsDown) return nextPhoto(img);
      const r = img.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || !r.width) return;   // 화면 밖(아직 안 받는 사진)
      const t = Number(img.getAttribute('data-t'));
      if (!t) img.setAttribute('data-t', now);
      else if (now - t > 8000) { cdsDown = true; nextPhoto(img); }
    });
  }, 1000);
  // 상세 사진이 뜨면 실제로 받은 출처로 사진 설명을 맞춤
  document.addEventListener('load', e => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || img.id !== 'detailPhoto') return;
    const credit = document.getElementById('detailPhotoCredit');
    const g = GALAXY_BY_NO.get(Number(img.getAttribute('data-no')));
    if (credit && g) credit.textContent = photoCaption(g, img.getAttribute('data-survey'), img.getAttribute('data-source'));
  }, true);
  // 위키백과·NED·SIMBAD 검색용 이름: "NGC 0010" → "NGC 10", 메시에 은하는 "Messier 31"
  function lookupName(g) {
    if (g.messier && /^Messier \d+$/.test(g.messier)) return g.messier;
    const m = /^(NGC|IC|UGC|UGCA|PGC)\s*0*(\d+)(.*)$/.exec(g.primary_id || '');
    if (m) return `${m[1]} ${m[2]}${m[3]}`;
    return (g.common_names_en && g.common_names_en[0]) || g.primary_id;
  }
  function externalLinks(g) {
    const name = encodeURIComponent(lookupName(g));
    const p = parseJ2000(g.eq_coord);
    const links = [
      [`https://ko.wikipedia.org/w/index.php?search=${name}`, '위키백과(한국어)'],
      [`https://en.wikipedia.org/w/index.php?search=${name}`, 'Wikipedia'],
    ];
    if (p) {
      const fovA = Math.min(10, Math.max(0.1, fovDeg(g, 'legacy') * 2)).toFixed(2);
      links.push([`https://aladin.cds.unistra.fr/AladinLite/?target=${p.ra.toFixed(5)}%20${p.dec.toFixed(5)}&fov=${fovA}&survey=P%2FDSS2%2Fcolor`, 'Aladin 하늘 지도']);
    }
    links.push([`https://ned.ipac.caltech.edu/byname?objname=${name}`, 'NED'],
               [`https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${name}`, 'SIMBAD']);
    return links.map(([url, label]) => `<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join('');
  }
  function cardThumb(g) {
    if (!skyPos(g)) return '';
    return `<button class="card-thumb" type="button" data-open-detail="${g.no}" title="사진 크게 보기 (DSS2)">` +
      `<img ${photoAttrs(g, 'dss', 240)} alt="${escapeHtml(g.primary_id)} 사진" width="120" height="120" loading="lazy" decoding="async"></button>`;
  }
  function detailPhoto(g) {
    const links = `<div class="photo-links">${externalLinks(g)}</div>`;
    if (!skyPos(g)) {
      return `<div class="photo-box"><p class="photo-note">하늘에서 아주 넓게 퍼진 천체라 자동 사진 대신 아래 링크에서 보세요.</p>${links}</div>`;
    }
    return `<div class="photo-box">
        <figure class="photo-figure">
          <img id="detailPhoto" ${photoAttrs(g, 'dss', 480)} data-no="${g.no}" data-survey="dss" alt="${escapeHtml(g.primary_id)} 사진" width="480" height="480" decoding="async">
          <figcaption>
            <div class="photo-switch" role="group" aria-label="사진 종류">
              ${Object.entries(IMAGE_SURVEYS).map(([k, s]) => `<button class="guide-tab${k === 'dss' ? ' active' : ''}" type="button" data-survey="${k}" data-no="${g.no}">${s.label}</button>`).join('')}
            </div>
            <span class="photo-credit" id="detailPhotoCredit">${photoCaption(g, 'dss')}</span>
            <span class="photo-note">고해상도 사진은 일부 하늘(특히 우리은하 근처)에서 비어 있을 수 있습니다.</span>
          </figcaption>
        </figure>
        ${links}
      </div>`;
  }

  function openDetailModal(no) {
    const g = ALL_GALAXIES.find(x => x.no === Number(no));
    if (!g) return;
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailModalContent');

    content.innerHTML = `
      <div class="modal-header">
        <div>
          <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
            <span class="cmg-no">CMG #${g.no} (원본 p.${g.book_page || g.page + 30})</span>
            <h2 id="detailModalTitle" style="font-size:1.4rem; font-weight:800;">${escapeHtml(g.primary_id)} ${g.alt_ids && g.alt_ids.length ? `(${escapeHtml(g.alt_ids.join(', '))})` : ''}</h2>
          </div>
          <p style="font-size:1.05rem; font-weight:700; color:var(--accent-primary); margin-top:0.35rem;">
            ${escapeHtml(g.name_ko)} — "${escapeHtml(g.descriptor_ko)}"
            <span style="font-weight:400; color:var(--text-secondary); font-style:italic;">(${escapeHtml(g.accentuated_name)} · "${escapeHtml(g.descriptor_en)}")</span>
          </p>
        </div>
        <button class="modal-close" id="closeDetailModalBtn" type="button">✕ 닫기</button>
      </div>

      ${detailPhoto(g)}

      <div style="background:var(--bg-card); border-left:4px solid var(--accent-primary); padding:1rem; border-radius:8px; margin-bottom:1rem;">
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent-primary); margin-bottom:0.3rem;">제10열: 학명 해설 (한글 번역)</div>
        <p style="font-size:0.95rem; line-height:1.6; margin-bottom:0.75rem;">${escapeHtml(g.explanation_ko)}</p>
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent-gold); margin-bottom:0.3rem;">제10열: 원문 해설 (Original Text &amp; Polytonic Greek Etymology)</div>
        <p style="font-size:0.9rem; line-height:1.6; color:var(--text-secondary); background:var(--bg-primary); padding:0.75rem; border-radius:6px;">
          <strong>${escapeHtml(g.accentuated_name)}</strong> – ${escapeHtml(g.explanation_en)}
        </p>
        <p class="guide-source" style="margin:0.6rem 0 0;">📚 출처: Bodifee &amp; Berger, <em>CMG, A Catalogue of One Thousand Galaxies</em>, Vol. I (2010), p.${g.book_page || g.page + 30}, 제1~10열. 학명과 원문 해설은 원서, 한글 번역은 별바라기(StarFlower).</p>
      </div>

      ${g.person ? `<div style="margin-bottom:1rem;">${personBox(g)}</div>` : ''}
      <div class="detail-10col-grid">
        <div class="col-box">
          <div class="col-box-title">제1~2열 · 식별 번호 및 다중 목록</div>
          <p><strong>CMG 번호:</strong> #${g.no}</p>
          <p><strong>주 식별명:</strong> ${escapeHtml(g.primary_id)}</p>
          <p><strong>이명 / 타 목록:</strong> ${escapeHtml((g.alt_ids || []).join(', ') || '-')}</p>
          <p><strong>관용 영문/한글명:</strong> ${escapeHtml((g.common_names_ko || []).join(', ') || '-')}</p>
          ${rankBadges(g) ? `<p class="badge-row" style="margin-top:0.4rem;">${rankBadges(g)}</p>` : ''}
        </div>
        <div class="col-box">
          <div class="col-box-title">제3열 · 천구 좌표 및 수록 성도</div>
          <p><strong>별자리:</strong> ${escapeHtml(g.constellation_ko)} (${escapeHtml(g.constellation)})</p>
          <p><strong>적도좌표 (J2000):</strong> ${escapeHtml(g.eq_coord)}</p>
          <p><strong>은하좌표 (G):</strong> ${escapeHtml(g.gal_coord)}</p>
          <p><strong>초은하좌표 (SG):</strong> ${escapeHtml(g.sgal_coord)}</p>
          <p><strong>수록 성도 (U/H/C/V):</strong> ${escapeHtml(g.atlases)}</p>
        </div>
        <div class="col-box">
          <div class="col-box-title">제4~5열 · 시직경 · 방향 · 측광 데이터</div>
          <p><strong>장축 × 단축 (d<sub>ma</sub> × d<sub>mi</sub>):</strong> ${escapeHtml(g.d_ma)} × ${escapeHtml(g.d_mi)}</p>
          <p><strong>위치각 (P.A.) / 경사각 (i):</strong> ${escapeHtml(g.pa)} / ${escapeHtml(g.inclination)}</p>
          <p><strong>겉보기 안시등급 (m<sub>vis</sub>):</strong> ${escapeHtml(g.m_vis)}</p>
          <p><strong>표면밝기 (S.B.):</strong> ${escapeHtml(g.sb)} mag/arcmin²</p>
          <p><strong>색지수 (B-V) / 절대등급 (M<sub>B</sub>):</strong> ${escapeHtml(g.b_v)} / ${escapeHtml(g.m_b)}</p>
        </div>
        <div class="col-box">
          <div class="col-box-title">제6~8열 · 형태 분류 · 물리량 · 초신성</div>
          <p><strong>허블-샌디지 (HS) / RC3.9:</strong> ${escapeHtml(g.hs_class)} / ${escapeHtml(g.rc3_class)}</p>
          <p><strong>활동성 / 나선팔 등급 (AC):</strong> ${escapeHtml(g.activity)} / ${escapeHtml(g.arm_class)}</p>
          <p><strong>형태지수 (T) / 광도계급 (LC):</strong> ${escapeHtml(g.t_lc)}</p>
          <p><strong>소속 은하군/은하단:</strong> ${escapeHtml(g.group_cluster)}</p>
          <p><strong>적색편이 (z) / 시선속도:</strong> z=${escapeHtml(g.z)} (v<sub>hc</sub>=${escapeHtml(g.v_hc)}, v<sub>gc</sub>=${escapeHtml(g.v_gc)})</p>
          <p><strong>거리 (D<sub>H</sub> / D):</strong> ${escapeHtml(g.dh_mpc)} Mpc / ${escapeHtml(g.d_mpc)} Mpc</p>
          <p><strong>실제 선형 지름 / 초신성:</strong> ${escapeHtml(g.diameter_kly)} / ${escapeHtml((g.supernovae || []).join(', ') || '기록 없음')}</p>
        </div>
      </div>
    `;
    openModal(modal);
    document.getElementById('closeDetailModalBtn').onclick = () => closeModal(modal);
  }

  // 모달 열기/닫기: 열 때 닫기 버튼으로 포커스, 닫으면 원래 위치로 포커스 복귀
  let lastFocused = null;
  function openModal(modal) {
    if (!modal.classList.contains('open')) lastFocused = document.activeElement;
    modal.classList.add('open');
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }
  function closeModal(modal) {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
  }
  document.addEventListener('keydown', e => {
    const modal = document.querySelector('.modal-backdrop.open');
    if (!modal) return;
    if (e.key === 'Escape') {
      closeModal(modal);
    } else if (e.key === 'Tab') {
      // 포커스가 모달 밖으로 나가지 않게 가둠
      const focusables = modal.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Event Listeners
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const viewCardBtn = document.getElementById('viewCardBtn');
  const viewTableBtn = document.getElementById('viewTableBtn');

  // 현재 state를 화면의 컨트롤(목록 선택·입력창·선택 상자·버튼)에 반영
  function syncControls() {
    if (!catalogSelect.querySelector(`option[value="${state.cat}"]`)) state.cat = HASH_DEFAULTS.cat;
    catalogSelect.value = state.cat;
    searchInput.value = state.query;
    clearBtn.style.display = state.query ? 'block' : 'none';
    viewCardBtn.classList.toggle('btn-primary', state.view === 'card');
    viewTableBtn.classList.toggle('btn-primary', state.view === 'table');
    viewCardBtn.setAttribute('aria-pressed', state.view === 'card');
    viewTableBtn.setAttribute('aria-pressed', state.view === 'table');
  }

  catalogSelect.addEventListener('change', () => {
    state.cat = catalogSelect.value;
    state.page = 1;
    syncControls();
    render();
  });

  // 입력이 멈춘 뒤 150ms 후에 검색 (Enter는 즉시)
  let searchTimer = null;
  function executeSearch() {
    clearTimeout(searchTimer);
    state.query = searchInput.value;
    clearBtn.style.display = state.query ? 'block' : 'none';
    state.page = 1;
    render();
  }
  searchInput.addEventListener('input', () => {
    clearBtn.style.display = searchInput.value ? 'block' : 'none';
    clearTimeout(searchTimer);
    searchTimer = setTimeout(executeSearch, 150);
  });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    executeSearch();
    searchInput.focus();
  });


  function setView(view) {
    state.view = view;
    savePrefs();
    syncControls();
    render();
  }
  viewCardBtn.addEventListener('click', () => setView('card'));
  viewTableBtn.addEventListener('click', () => setView('table'));

  function handlePageClick(e) {
    const btn = e.target.closest('.page-btn');
    if (!btn || btn.disabled) return;
    state.page = Number(btn.getAttribute('data-page'));
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.getElementById('topPagination').addEventListener('click', handlePageClick);
  document.getElementById('bottomPagination').addEventListener('click', handlePageClick);

  const catalogContent = document.getElementById('catalogContent');
  catalogContent.addEventListener('click', e => {
    const bmBtn = e.target.closest('[data-bm]');
    if (bmBtn) {
      e.stopPropagation();
      const no = Number(bmBtn.getAttribute('data-bm'));
      if (bookmarks.has(no)) bookmarks.delete(no);
      else bookmarks.add(no);
      saveBookmarks(bookmarks);
      updateBookmarkCount();
      render();
      const again = catalogContent.querySelector(`[data-bm="${no}"]`);
      if (again) again.focus();
      return;
    }
    const origBtn = e.target.closest('[data-toggle-orig]');
    if (origBtn) {
      e.stopPropagation();
      const no = Number(origBtn.getAttribute('data-toggle-orig'));
      if (expandedOrigSet.has(no)) expandedOrigSet.delete(no);
      else expandedOrigSet.add(no);
      render();
      const again = catalogContent.querySelector(`[data-toggle-orig="${no}"]`);
      if (again) again.focus();
      return;
    }
    const detailTrigger = e.target.closest('[data-open-detail]');
    if (detailTrigger) {
      openDetailModal(detailTrigger.getAttribute('data-open-detail'));
    }
  });
  // 표의 행은 키보드(Enter/Space)로도 상세 제원 열기
  catalogContent.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const row = e.target.closest('tr[data-open-detail]');
    if (!row || e.target !== row) return;
    e.preventDefault();
    openDetailModal(row.getAttribute('data-open-detail'));
  });

  // 브라우저 뒤로가기나 주소창에서 해시를 바꾼 경우
  window.addEventListener('hashchange', () => {
    readHash();
    syncControls();
    render();
  });

  // Modals
  const guideModal = document.getElementById('guideModal');
  const detailModal = document.getElementById('detailModal');
  document.getElementById('openGuideBtn').addEventListener('click', () => openModal(guideModal));
  document.getElementById('closeGuideBtn').addEventListener('click', () => closeModal(guideModal));
  guideModal.addEventListener('click', e => { if (e.target === guideModal) closeModal(guideModal); });
  detailModal.addEventListener('click', e => { if (e.target === detailModal) closeModal(detailModal); });
  // 상세 창: 사진 종류(DSS2 / 고해상도) 전환
  detailModal.addEventListener('click', e => {
    const b = e.target.closest('button[data-survey]');
    if (!b) return;
    const g = GALAXY_BY_NO.get(Number(b.getAttribute('data-no')));
    const key = b.getAttribute('data-survey');
    const img = document.getElementById('detailPhoto');
    img.setAttribute('data-survey', key);
    setPhoto(img, g, key, 480);
    b.parentNode.querySelectorAll('[data-survey]').forEach(x => x.classList.toggle('active', x === b));
  });

  // ===== 원서(2_Introduction.pdf) 특별 목록: 배지·인물 소개·목록 안내 =====
  function rankBadges(g, compact) {
    const out = [];
    const cats = g.catalogs || [];
    if (cats.includes('Beautiful50')) out.push(`<span class="badge beautiful">✨ 아름다운 50선</span>`);
    if (g.rank_brightest) out.push(`<span class="badge bright">🌟 밝기 ${g.rank_brightest.rank}위 · ${escapeHtml(g.rank_brightest.mag)}등급</span>`);
    if (g.rank_largest) out.push(`<span class="badge size">📏 큰 은하 ${g.rank_largest.rank}위 · ${g.rank_largest.diameter_kly} kly</span>`);
    if (g.rank_smallest) out.push(`<span class="badge size">🔬 작은 은하 ${g.rank_smallest.rank}위 · ${g.rank_smallest.diameter_kly} kly</span>`);
    if (g.person) out.push(`<span class="badge person">🏛️ ${escapeHtml(g.person.name_ko)}</span>`);
    if (!out.length) return '';
    return compact ? `<div class="badge-row" style="margin-top:0.35rem; flex-direction:column; align-items:flex-start;">${out.join('')}</div>` : out.join('');
  }

  function personBox(g) {
    if (!g.person) return '';
    const p = g.person;
    return `<div class="person-box"><div class="person-title">🏛️ 헌정 인물: ${escapeHtml(p.name_ko)} <span>(${escapeHtml(p.name_en)}, ${escapeHtml(p.years)})</span></div><div>${escapeHtml(p.bio_ko)}</div></div>`;
  }

  const LIST_INFO = {
    Messier: '샤를 메시에가 1781년 펴낸 110개 천체 목록 가운데 나중에 은하로 밝혀진 40개입니다. (원서 p.5)',
    Caldwell: '패트릭 무어가 아마추어 천문가를 위해 만든 콜드웰 목록에 실린 은하입니다. CMG는 메시에·콜드웰 목록의 은하를 모두 수록했습니다. (원서 p.5, 7)',
    OMeara: '스티븐 제임스 오마라의 『Hidden Treasures』에 실린 은하로, 원서 제2열에 ‘O\'Meara 번호’로 표기되어 있습니다. (원서 p.5, 10)',
    Beautiful50: '저자 중 한 명(Gerard Bodifee)이 CMG에서 가장 아름답다고 꼽은 50항목입니다. 일부는 짝을 이룬 은하 쌍이어서 실제 은하는 54개이며, 일부는 밝은 전경 별로 우아하게 장식되어 있습니다. 망원경으로 직접 본 것이 아니라 영상을 검토해 골랐습니다. 기본 정렬은 원서 표의 순서입니다. (원서 p.25–27)',
    Brightest50: '하늘에서 가장 밝은 은하 50개로, 모두 CMG 천체입니다. 순위와 겉보기 안시등급은 원서 표를 따릅니다. 우리은하의 등급(−5.8)은 절대등급 Mv = −20.5와 태양–은하 중심 거리 8600 pc로 계산한 값입니다. (원서 p.24–25)',
    Largest10: '실제 지름은 거리와 가시광 영상의 겉보기 지름으로 계산합니다. 거리는 오차가 크고 겉보기 지름은 경계가 모호해 매우 불확실한 값이지만, 그 값으로 본 가장 큰 은하 10개입니다. (원서 p.24)',
    Smallest10: '같은 방법으로 계산한 지름으로 본 가장 작은 은하 10개입니다. 대부분 국부은하군의 왜소은하입니다. (원서 p.24)',
    NamedPersons: 'CMG 은하 이름의 유래가 된 인물 전체 목록입니다. 한 명은 철학자(칸트)이고 나머지는 천문학자이며, 문학·신화 속 인물은 포함하지 않았습니다. 허셜 남매는 각각 다른 은하에 이름이 붙었습니다. (원서 p.27–28)'
  };

  function renderListInfo() {
    const el = document.getElementById('listInfo');
    const text = LIST_INFO[state.cat];
    el.hidden = !text;
    if (text) el.innerHTML = `<strong>📚 원서 안내</strong> ${escapeHtml(text)}`;
  }

  // ===== 카탈로그 해설 창: 탭 전환 =====
  function showGuidePanel(key) {
    document.querySelectorAll('#guideModal .guide-tabs:not(.guide-subtabs) .guide-tab').forEach(b => {
      const on = b.getAttribute('data-guide') === key;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on);
    });
    document.querySelectorAll('#guideModal .guide-panel').forEach(p => { p.hidden = p.getAttribute('data-guide-panel') !== key; });
  }
  document.querySelector('#guideModal .guide-tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-guide]');
    if (b) showGuidePanel(b.getAttribute('data-guide'));
  });

  // ===== 통계 (원서 p.20–23 수치) =====
  const STATS = {
    hemis: [['적도좌표', 518, 481], ['은하좌표', 602, 397], ['초은하좌표', 415, 584]],
    ra: [49, 50, 49, 65, 32, 14, 14, 16, 24, 59, 73, 78, 166, 84, 41, 32, 14, 9, 12, 16, 14, 12, 36, 40],
    gal: [12, 9, 13, 13, 2, 6, 8, 16, 22, 30, 31, 26, 24, 47, 69, 36, 15, 28, 17, 26, 19, 27, 29, 46, 34, 31, 43, 41, 55, 39, 42, 36, 31, 26, 20, 30],
    sg: [3, 9, 15, 17, 27, 47, 45, 42, 54, 46, 73, 46, 57, 47, 39, 25, 10, 1, 1, 9, 21, 15, 19, 27, 32, 25, 40, 21, 36, 35, 37, 23, 21, 15, 15, 4],
    // [영문 이름, 면적(제곱도), CMG 은하 수]
    constellations: [
      ['Andromeda', 722, 16], ['Antlia', 239, 18], ['Apus', 206, 1], ['Aquarius', 980, 16], ['Aquila', 652, 1], ['Ara', 237, 3],
      ['Aries', 441, 11], ['Auriga', 657, 0], ['Boötes', 907, 18], ['Caelum', 125, 3], ['Camelopardalis', 757, 19], ['Cancer', 506, 5],
      ['Canes Venatici', 465, 39], ['Canis Major', 380, 5], ['Canis Minor', 183, 0], ['Capricornus', 414, 1], ['Carina', 494, 2],
      ['Cassiopeia', 598, 8], ['Centaurus', 1060, 30], ['Cepheus', 588, 2], ['Cetus', 1231, 59], ['Chamaeleon', 132, 0],
      ['Circinus', 93, 1], ['Columba', 270, 4], ['Coma Berenices', 386, 39], ['Corona Australis', 128, 0], ['Corona Borealis', 179, 0],
      ['Corvus', 184, 8], ['Crater', 282, 10], ['Crux', 68, 0], ['Cygnus', 804, 4], ['Delphinus', 189, 1], ['Dorado', 179, 12],
      ['Draco', 1083, 29], ['Equuleus', 72, 0], ['Eridanus', 1138, 39], ['Fornax', 398, 21], ['Gemini', 514, 1], ['Grus', 366, 17],
      ['Hercules', 1225, 6], ['Horologium', 249, 12], ['Hydra', 1303, 52], ['Hydrus', 243, 1], ['Indus', 294, 11], ['Lacerta', 201, 2],
      ['Leo', 947, 47], ['Leo Minor', 232, 11], ['Lepus', 290, 9], ['Libra', 538, 8], ['Lupus', 334, 3], ['Lynx', 545, 16],
      ['Lyra', 286, 1], ['Mensa', 153, 2], ['Microscopium', 210, 1], ['Monoceros', 482, 1], ['Musca', 138, 0], ['Norma', 165, 0],
      ['Octans', 291, 2], ['Ophiuchus', 948, 2], ['Orion', 594, 2], ['Pavo', 378, 19], ['Pegasus', 1121, 22], ['Perseus', 615, 7],
      ['Phoenix', 469, 8], ['Pictor', 247, 1], ['Pisces', 889, 15], ['Piscis Austrinus', 245, 5], ['Puppis', 673, 7], ['Pyxis', 221, 3],
      ['Reticulum', 114, 4], ['Sagitta', 80, 0], ['Sagittarius', 867, 4], ['Scorpius', 497, 0], ['Sculptor', 475, 19], ['Scutum', 109, 0],
      ['Serpens', 637, 9], ['Sextans', 314, 12], ['Taurus', 797, 2], ['Telescopium', 252, 4], ['Triangulum', 132, 7],
      ['Triangulum Australe', 110, 2], ['Tucana', 295, 7], ['Ursa Major', 1280, 83], ['Ursa Minor', 256, 0], ['Vela', 500, 3],
      ['Virgo', 1294, 120], ['Volans', 141, 4], ['Vulpecula', 268, 0]
    ],
    clusters: [
      ['은하단', '처녀 은하단', '-', 105, '처녀 I(본 은하단) 49 · 처녀 II 은하군(처녀 I의 긴 남쪽 연장부) 36 · 처녀 III 은하군(처녀 I 남동쪽의 은하군들) 20'],
      ['은하단', '화로 은하단', 'AS373', 13, '화로 I 은하단이라고도 함'],
      ['은하단', '에리다누스 은하단', '-', 13, '화로 II 은하단이라고도 함'],
      ['은하단', '머리털 은하단', 'A1656', 3, ''],
      ['은하단', '센타우루스 은하단', 'A3526', 3, ''],
      ['은하단', '헤르쿨레스 은하단', 'A2151', 3, ''],
      ['은하단', '큰물뱀 은하단', 'A1060', 2, '큰물뱀 I 은하단이라고도 함'],
      ['은하단', '페르세우스 은하단', 'A426', 1, ''],
      ['은하단', '공기펌프 은하단', 'AS636', 1, ''],
      ['은하군', '국부은하군', '', 25, ''],
      ['은하군', '사자 은하군', '', 38, '사자 I 은하군(M66/M96 은하군) 12 · 사자 II 은하군(사자 II 구름, 사자 I 뒤쪽) 26'],
      ['은하군', 'M81 은하군', '', 11, ''],
      ['은하군', 'NGC 5128 은하군', '', 9, '센타우루스 A 은하군 또는 M83 은하군이라고도 함'],
      ['은하군', 'M101 은하군', '', 6, 'M51 은하군이라고도 함'],
      ['은하군', '사냥개 은하군', '', 15, '사냥개 I 은하군(M94 은하군) 7 · 사냥개 II 은하군(사냥개 I 뒤쪽) 8'],
      ['은하군', '큰곰 은하군', '', 28, '큰곰 북쪽 은하군(적위 50° 이북) 13 · 큰곰 남쪽 은하군(적위 50° 이남) 15'],
      ['은하군', '조각가 은하군', '', 7, 'NGC 253 은하군이라고도 함'],
      ['은하군', '마페이 은하군', '', 5, 'IC 342 은하군이라고도 함']
    ],
    redshift: [['z < 0', 21], ['0 ≤ z < 0.00001', 1], ['0.00001 ≤ z < 0.0001', 3], ['0.0001 ≤ z < 0.001', 37],
               ['0.001 ≤ z < 0.01', 652], ['0.01 ≤ z < 0.1', 280], ['0.1 ≤ z < 1', 3], ['z > 1', 1]],
    morph: [['−5 ≥ T', 'E', 0.0], ['−4 ≥ T > −5', 'E', 8.9], ['−3 ≥ T > −4', 'E-S0', 1.6], ['−2 ≥ T > −3', 'S0', 5.2],
            ['−1 ≥ T > −2', 'S0', 5.3], ['0 ≤ T < 1', 'S0a', 4.2], ['1 ≤ T < 2', 'Sa', 7.5], ['2 ≤ T < 3', 'Sab', 6.2],
            ['3 ≤ T < 4', 'Sb', 15.9], ['4 ≤ T < 5', 'Sbc', 14.5], ['5 ≤ T < 6', 'S?', 15.3], ['6 ≤ T < 7', 'Sc', 7.0],
            ['7 ≤ T < 8', 'Scd', 2.2], ['8 ≤ T < 9', 'Sd', 2.9], ['9 ≤ T < 10', 'Sm', 3.2], ['10 ≤ T', 'Irr', 0.2]]
  };

  function barRows(rows, max, unit) {
    return `<div class="stat-bars">${rows.map(([label, value]) => `
      <div class="stat-bar-row"><span class="stat-bar-label">${escapeHtml(label)}</span><span class="stat-bar-track"><span class="stat-bar" style="width:${max ? (value / max * 100).toFixed(1) : 0}%"></span></span><span class="stat-bar-val">${value}${unit || ''}</span></div>`).join('')}</div>`;
  }

  function renderStats() {
    document.getElementById('statHemis').innerHTML = `
      <table class="guide-table"><thead><tr><th>좌표계</th><th>북반구</th><th>남반구</th></tr></thead><tbody>
      ${STATS.hemis.map(([n, a, b]) => `<tr><td>${n}</td><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table>`;

    function renderLon(kind) {
      const data = STATS[kind];
      const rows = data.map((v, i) => [kind === 'ra'
        ? `${String(i).padStart(2, '0')}–${String((i + 1) % 24).padStart(2, '0')}h`
        : `${String(i * 10).padStart(3, '0')}–${String(((i + 1) * 10) % 360).padStart(3, '0')}°`, v]);
      document.getElementById('statLon').innerHTML = barRows(rows, Math.max(...data));
      document.querySelectorAll('#statLonTabs .guide-tab').forEach(b => b.classList.toggle('active', b.getAttribute('data-lon') === kind));
    }
    renderLon('ra');
    document.getElementById('statLonTabs').addEventListener('click', e => {
      const b = e.target.closest('[data-lon]');
      if (b) renderLon(b.getAttribute('data-lon'));
    });

    let constSort = { key: 3, dir: -1 };
    function renderConst() {
      const rows = STATS.constellations.map(([en, area, n]) => [CONST_KO[en] || en, en, area, n, Math.round(n / area * 1000) / 10]);
      const k = constSort.key;
      rows.sort((a, b) => (typeof a[k] === 'string' ? a[k].localeCompare(b[k], 'ko') : a[k] - b[k]) * constSort.dir || a[0].localeCompare(b[0], 'ko'));
      const arrow = i => (i === k ? (constSort.dir > 0 ? ' ▲' : ' ▼') : '');
      document.getElementById('statConst').innerHTML = `
        <div class="table-scroll"><table class="guide-table guide-table-compact sortable"><thead><tr>
          <th data-sort="0">별자리${arrow(0)}</th><th data-sort="2">면적(제곱도)${arrow(2)}</th><th data-sort="3">CMG 은하 수${arrow(3)}</th><th data-sort="4">100제곱도당${arrow(4)}</th>
        </tr></thead><tbody>
        ${rows.map(r => `<tr><td>${escapeHtml(r[0])} <span class="muted">${escapeHtml(r[1])}</span></td><td>${r[2]}</td><td><strong>${r[3]}</strong></td><td>${r[4].toFixed(1)}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    renderConst();
    document.getElementById('statConst').addEventListener('click', e => {
      const th = e.target.closest('th[data-sort]');
      if (!th) return;
      const key = Number(th.getAttribute('data-sort'));
      constSort = { key, dir: constSort.key === key ? -constSort.dir : (key === 0 ? 1 : -1) };
      renderConst();
    });

    document.getElementById('statClusters').innerHTML = `
      <div class="table-scroll"><table class="guide-table guide-table-compact"><thead><tr><th>구분</th><th>이름</th><th>목록 번호</th><th>CMG 은하 수</th><th>비고</th></tr></thead><tbody>
      ${STATS.clusters.map(r => `<tr><td>${r[0]}</td><td>${escapeHtml(r[1])}</td><td>${escapeHtml(r[2])}</td><td><strong>${r[3]}</strong></td><td>${escapeHtml(r[4])}</td></tr>`).join('')}
      </tbody></table></div>`;
    document.getElementById('statRedshift').innerHTML = barRows(STATS.redshift, 652, '개');
    document.getElementById('statMorph').innerHTML = barRows(STATS.morph.map(([t, type, pct]) => [`${type}  (${t})`, pct]), 15.9, '%');
  }

  // ===== 특별 목록 표 (원서 p.24–28) =====
  function galaxyLink(no) {
    const g = GALAXY_BY_NO.get(no);
    if (!g) return `CMG ${no}`;
    return `<button class="link-btn" type="button" data-open-detail="${no}">${escapeHtml(g.latin_name)}</button>`;
  }
  function idText(g) {
    return escapeHtml([g.messier ? g.messier.replace('Messier ', 'M ') : '', g.primary_id].filter(Boolean).join(', '));
  }

  // 특별 목록의 원서 표 (카탈로그 해설 창)
  const LIST_TITLES = {
    Beautiful50: '✨ 가장 아름다운 은하 50선 (p.25–27)',
    Brightest50: '🌟 가장 밝은 은하 50선 (p.24–25)',
    Largest10: '📏 큰 은하 10선 (p.24)',
    Smallest10: '🔬 작은 은하 10선 (p.24)',
    NamedPersons: '🏛️ 인물의 이름을 딴 은하 (p.27–28)'
  };
  function listTableHtml(key) {
    const order = (LISTS[key] && LISTS[key].order) || [];
    let head, rows;
    if (key === 'Beautiful50') {
      head = ['#', 'CMG', '학명', '한글 이름', '식별', 'RC3.9 분류'];
      rows = order.map((item, i) => {
        const nos = Array.isArray(item) ? item : [item];
        const gs = nos.map(n => GALAXY_BY_NO.get(n)).filter(Boolean);
        return `<tr><td>${i + 1}</td><td>${nos.join(', ')}</td><td>${nos.map(galaxyLink).join(' · ')}</td><td>${escapeHtml(gs.map(g => g.name_ko).join(' · '))}</td><td>${gs.map(idText).join(' · ')}</td><td>${escapeHtml(gs.map(g => g.rc3_class).join(', '))}</td></tr>`;
      });
    } else if (key === 'Brightest50') {
      head = ['순위', 'CMG', '학명', '한글 이름', '식별', '안시등급'];
      rows = order.map(no => {
        const g = GALAXY_BY_NO.get(no);
        return `<tr><td>${g.rank_brightest.rank}</td><td>${no}</td><td>${galaxyLink(no)}</td><td>${escapeHtml(g.name_ko)}</td><td>${idText(g)}</td><td><strong>${escapeHtml(g.rank_brightest.mag)}</strong></td></tr>`;
      });
    } else if (key === 'Largest10' || key === 'Smallest10') {
      const field = key === 'Largest10' ? 'rank_largest' : 'rank_smallest';
      head = ['순위', 'CMG', '학명', '한글 이름', '식별', '분류', '지름(kly)'];
      rows = order.map(no => {
        const g = GALAXY_BY_NO.get(no);
        return `<tr><td>${g[field].rank}</td><td>${no}</td><td>${galaxyLink(no)}</td><td>${escapeHtml(g.name_ko)}</td><td>${idText(g)}</td><td>${escapeHtml(g.rc3_class !== '-' ? g.rc3_class : g.hs_class)}</td><td><strong>${g[field].diameter_kly}</strong></td></tr>`;
      });
    } else if (key === 'NamedPersons') {
      head = ['인물', '은하', '소개'];
      rows = order.map(no => {
        const g = GALAXY_BY_NO.get(no);
        const p = g.person;
        return `<tr><td><strong>${escapeHtml(p.name_ko)}</strong><br><span class="muted">${escapeHtml(p.name_en)}<br>${escapeHtml(p.years)}</span></td><td>${galaxyLink(no)}<br><span class="muted">CMG ${no} · ${idText(g)}</span></td><td>${escapeHtml(p.bio_ko)}</td></tr>`;
      });
    } else {
      return '';
    }
    return `<div class="table-scroll"><table class="guide-table guide-table-compact"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  }

  function renderGuideLists() {
    document.getElementById('guideLists').innerHTML = Object.entries(LIST_TITLES).map(([key, title]) => `
      <div class="guide-list">
        <h3>${title} <button class="btn guide-list-btn" type="button" data-show-cat="${key}">카드로 보기 ➔</button></h3>
        <p class="guide-note">${escapeHtml(LIST_INFO[key] || '')}</p>
        ${listTableHtml(key)}
      </div>`).join('');
  }

  if (ALL_GALAXIES.length) {
    renderStats();
    renderGuideLists();
  }

  // 해설 창 안의 링크: 은하 상세 열기 / 목록 탭으로 이동
  document.getElementById('guideModal').addEventListener('click', e => {
    const detail = e.target.closest('[data-open-detail]');
    if (detail) {
      closeModal(guideModal);
      openDetailModal(detail.getAttribute('data-open-detail'));
      return;
    }
    const show = e.target.closest('[data-show-cat]');
    if (show) {
      closeModal(guideModal);
      state.cat = show.getAttribute('data-show-cat');
      state.page = 1;
      syncControls();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Initial render
  syncControls();
  render();
})();
