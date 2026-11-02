/**
 * 2025-04-01. 관측 대상에 대한 기본 정보, 참고 이미지, 관측 기록 등을 모두 모아 놓음
 *             DB 설계처럼 정규화 하는게 맞는지 잘 모르겠음
 * */
const G_DeepskyObjects = [
    {
        Index: "나선 행성상 성운",
        Type: "행성상 성운",
        Name: "NGC 5189",
        Constellation: "파리",
        FinderChart: [
            "지평좌표_5189_4755_찾기_7월 서호주.jpg",
            "적도좌표계_NGC5189_스케치.jpg",
        ], // 배열로 변경
        Ref_ImageFile: "NGC5189_Spiral_PN.png",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본",       URL: "https://cafe.naver.com/skyguide/96053" },
            { title: "위키백과 영문",       URL: "https://en.wikipedia.org/wiki/NGC_5189" },
        ], // 배열로 변경
        Desc: "특이한 나선 모양의 행성상 성운. 고배율 관측 필요",
        Size_degmin: "1.5' x 1'",
        Obsrv_ImageFile:"NGC5189_1minute_sktech.jpg",
        Obsrv_Desc:
            ["이런 나선 모양의 행성상 성운이라니... 남천은 정말 이국적이다 ㅋㅋ",
                "중앙의 막대는 나름 뚜렷하고 두꺼우나 양 끝의 경계는 깔끔히 구분되진 않는다. " +
                "막대의 윗쪽에 별인듯 발게 보이는 것이 있다. " +
                "나선은 둘 다 시작부분은 진하지만 1/3 지점 이후는 흐릿하게 이어진다. 나름 두텁다.",
            "그리고, 크기가 작고, 나선이 멀리 날개를 편친 모습이 아니고, 막대에 가까이 붙어 있는 모습이다. " +
            "행성상 성운인 것은 인정해야겠다."],
    },
    {
        Index: "남쪽 바람개비 은하",
        Type: "막대나선은하",
        Name: "M83, CMG 이름: 산호",
        Constellation: "큰물뱀",
        FinderChart: [
            "예제13_적도좌표_M83_5128_오메가 센타우리 찾기.jpg",
            "적도좌표계_M83_스케치.jpg"
        ], // 배열로 변경
        Ref_ImageFile: "M83_cho.jpg",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://www.nightflight.or.kr/xe/sketch/209158" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%EB%82%A8%EC%AA%BD%EB%B0%94%EB%9E%8C%EA%B0%9C%EB%B9%84_%EC%9D%80%ED%95%98" }
        ], // 배열로 변경
        Desc: "NGC 5128-M83 은하군에 있는 은하 중 두 번째로 가까운 은하이다. 센타우루스 A 은하는 남쪽바람개비 은하에 이어 가장 가까운 은하이다.",
        Size_degmin: "12′.9 × 11′.5",
        Obsrv_ImageFile:"M083_1minute_sketch.jpg",
        Obsrv_Desc:
            ["전체적으로 희미하게 고른 밝기이고, 핵은 별상이다. (핵의 영역은 안 보임)" +
                "나선의 암흑대가 보일듯 말듯하며, 오른쪽 위 암흑대 끝에 별상이 하나 보인다. (사진과 비교해보자)",
            "북쪽 바람개비 M100과 유사한 면이 많다.한 하늘에서 비교해 볼 수 있다면 재미있을 것 같다."],
    },
    {
        Index: "대마젤란 은하",
        Type: "왜소 은하",
        Name: "LMC",
        Constellation: "황새치",
        FinderChart: ["지평좌표_마젤란은하 근처_찾기_7월 05시 서호주.jpg",
            "지평좌표_마젤란은하 근처_찾기_7월 20시 서호주.jpg",
            "적도좌표계_대마젤란 은하.jpg",
        ], // 배열로 변경
        Ref_ImageFile: "LMC_ngc1763_ori_200301.jpg",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/category/deep-sky/lmc/" },
            { title: "조강욱 글",   URL: "https://cafe.naver.com/skyguide/336559"},
            { title: "붙박이 구름 마젤란 은하",    URL: "../z20_boast/boast414_magellanic_cloud.html" }
        ], // 배열로 변경
        Desc: "남반구의 붙박이 구름으로 설명이 필요 없다. 타란툴라 성운 등 많은 Deep sky 대상을 포함하고 있다. ** 무엇을 관측할지 다시 고민하자.",
        Size_degmin: "10˚.75 × 9˚.17",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "소마젤란 은하",
        Type: "왜소 은하",
        Name: "SMC",
        Constellation: "큰부리새",
        FinderChart: ["지평좌표_마젤란은하 근처_찾기_7월 05시 서호주.jpg",
            "지평좌표_마젤란은하 근처_찾기_7월 20시 서호주.jpg",
            "적도좌표_대마젤란_15등급까지.jpg",
        ], // 배열로 변경
        Ref_ImageFile: "small_magellanic_sketch.png",
        Ref_Image_Creator: "박근영",
        RefURLs: [
            { title: "스케치 원본", URL: "https://cafe.naver.com/skyguide/357195" },
            { title: "붙박이 구름 마젤란 은하",    URL: "../z20_boast/boast414_magellanic_cloud.html" }
        ], // 배열로 변경
        Desc: "무엇을 관측할지 다시 고민",
        Size_degmin: "5°20' × 3°5'",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "바너드의 E",
        Type: "암흑 성운",
        Name: "Barnard 142/143",
        Constellation: "독수리",
        FinderChart: ["적도좌표_바너드의 E_찾기.jpg",],
        Ref_ImageFile: "Banard142_143.jpg",
        Ref_Image_Creator: "Jeremy Perez",
        RefURLs: [
            { title: "스케치 원본", URL: "https://www.perezmedia.net/beltofvenus/archives/001379.html" },
            { title: "위키백과",    URL: "https://en.wikipedia.org/wiki/E_Nebula" }
        ], // 배열로 변경
        Desc: "은하수 배경의 암흑성운, 저배율 관측, 깜짝 놀랄 것이다.",
        Size_degmin: "30' X 60'",
        Obsrv_ImageFile:"BanardE_10minute_sketch.jpg",
        Obsrv_Desc:
            ["<b>샤크 베이</b>: 10x42 쌍안경으로 쉽게 보인다. 다만 절반정도는 경계가 명확치 않다. " +
            "암흑 성운 관측은 난생 처음이고 어둡게 보이는 그 모습이 신기하기만 하다. 서호주는 정말 멋진 곳이다 ^^" +
            "바너드E도 별자리 쌍안경으로 관측했으면 다크 호스처럼 뚜렷이 보였을 지 궁금하다.",
            "별이 인쇄된 성도 위에 스케치했다."    ],
    },
    {
        Index: "다크 호스",
        Type: "암흑성운",
        Name: "뛰는 말 Prancing Horse",
        Constellation: "뱀주인",
        FinderChart: [], // 배열로 변경
        Ref_ImageFile: "",
        Ref_Image_Creator: "",
        RefURLs: [
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%EC%84%BC%ED%83%80%EC%9A%B0%EB%A3%A8%EC%8A%A4%EC%9E%90%EB%A6%AC_A" },
        ], // 배열로 변경
        Desc: "",
        Size_degmin: "10˚ × 10˚",
        Obsrv_ImageFile:"obsrv_darkhorse.png",
        Obsrv_Desc:
            ["<b>샤크베이</b>: 맨눈으로 뛰는 말이 옆 사진처럼 보인다. 엉덩이와 뒷다리의 파이프 성운은 뚜렷하지만 머리/앞다리는 희미하다.",
            "<b>2x52 별자리 쌍안경</b>: 깜짝 놀랄 정도로 다크 호스가 매우 또렷하게 보인다. 다크 호스 전체의 모습이 다 새까맣다." +
            " 보는 순간 감탄사가 나왔다. 평생 잊지 못할 모습이다.",
             "<b>칼바리</b>: 눈으로도 별자리 쌍안경으로도 다크 호스가 보이지 않는다. 엉덩이와 뒷다리만 분명히 구분되고, 나머지는 구구절절 설명을 해야 한다."],
    },
    {
        Index: "베일 성운",
        Type: "초신성 잔해",
        Name: "NGC 6960, 6992, 6995,6974, 6979",
        Constellation: "백조",
        Ref_ImageFile: "NGC6960_veil_nebula.png",
        Ref_Image_Creator: "이동근",
        RefURLs: [
            { title: "스케치 원본", URL: "https://cafe.naver.com/skyguide/307885" },
            { title: "나무위키",    URL: "https://namu.wiki/w/%EB%B2%A0%EC%9D%BC%20%EC%84%B1%EC%9A%B4" }
        ], // 배열로 변경
        Desc: "대략 10,000 ~ 20,000년 전에 폭발한 초신성 잔해. 2400 광년 거리",
        Size_degmin: "3°",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "석호 성운",
        Type: "발광 성운 H II 영역",
        Name: "M8",
        Constellation: "궁수",
        Ref_ImageFile: "M08_Joseph.png",
        Ref_Image_Creator: "이동근",
        RefURLs: [
            { title: "스케치 원본", URL: "https://cafe.naver.com/skyguide/306905" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%EC%84%9D%ED%98%B8_%EC%84%B1%EC%9A%B4" }
        ], // 배열로 변경
        Desc: "궁수 자리의 터줏대감??",
        Size_degmin: "90' × 40′",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "수리 성운",
        Type: "발광 성운 H II 영역",
        Name: "M16",
        Constellation: "뱀",
        Ref_ImageFile: "M16_Joseph.png",
        Ref_Image_Creator: "이동근",
        RefURLs: [
            { title: "스케치 원본", URL: "https://cafe.naver.com/skyguide/350358" },
            { title: "수리 성운",    URL: "../z20_boast/boast200_eagle_nebula.html" },
            { title: "전리수소영역", URL: "../z20_boast/boast207_H_II_region.html"}
        ], // 배열로 변경
        Desc: "허블 우주 망원경 창조의 기둥으로 유명함, 7000 광년",
        Size_degmin: "11'",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "오메가 성운",
        Type: "발광 성운 H II 영역",
        Name: "M17",
        Constellation: "궁수",
        Ref_ImageFile: "M17_Joseph.png",
        Ref_Image_Creator: "이동근",
        RefURLs: [
            { title: "스케치 원본", URL: "https://cafe.naver.com/skyguide/328273" },
            { title: "전리수소영역", URL: "../z20_boast/boast207_H_II_region.html"},
            { title: "나무위키",    URL: "https://namu.wiki/w/%EC%98%A4%EB%A9%94%EA%B0%80%20%EC%84%B1%EC%9A%B4" }
        ], // 배열로 변경
        WikiURL: "",
        Desc: "궁수 자리의 터줏대감??",
        Size_degmin: "11'",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "삼렬 성운",
        Type: "발광 성운 H II 영역",
        Name: "M20",
        Constellation: "궁수",
        Ref_ImageFile: "m20_ori_120527.jpg",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/2016/06/20/m20-trifid-nebula/" },
            { title: "나무위키",    URL: "https://namu.wiki/w/%EC%82%BC%EB%A0%AC%20%EC%84%B1%EC%9A%B4" },
            { title: "전리수소영역", URL: "../z20_boast/boast207_H_II_region.html"}
        ], // 배열로 변경
        Desc: "5200광년, 센타우루스 팔",
        Size_degmin: "28'",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "소원의 우물",
        Type: "산개성단",
        Name: "NGC 3532, 바늘 꽂이(Pincushion)",
        Constellation: "용골",
        Ref_ImageFile: "3532nf.jpg",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/2017/04/22/ngc-3532-wishing-well/" },
            { title: "나무위키",    URL: "https://namu.wiki/w/NGC%203532" },
        ], // 배열로 변경
        Desc: "소원의 우물에 떨어진 은화처럼 보인다고 함",
        Size_degmin: "55'",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["김윤정: 커다란 눈동자에 눈물이 그렁그렁한 모습으로 빛나고 있었고 살짝만 건드려도 눈물이 터질 것만 같다. " +
            "소원 하나 빌어본다. " +
            "한번 더 이 곳에 오게 해주세요. ",
                "신명근: 소원을 빌기 위해 던져 놓은 동전이 반짝이는 느낌 그대로 화려하다." +
            " 비슷한 밝기의 별들이 골고루 넓게 퍼져 있는 모습이다. ",
            "남천이 익숙치 않아 파인더로 볼 때 남쪽 플레이아데스와 헛갈린다."],
    },
    {
        Index: "센타우루스 알파",
        Type: "프록시마 포함 3중성",
        Name: "리길 센타우루스 + 톨리만",
        Constellation: "센타우루스",
        Ref_ImageFile: "alpla_centauri_sketch.jpg",
        Ref_Image_Creator: "TienTran@134",
        RefURLs: [
            { title: "스케치 원본", URL: "https://www.cloudynights.com/topic/823693-alpha-centauri-the-nearest-star-system/" },
            { title: "소설 삼체의 배경",    URL: "../z20_boast/boast201_proxima_centauri.html" },
        ], // 배열로 변경
        Desc: "눈으로 보이는 가장 가까운 별. 시리우스/카노푸스 다음으로 밝다. 가장 밝은 별 삼총사를 한 하늘에 볼 수 있다. 색을 살펴보자.",
        Size_degmin: "",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "센타우루스 A",
        Type: "막대나선은하",
        Name: "NGC 5128, CMG 이름: 삼키는",
        Constellation: "센타우루스",
        FinderChart: ["예제13_적도좌표_M83_5128_오메가 센타우리 찾기.jpg"], // 배열로 변경
        Ref_ImageFile: "ngc-5128_cho.png",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/2018/04/14/ngc-5128-centaurus-a/" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%EC%84%BC%ED%83%80%EC%9A%B0%EB%A3%A8%EC%8A%A4%EC%9E%90%EB%A6%AC_A" },
        ], // 배열로 변경
        Desc: "특이한 모양의 은하. 《콘택트》 영화에 나옴. 먼지가 풍부한 나선형 은하를 삼키고 있는 렌즈형 은하로 추측됨",
        Size_degmin: "25'.7 X 20'",
        Obsrv_ImageFile:"NGC5128_1minute_sketch.jpg",
        Obsrv_Desc:
            ["S0 타입의 신기한 형태의 은하를 인지한 지 30년 만에 눈으로 그 모습을 확인했다. 감회가 남다른 대상이다. 색다른 모습을 잘 나타낼 정도로 충분히 밝다.",
             "전체적으로 원형이고 중앙 암흑대가 매우 넓게 쉽게 보인다. 말 그대로 햄버거의 단면과 같은 모습이며," +
                "반원 중 한 쪽이 더 크다. 암흑대에는 별이 하나 보이고, 아래쪽 암흑대는 강의 삼각주같다. 살짝 넓어지고 또 넓어진 쪽으로" +
                " 모래 사장을 연상시키는 밝은 부분이 있다." +
                " 옆 그림은 1분 스케치이다."],
    },
    {
        Index: "안드로메다 은하",
        Type: "나선 은하",
        Name: "M31",
        Constellation: "안드로메다",
        FinderChart: ["적도좌표_M31_이중성단 찾기.jpg", ],
        Ref_ImageFile: "m31_desc.jpg",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/2016/04/01/m110/" },
            { title: "안드로메다 은하", URL: "../z20_boast/boast410_andromeda.html" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%EC%95%88%EB%93%9C%EB%A1%9C%EB%A9%94%EB%8B%A4_%EC%9D%80%ED%95%98" },
        ], // 배열로 변경
        Desc: "우리은하군에서 가장 큰 은하, 우리은하, 마젤란은하 순서이다",
        Size_degmin: "190′ × 60′",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "오메가 센타우리",
        Type: "구상성단",
        Name: "NGC 5139",
        Constellation: "센타우루스",
        FinderChart: [
            "예제13_적도좌표_M83_5128_오메가 센타우리 찾기.jpg",
            "적도좌표계_NGC5139_오메가센타우리_스케치.jpg",
        ], // 배열로 변경
        Ref_ImageFile: "5139_nsw_2010.jpg",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/2010/07/16/ngc-5139-omega-centauri-1st-try/" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%EC%84%BC%ED%83%80%EC%9A%B0%EB%A3%A8%EC%8A%A4%EC%9E%90%EB%A6%AC_%EC%98%A4%EB%A9%94%EA%B0%80" },
        ], // 배열로 변경
        Desc: "우리 은하 최대 구상성단",
        Size_degmin: "36′.3",
        Obsrv_ImageFile:"구상성단비교_정병준사진원치복설명.jpg",
        Obsrv_Desc:
            ["사진: M13과의 크기 비교 (사진: 정병준, 설명: 원치복)",
             "안시: 거대한 크기와 함께 균형 잡힌 안정된 모습이 매우 멋있다. 주변시로 볼 때 중심부에서 가장자리까지 별이 분해되는 느낌이 너무나 강렬하다. " +
            "밤하늘에서 망원경 관측 최고의 대상이다. "+
                "맨눈으로도 잘 보이며, (구상성단 인것을 알고 보기에 또는 난시가 많아서) 부은 별처럼 보인다.",
            ],
    },
    {
        Index: "용골 성운",
        Type: "성운",
        Name: "NGC 3372",
        Constellation: "용골",
        Ref_ImageFile: "Eta-Carinae-Nebula-4-14-12.jpg",
        Ref_Image_Creator: "Jeremy PerezCategories",
        RefURLs: [
            { title: "스케치 원본", URL: "https://www.asod.info/?p=8519" },
            { title: "용골 성운",    URL: "../z20_boast/boast205_carina_nebula.html" },
        ], // 배열로 변경
        Desc: "용골 에타별 주위의 매우 크고 밝은 성운. 오리온 성운보다 더 멀리 있지만, 더 크고 밝게 빛난다",
        Size_degmin: "120' X 120'",
        Obsrv_ImageFile:"김도익_용골성운.jpg",
        Obsrv_Desc:
            ["사진: 김도익",
                "안시: 매우 크다. 1.08º 시야를 가득 채우고 넘친다. 사진의 모습/느낌이 안시에서도 그대로 느껴진다. 암흑대 3개가 분명히 보이고, " +
                "4시 방향 성운은 뚜렷한 삼각형 모양의 열대어 모습이고, " +
                "10시 방향 성운은 자체의 작은 암흑대도 울퉁불퉁 보인다. 그리고, 시야 밖으로 성운이 계속 이어진다.",
                "이동근: 18인치로 오리온 성운 볼 때와 같은 입체적인 모습은 크지 않다. 대단한 성운은 맞지만 구경이 살짝 아쉽다. " +
                "용골 에타의 호문쿨러스는 시도는 했지만, 고배율 관측 등이 여의치 않았다."
            ],
    },
    {
        Index: "용골 에타",
        Type: "별+행성상성운(?)",
        Name: "호문쿨러스-작은인간 성운",
        Constellation: "용골",
        Ref_ImageFile: "the-homunculus-star-26-april-2020.png",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/2020/04/26/eta-carina-star-the-homunculus/" },
            { title: "용골 에타",    URL: "../z20_boast/boast206_eta_carina.html" },
        ], // 배열로 변경
        Desc: "몇 백년 전 폭발한 신성?의 잔해가 보인다.",
        Size_degmin: "11.2′ × 6.2′",
        Obsrv_ImageFile:"NGC104_TUC47_sketch_06inch.jpg",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24.",
            ],
    },
    {
        Index: "조각가 은하",
        Type: "나선 은하",
        Name: "NGC 253",
        Constellation: "조각가",
        Ref_ImageFile: "NGC_253_Cho.jpg",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://www.nightflight.or.kr/xe/observation/220874" },
            { title: "위키백과",    URL: "https://namu.wiki/w/%EC%A1%B0%EA%B0%81%EA%B0%80%EC%9E%90%EB%A6%AC%20%EC%9D%80%ED%95%98" },
        ], // 배열로 변경
        Desc: "1140 광년 거리의 조각가 은하군의 중심 은하",
        Size_degmin: "27′.5 × 6′.8",
        Obsrv_ImageFile:"NGC0253__1minute_sketch.jpg",
        Obsrv_Desc:
            ["칼바리: 표면이 부드럽고, 암흑대가 얼룩처럼 보인다. 은하 내부의 별도 몇 개 구분된다. (사진과 비교해 보자)",
                "명성만큼 거대하고 밝은 은하이다."],
    },
    {
        Index: "타란툴라 성운",
        Type: "성운 복합체",
        Name: "NGC 2070",
        Constellation: "황새치",
        FinderChart: ["적도좌표_타란툴라_스케치.jpg",],
        Ref_ImageFile: "NGC_2070_Cho.png",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/2017/12/21/1-ngc2070-tarantula-nebula/" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%ED%83%80%EB%9E%80%ED%88%B4%EB%9D%BC_%EC%84%B1%EC%9A%B4" },
            { title: "전리수소영역", URL: "../z20_boast/boast207_H_II_region.html"}
        ], // 배열로 변경
        Desc: "대마젤란 은하(LMC)에 있는 전리수소영역",
        Size_degmin: "40′ × 25′",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["샤크베이, 2시 넘어 관측. <b>평생 가장 멋지고 신기한 모습의 성운이다</b>. ㅎㅎ 타란툴라의 기다랗고 각진 다리와 둥그런듯 각진 몸통이 선명하게 보인다." +
            "주변시를 보려고 애써 노력하지 않아도 된다. 조강욱님 스케치와 맞춰 보진 않았지만 그 모습 그대로 보인다." +
            "타란툴라의 눈이라 여겨지는 산개 성단도 오밀조밀 귀여우나 성운의 모습과 함께 독거미의 알 또는 새끼들을 떠올리면 섬뜩하다 ㅎ. " +
            "16만 광년 떨어진 다른 은하의 수소전리영역이 이렇게 멋진 모습을 보인다니 마냥 신기하다." +
            "마젤란 은하에선 무슨 일이 일이나고 있을지 궁금하다.",
                "고도가 매우 낮았지만 초저녁에 원정대분들에게도 보여줬으면 하는 아쉬움이 남는다."],
    },
    {
        Index: "플레이아데스/좀생이별",
        Type: "산개 성단",
        Name: "M45",
        Constellation: "황소",
        Ref_ImageFile: "M45_binocular.jpg",
        Ref_Image_Creator: "Rony ?",
        RefURLs: [
            { title: "스케치 원본", URL: "https://www.cloudynights.com/topic/189962-binocular-icon-39-m45-the-pleiades/" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%ED%94%8C%EB%A0%88%EC%9D%B4%EC%95%84%EB%8D%B0%EC%8A%A4_%EC%84%B1%EB%8B%A8" },
        ], // 배열로 변경
        Desc: "지구에서 가장 가까운 산개 성단 중 하나, 440 광년",
        Size_degmin: "120'",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "페가수스 I 은하단",
        Type: "은하단",
        Name: "NGC 7619/7626/7611/7623",
        Constellation: "페가수스",
        FinderChart: ["pegasus_I_cluster찾기.png",],
        Ref_ImageFile: "2024-09-28_pegasus_I_cluster01.jpg",
        Ref_Image_Creator: "장형동",
        RefURLs: [
            { title: "이미지 원본/관측 기록", URL: "../z30_deepsky_sketch/NGC/NGC7611_Pegasus_I_Cluster.html" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%ED%94%8C%EB%A0%88%EC%9D%B4%EC%95%84%EB%8D%B0%EC%8A%A4_%EC%84%B1%EB%8B%A8" },
        ], // 배열로 변경
        Desc: "2억 5천만년 거리의 은하단, 약 1도 화각에 3~5개의 은하가 보인다",
        Size_degmin: "40′ × 25′",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "페르세우스 이중성단",
        Type: "산개성단",
        Name: "NGC 869/884",
        Constellation: "페르세우스",
        FinderChart: ["적도좌표_M31_이중성단 찾기.jpg",],
        Ref_ImageFile: "NGC869_884.png",
        Ref_Image_Creator: "윤승주/몬트로",
        RefURLs: [
            { title: "스케치 원본", URL: "https://cafe.naver.com/skyguide?iframe_url_utf8=%2FArticleRead.nhn%253Fclubid%3D10218527%2526articleid%3D369506%2526commentFocus%3Dtrue" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%A4%91%EC%84%B1%EB%8B%A8" },
        ], // 배열로 변경
        WikiURL: "",
        Desc: "크고 밝고 아름답고 멋진 두 개의 산개성단",
        Size_degmin: "60'",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "헤르쿨레스 구상성단",
        Type: "구상성단",
        Name: "M13",
        Constellation: "헤르쿨레스",
        FinderChart: ["적도좌표_M13 찾기.jpg",],
        Ref_ImageFile: "M013.GIF",
        Ref_Image_Creator: "신명근",
        RefURLs: [
            { title: "스케치 원본", URL: "../z30_deepsky_sketch/MESSIER/M013.html" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%ED%97%88%ED%81%98%EB%A6%AC%EC%8A%A4_%EB%8C%80%EC%84%B1%EB%8B%A8" },
        ], // 배열로 변경
        Desc: "북반구 최대 구상성단",
        Size_degmin: "23'",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "헤르쿨레스 구상성단 (15인치Dob)",
        Type: "구상성단",
        Name: "M13",
        Constellation: "헤르쿨레스",
        FinderChart: ["적도좌표_헤르쿨레스 찾기.jpg",],
        Ref_ImageFile: "m13.jpg",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/2016/06/26/m13/" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%ED%97%88%ED%81%98%EB%A6%AC%EC%8A%A4_%EB%8C%80%EC%84%B1%EB%8B%A8" },
        ], // 배열로 변경
        Desc: "북반구 최대 구상성단",
        Size_degmin: "23'",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["OOO: 관측 기록/소감을 남기자..., 2025-07-24.",
                "관측자: 관측 기록/소감, 2025-07-24."],
    },
    {
        Index: "NGC 55",
        Type: "은하",
        Name: "...",
        Constellation: "조각가",
        Ref_ImageFile: "",
        Ref_Image_Creator: "",
        RefURLs: [
            { title: "나무위키",    URL: "https://namu.wiki/w/NGC%2055" },
        ], // 배열로 변경
        Desc: "650만 광년",
        Size_degmin: "30'.9",
        Obsrv_ImageFile:"NGC0055_1minute_sketch.jpg",
        Obsrv_Desc:
            ["은하핵을 중심으로 동쪽과 서쪽의 밝기가 다른 것이 재미있다." +
                "서쪽이 더 밝고 짧은 암흑대를 가지고 있으며, 동쪽은 더 어둡고 긴 암흑대를 가지고 있다.",
            "옆 그림은 1분 스케치이다."],
    },
    {
        Index: "NGC 104",
        Type: "구상성단",
        Name: "큰부리새 47",
        Constellation: "큰부리새",
        Ref_ImageFile: "ngc104_20dec17_edit.png",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://nightwid.com/2017/12/20/ngc-104-tucana-47/" },
            { title: "위키백과",    URL: "https://ko.wikipedia.org/wiki/%ED%81%B0%EB%B6%80%EB%A6%AC%EC%83%88%EC%9E%90%EB%A6%AC_47" },
        ], // 배열로 변경
        Desc: "두 번째로 큰 구상성단",
        Size_degmin: "30'.9",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["오메가와 비교해서 작다 ^^ 중심부분이 더 밀집도가 있었던 것 같은데, 구체적인 기억은 없다 ㅜ. " +
            "어쨋든 오메가와는 다른 매력으로 충분히 재미있는 모습이었다.",
                ],
    },
    {
        Index: "NGC 1365",
        Type: "막대나선은하",
        Name: "CMG 이름: 두 날개 프로펠러",
        Constellation: "화로",
        FinderChart: [
            "예제15.지평좌표_1365_찾기_7월04시 서호주.jpg",
            "적도좌표계_NGC1365_스케치.jpg",
            "1030px-VST_image_of_the_Fornax_Galaxy_Cluster.jpg",],
        Ref_ImageFile: "NGC_1365_Cho.jpg",
        Ref_Image_Creator: "조강욱",
        RefURLs: [
            { title: "스케치 원본", URL: "https://www.nightflight.or.kr/xe/observation/242536#comment_242603" },
            { title: "위키백과 영문",    URL: "https://en.wikipedia.org/wiki/NGC_1365" },
        ], // 배열로 변경
        Desc: "전 하늘에서 가장 멋진 막대 나선 은하, 6천만 광년, 12인치에서 막대 나선이 보일까?",
        Size_degmin: "11.2′ × 6.2′",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["날개를 활짝 펼친 나선을 한 순간 봤다. 막대에서 멀리 크게 뻗어 나간 나선이다. " +
            "그러나, 이 모습을 다시 보기는 쉽지 않았다. 노안/구경의 아쉽움으로 남겨 놓는다.",
                "막대는 잘 보이며 두툼한 모습도 쉽게 인지된다."],
    },
    {
        Index: "NGC 1399",
        Type: "타원 은하",
        Name: "CMG 이름: ball 공/구?",
        Constellation: "화로",
        FinderChart: [
            "예제15.지평좌표_1365_찾기_7월04시 서호주.jpg",
            "적도좌표_화로은하단_스케치.jpg",
            "1030px-VST_image_of_the_Fornax_Galaxy_Cluster.jpg",],
        Ref_ImageFile: "1030px-VST_image_of_the_Fornax_Galaxy_Cluster.jpg",
        Ref_Image_Creator: "ESO, VLT Survey Telescope",
        RefURLs: [
            { title: "이미지 원본", URL: "https://en.wikipedia.org/wiki/NGC_1399#/media/File:VST_image_of_the_Fornax_Galaxy_Cluster.jpg" },
            { title: "위키백과 영문",    URL: "https://en.wikipedia.org/wiki/NGC_1399" },
        ], // 배열로 변경
        Desc: "화로 은하단의 중심 은하, 6천6백만 광년, 1365가 더 큰 이유는??",
        Size_degmin: "3.2 ′ × 3.1 ′",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["관측을 한 것 같은데 큰 기억이 없다. 다른 대상들의 색다름에 비해 너무나 밋밋한 타원 은하여서 그런 듯 한다.",
            "이동근님의 관측 기록이 궁금하다."],
    },
    {
        Index: "NGC 6603",
        Type: "산개 성단",
        Name: "",
        Constellation: "궁수",
        FinderChart: ["적도좌표_NGC6603_스케치.jpg",],
        Ref_ImageFile: "NGC6603_sktech_mdowns.jpg",
        Ref_Image_Creator: "mdowns",
        RefURLs: [
            { title: "스케치 원본", URL: "https://www.cloudynights.com/topic/781877-close-up-view-of-m24-along-with-ngc-6603/" },
            { title: "위키백과 영문",    URL: "https://en.wikipedia.org/wiki/NGC_6603" },
        ], // 배열로 변경
        Desc: "궁수 팔에 있는 M24의 작은 창을 통해 센타우루스 팔에 있는 산개 성단을 볼 수 있다",
        Size_degmin: "5′",
        Obsrv_ImageFile:"",
        Obsrv_Desc:
            ["오밀조밀 보이는 별들과 흰구름 처럼 보이는 배경이 보인다. M24 작은 창을 통해서 보인다는 느낌은 잘 모르겠다.",
                "나중에 더 광각으로 또는 쌍안경으로 M24를 충분히 인지하면서 봐야겠다."],
    },
// *************************************************************************************************************

];