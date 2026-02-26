/**
 * 
 */

function simpleLightbox(imageUrl, maxWidth, bgColor){
    if(typeof bgColor === 'undefined'){
        bgColor = '#000';
    }
    if(typeof maxWidth === 'undefined'){
        maxWidth = '1100px';
    }
    window.open('', 'simpleLightbox').document.write('<html><head><meta name="viewport" content="user-scalable=yes, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, width=device-width" /></head><body style="margin:0;'+bgColor+';height:100%;" ><table border="0" width="100%" height="100%"><tr><td valign="middle" align="center"><img style="position:relative;z-index:2;width:100%;max-width:'+maxWidth+';" src="'+imageUrl+'"/></td></tr></table></body></html>');
}

// 2025-01-19. 공통으로 사용해 보자.
const c_ConstName_HSort = [
"거문고", "게", "고래", "고물", "공기펌프", "공작", "궁수", "그물", "극락조", "기린", "까마귀", "나침반", "날치", "남십자가", "남쪽물고기", "남쪽삼각형", "남쪽왕관", "도마뱀", "독수리", "돌고래", "돛", "두루미", "마차부", "망원경", "머리털", "목동", "물고기", "물뱀", "물병", "방패", "백조", "뱀", "뱀주인", "봉황", "북쪽왕관", "비둘기", "사냥개", "사자", "살쾡이", "삼각형", "쌍둥이", "세페우스", "센타우루스", "시계", "안드로메다", "양", "에리다누스", "여우", "염소", "오리온", "외뿔소", "용", "용골", "육분의", "이리","인디언", "작은개", "작은곰", "작은사자", "전갈", "제단", "조각가", "조각칼", "조랑말", "직각자", "처녀", "천칭", "카멜레온", "카시오페이아",  "컴퍼스", "컵", "큰개", "큰곰",  "큰물뱀", "큰부리새", "테이블산", "토끼", "파리", "팔분의","페가수스", "페르세우스", "헤르쿨레스", "현미경", "화가",  "화로", "화살", "황새치", "황소",
];
const c_ConstNameAbbr_HSort = [
"LYR", "CNC", "CET", "PUP", "ANT", "PAV", "SGR", "RET", "APS", "CAM", "CRV", "PYX", "VOL", "CRU", "PSA", "TRA", "CRA", "LAC", "AQL", "DEL", "VEL", "GRU", "AUR", "TEL", "COM", "BOO", "PSC", "HYI", "AQR", "SCT", "CYG", "SER",  "OPH", "PHE", "CRB", "COL", "CVN", "LEO", "LYN", "TRI", "GEM", "CEP", "CEN", "HOR", "AND", "ARI", "ERI", "VUL", "CAP", "ORI", "MON", "DRA", "CAR", "SEX", "LUP", "IND", "CMI", "UMI", "LMI", "SCO", "ARA", "SCL", "CAE", "EQU", "NOR", "VIR", "LIB", "CHA", "CAS", "CIR", "CRT", "CMA", "UMA", "HYA", "TUC", "MEN", "LEP", "MUS", "OCT", "PEG", "PER", "HER", "MIC",  "PIC", "FOR", "SGE", "DOR", "TAU"
];

const c_ConstEName_HSort = [
    "Lyra", "Cancer", "Cetus", "Puppis", "Antlia", "Pavo", "Sagittarius", "Reticulum", "Apus", "Camelopardalis", "Corvus", "Pyxis", "Volans", "Crux", "Piscis Austrinus", "Triangulum Australe", "Corona Australis", "Lacerta", "Aquila", "Delphinus", "Vela", "Grus", "Auriga", "Telescopium", "Coma Berenices", "Bootes", "Pisces", "Hydrus", "Aquarius", "Scutum", "Cygnus", "Serpens", "Ophiuchus", "Phoenix", "Corona Borealis", "Columba", "Canes Venatici", "Leo", "Lynx", "Triangulum", "Gemini", "Cepheus", "Centaurus", "Horologium", "Andromeda", "Aries", "Eridanus", "Vulpecula", "Capricornus", "Orion", "Monoceros", "Draco", "Carina", "Sextans", "Lupus", "Indus", "Canis Minor", "Ursa Minor", "Leo Minor", "Scorpius", "Ara", "Sculptor", "Caelum", "Equuleus", "Norma", "Virgo", "Libra", "Chamaeleon", "Cassiopeia", "circinus", "Crater", "Canis Major", "Ursa Major", "Hydra", "Tucana", "Mensa", "Lepus", "Musca", "Octans", "Pegasus", "Perseus", "Hercules", "Microscopium", "Pictor", "Fornax", "Sagitta", "Dorado", "Taurus",
];


/* onclick="javascript:window.close('simpleLightbox');" */

