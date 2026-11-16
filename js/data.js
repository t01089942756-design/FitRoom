/* =========================================================
   핏룸 데이터 파일 (data.js)
   - 상품, 리뷰, 방명록 기본 데이터를 모아 둔 파일
   - 메인, 샵, 핏 체크 페이지가 모두 이 데이터를 같이 사용
   - 치수 단위: cm  (w = 가로, d = 깊이(세로), h = 높이)
   ========================================================= */

// 카테고리 이름 (샵 2차 메뉴와 같음)
const CATEGORIES = {
  bed: "침대·소파",
  desk: "책상·의자",
  storage: "수납·선반",
  table: "테이블"
};

// 카테고리별 샵 페이지 파일
const CATEGORY_PAGE = {
  bed: "shop_bed.html",
  desk: "shop_desk.html",
  storage: "shop_storage.html",
  table: "shop_table.html"
};

/* 상품 목록
   img      : 실제 사진 경로 (예: "images/products/desk01.jpg"), 비워 두면 그림으로 대체
   shape    : 사진이 없을 때 보여줄 그림 종류
   easyMove : 이사 친화 (분해 가능 + 25kg 이하)
   best     : 메인 베스트 상품에 노출 */
const PRODUCTS = [
  { id: 1,  name: "오크 슬림 책상",       cat: "desk",    shape: "desk",     price: 89000,  w: 120, d: 60, h: 74,  weight: 18, easyMove: true,  best: true,  img: "" },
  { id: 2,  name: "컴팩트 접이식 책상",    cat: "desk",    shape: "desk",     price: 49000,  w: 80,  d: 45, h: 72,  weight: 9,  easyMove: true,  best: false, img: "" },
  { id: 3,  name: "라운드 등받이 의자",    cat: "desk",    shape: "chair",    price: 59000,  w: 45,  d: 48, h: 80,  weight: 5,  easyMove: true,  best: true,  img: "" },
  { id: 4,  name: "원목 슈퍼싱글 침대",    cat: "bed",     shape: "bed",      price: 199000, w: 110, d: 200, h: 35, weight: 38, easyMove: false, best: true,  img: "" },
  { id: 5,  name: "1인 패브릭 소파",       cat: "bed",     shape: "sofa",     price: 159000, w: 85,  d: 78, h: 75,  weight: 21, easyMove: false, best: false, img: "" },
  { id: 6,  name: "폴딩 소파베드",         cat: "bed",     shape: "sofa",     price: 239000, w: 140, d: 85, h: 80,  weight: 32, easyMove: false, best: false, img: "" },
  { id: 7,  name: "5단 오픈 선반",         cat: "storage", shape: "shelf",    price: 69000,  w: 80,  d: 30, h: 180, weight: 14, easyMove: true,  best: true,  img: "" },
  { id: 8,  name: "슬림 틈새 수납장",      cat: "storage", shape: "shelf",    price: 39000,  w: 25,  d: 40, h: 110, weight: 7,  easyMove: true,  best: false, img: "" },
  { id: 9,  name: "3단 원목 서랍장",       cat: "storage", shape: "drawer",   price: 99000,  w: 60,  d: 40, h: 75,  weight: 22, easyMove: false, best: false, img: "" },
  { id: 10, name: "2인 원형 식탁",         cat: "table",   shape: "table",    price: 119000, w: 70,  d: 70, h: 74,  weight: 15, easyMove: true,  best: false, img: "" },
  { id: 11, name: "접이식 좌식 테이블",    cat: "table",   shape: "lowtable", price: 35000,  w: 80,  d: 50, h: 32,  weight: 5,  easyMove: true,  best: false, img: "" },
  { id: 12, name: "미니 사이드 테이블",    cat: "table",   shape: "table",    price: 29000,  w: 40,  d: 40, h: 55,  weight: 3,  easyMove: true,  best: false, img: "" }
];

// 기본 리뷰 (리뷰 쓰기 페이지에서 쓴 글은 localStorage에 추가 저장)
const REVIEWS = [
  { name: "지은", productId: 1, rating: 5, room: "원룸 300×350", date: "2026.11.10",
    text: "창가 자리 폭이 125cm라 120cm 책상이 딱 들어갔어요. 핏 체크 아니었으면 140짜리 샀을 거예요." },
  { name: "민수", productId: 7, rating: 4, room: "오피스텔 280×400", date: "2026.11.07",
    text: "현관문 통과 걱정했는데 분해돼서 와서 편했어요. 조립은 혼자 30분 정도 걸렸어요." },
  { name: "하늘", productId: 4, rating: 5, room: "투룸 작은방 270×320", date: "2026.11.03",
    text: "방이 좁아서 침대 놓고 남는 폭이 궁금했는데 결과에 남는 공간까지 나와서 좋았어요." },
  { name: "도윤", productId: 11, rating: 4, room: "원룸 320×320", date: "2026.10.29",
    text: "이사 갈 때도 접어서 들고 가면 돼서 이사 친화 배지 보고 샀어요." }
];

// 기본 방명록 (방명록 쓰기 페이지에서 쓴 글은 localStorage "fitroom_guestbook"에 저장)
const GUESTBOOK_SEED = [
  { name: "지은", text: "이런 사이트 기다렸어요! 치수로 찾는 게 진짜 편해요.", date: "2026.11.14" },
  { name: "민수", text: "책상 카테고리 상품이 더 늘어났으면 좋겠어요.", date: "2026.11.13" },
  { name: "하늘", text: "이사 친화 배지 덕분에 고르기 쉬웠어요.", date: "2026.11.12" }
];
