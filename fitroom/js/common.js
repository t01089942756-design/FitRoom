/* =========================================================
   핏룸 공통 스크립트 (common.js)
   - 모든 페이지에 들어가는 상단 메뉴(헤더), 하위 메뉴 탭, 푸터를 그려 줌
   - 로그인 상태, 장바구니 개수, 저장소(localStorage) 기능
   - 상품 카드, 치수 비교(핏 체크) 함수
   페이지에 <div id="header"></div>, <div id="pageHead"></div>,
   <div id="footer"></div> 만 넣으면 자동으로 채워짐
   ========================================================= */

/* ---------- 1. 메뉴 구조 (사이트맵 그대로) ---------- */
const MENU = [
  { name: "브랜드 소개", href: "about.html", sub: [
      ["브랜드 스토리", "about.html#story"],
      ["핏룸이 해결하는 문제", "about.html#problem"],
      ["핏 체크 사용법", "about.html#guide"] ] },
  { name: "샵", href: "shop.html", also: ["detail.html"], sub: [
      ["전체 상품", "shop.html"],
      ["침대·소파", "shop_bed.html"],
      ["책상·의자", "shop_desk.html"],
      ["수납·선반", "shop_storage.html"],
      ["테이블", "shop_table.html"] ] },
  { name: "핏 체크", href: "fitcheck.html", point: true, sub: [
      ["치수 입력·결과", "fitcheck.html"],
      ["공간별 추천 조합", "fitcheck_set.html"] ] },
  { name: "리뷰", href: "review.html", sub: [
      ["전체 리뷰", "review.html"],
      ["포토 리뷰", "review_photo.html"],
      ["리뷰 쓰기", "review_write.html"] ] },
  { name: "방명록", href: "guestbook.html", sub: [
      ["방명록 보기", "guestbook.html"],
      ["방명록 쓰기", "guestbook_write.html"] ] },
  { name: "고객센터", href: "support.html", sub: [
      ["배송·반품 안내", "support.html"],
      ["공지사항", "notice.html"],
      ["자주 묻는 질문", "faq.html"],
      ["1:1 문의", "qna.html"] ] }
];

/* ---------- 2. 저장소 (localStorage) ---------- */
const Store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }
};

// 저장소 키 이름 모음
const KEY = {
  user: "fitroom_user",           // 로그인한 회원 {id, name}
  members: "fitroom_members",     // 가입한 회원 목록
  cart: "fitroom_cart",           // 장바구니 [{id, qty}]
  guestbook: "fitroom_guestbook", // 방명록 글
  reviews: "fitroom_reviews",     // 사용자가 쓴 리뷰
  myRoom: "fitroom_myroom"        // 저장한 내 방 치수
};

/* ---------- 3. 작은 도우미 함수 ---------- */
function currentFile() {
  const f = location.pathname.split("/").pop();
  return f === "" ? "index.html" : f;
}
function formatPrice(n) { return n.toLocaleString("ko-KR") + "원"; }
function dimText(p) { return `${p.w}×${p.d}×${p.h}cm`; }
function getProduct(id) { return PRODUCTS.find(p => p.id === Number(id)); }
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* 핏 체크 핵심: 공간(w, d, h)에 가구 p가 들어가는지
   - 가구를 90도 돌려 놓는 경우도 확인
   - h(높이)를 비워 두면 높이는 따지지 않음
   - margin: 사방 여유 공간(cm) */
function fits(p, w, d, h, margin = 0) {
  const W = w - margin * 2, D = d - margin * 2;
  const flat = (p.w <= W && p.d <= D) || (p.d <= W && p.w <= D);
  const tall = !h || p.h <= h;
  return flat && tall;
}

/* ---------- 4. 상품 그림 (사진이 없을 때) ---------- */
const SHAPES = {
  bed: '<rect x="14" y="40" width="92" height="18" rx="2"/><path d="M14 40V20h14v20M28 40h78"/><rect x="31" y="31" width="22" height="9" rx="3"/><path d="M18 58v8M102 58v8"/>',
  desk: '<path d="M10 28h100M16 28v40M104 28v40"/><rect x="70" y="28" width="34" height="18"/><path d="M83 37h8"/>',
  chair: '<rect x="42" y="10" width="36" height="28" rx="5"/><path d="M38 48h44M60 38v10M44 48v22M76 48v22"/>',
  sofa: '<rect x="18" y="26" width="84" height="22" rx="6"/><rect x="10" y="36" width="14" height="24" rx="4"/><rect x="96" y="36" width="14" height="24" rx="4"/><path d="M24 50h72M24 60v8M96 60v8"/>',
  shelf: '<rect x="38" y="6" width="44" height="66"/><path d="M38 22h44M38 38h44M38 54h44"/>',
  drawer: '<rect x="34" y="12" width="52" height="52" rx="2"/><path d="M34 29h52M34 46h52M56 20h8M56 37h8M56 55h8M38 64v6M82 64v6"/>',
  table: '<ellipse cx="60" cy="28" rx="40" ry="9"/><path d="M60 37v30M46 70h28"/>',
  lowtable: '<rect x="14" y="38" width="92" height="8" rx="2"/><path d="M20 46v16M100 46v16"/>'
};
function shapeSVG(shape) {
  return `<svg viewBox="0 0 120 80" class="shape" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${SHAPES[shape] || SHAPES.desk}</g></svg>`;
}

/* ---------- 5. 상품 카드 (메인, 샵, 핏 체크 결과에서 같이 사용) ---------- */
function productCard(p) {
  const thumb = p.img
    ? `<img src="${p.img}" alt="${escapeHTML(p.name)}">`
    : shapeSVG(p.shape);
  return `
    <article class="card">
      <a class="card-thumb" href="detail.html?id=${p.id}">
        ${thumb}
        <span class="card-dim">W ${p.w} · D ${p.d} · H ${p.h}</span>
      </a>
      <div class="card-body">
        <p class="card-cat">${CATEGORIES[p.cat]}</p>
        <h3 class="card-name"><a href="detail.html?id=${p.id}">${escapeHTML(p.name)}</a></h3>
        <p class="card-size">${dimText(p)} <span>· ${p.weight}kg</span></p>
        <div class="card-foot">
          <strong class="card-price">${formatPrice(p.price)}</strong>
          ${p.easyMove ? '<span class="badge">이사 친화</span>' : ""}
        </div>
        <button type="button" class="btn-cart" data-cart="${p.id}">장바구니 담기</button>
      </div>
    </article>`;
}

/* ---------- 6. 장바구니 ---------- */
function getCart() { return Store.get(KEY.cart, []); }
function cartCount() { return getCart().reduce((sum, item) => sum + item.qty, 0); }
function addToCart(id) {
  const cart = getCart();
  const found = cart.find(item => item.id === Number(id));
  if (found) found.qty += 1;
  else cart.push({ id: Number(id), qty: 1 });
  Store.set(KEY.cart, cart);
  updateCartBadge();
}
function updateCartBadge() {
  const badge = document.querySelector("#cartBadge");
  if (!badge) return;
  const n = cartCount();
  badge.textContent = n;
  badge.hidden = n === 0;
}

// 어느 페이지든 "장바구니 담기" 버튼을 누르면 동작
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-cart]");
  if (!btn) return;
  const p = getProduct(btn.dataset.cart);
  addToCart(btn.dataset.cart);
  showToast(`'${p.name}'을(를) 장바구니에 담았어요.`);
});

/* ---------- 7. 알림 메시지 (토스트) ---------- */
function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- 8. 현재 페이지가 어느 메뉴에 속하는지 ---------- */
function findSection() {
  const file = currentFile();
  return MENU.find(m =>
    m.href === file ||
    (m.also && m.also.includes(file)) ||
    m.sub.some(s => s[1].split("#")[0] === file)
  );
}

/* ---------- 9. 헤더 (상단 메뉴) ---------- */
function renderHeader() {
  const box = document.querySelector("#header");
  if (!box) return;
  const section = findSection();
  const user = Store.get(KEY.user, null);

  const gnb = MENU.map(m => `
    <li class="gnb-item${m === section ? " on" : ""}${m.point ? " point" : ""}">
      <a href="${m.href}" class="gnb-link">${m.name}</a>
      <div class="sub">
        ${m.sub.map(s => `<a href="${s[1]}">${s[0]}</a>`).join("")}
      </div>
    </li>`).join("");

  const util = user
    ? `<span class="hello"><b>${escapeHTML(user.name)}</b>님</span>
       <a href="mypage.html">마이페이지</a>
       <a href="#" id="logoutBtn">로그아웃</a>`
    : `<a href="login.html">로그인</a>
       <a href="join.html">회원가입</a>`;

  box.innerHTML = `
    <header class="hd">
      <div class="inner hd-in">
        <a href="index.html" class="logo" aria-label="핏룸 홈">
          <svg viewBox="0 0 32 32" class="logo-mark" aria-hidden="true">
            <rect x="4" y="8" width="24" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2.4"/>
            <path d="M4 4h24M4 2v4M28 2v4" stroke="#B07A4A" stroke-width="2" fill="none"/>
            <rect x="9" y="17" width="10" height="7" fill="#B07A4A"/>
          </svg>
          <span class="logo-ko">핏룸</span><span class="logo-en">Fit Room</span>
        </a>
        <nav class="gnb" aria-label="주 메뉴"><ul>${gnb}</ul></nav>
        <div class="util">
          ${util}
          <a href="cart.html" class="cart-link">장바구니<span id="cartBadge" class="cart-badge" hidden>0</span></a>
        </div>
      </div>
    </header>`;

  // 드롭다운: 마우스를 올리면 열리고, 벗어나면 잠깐 뒤 닫힘
  box.querySelectorAll(".gnb-item").forEach(li => {
    let timer;
    li.addEventListener("mouseenter", () => {
      clearTimeout(timer);
      box.querySelectorAll(".gnb-item.open").forEach(o => o !== li && o.classList.remove("open"));
      li.classList.add("open");
    });
    li.addEventListener("mouseleave", () => {
      timer = setTimeout(() => li.classList.remove("open"), 120);
    });
  });

  // 로그아웃
  const logout = box.querySelector("#logoutBtn");
  if (logout) {
    logout.addEventListener("click", e => {
      e.preventDefault();
      Store.remove(KEY.user);
      showToast("로그아웃되었어요.");
      renderHeader();
    });
  }

  // 스크롤하면 헤더에 그림자
  window.addEventListener("scroll", () => {
    const hd = document.querySelector(".hd");
    if (hd) hd.classList.toggle("scrolled", window.scrollY > 10);
  });

  updateCartBadge();
}

/* ---------- 10. 서브 페이지 상단 (제목 + 위치 + 2차 메뉴 탭) ---------- */
function renderPageHead() {
  const box = document.querySelector("#pageHead");
  if (!box) return;
  const section = findSection();
  const title = document.body.dataset.title || document.title.split("|")[0].trim();
  const desc = document.body.dataset.desc || "";
  const file = currentFile();
  const hash = location.hash;

  let tabs = "";
  if (section) {
    tabs = `<div class="lnb">${section.sub.map((s, i) => {
      const [f, h] = s[1].split("#");
      // #앵커가 있는 탭은 주소의 #과 같을 때(없으면 첫 번째 탭) 표시
      const on = f === file && (!h || hash === "#" + h || (!hash && i === 0));
      return `<a href="${s[1]}" class="${on ? "on" : ""}">${s[0]}</a>`;
    }).join("")}</div>`;
  }

  box.innerHTML = `
    <div class="page-head">
      <div class="inner">
        <p class="crumb"><a href="index.html">홈</a>${section ? ` <span>›</span> <a href="${section.href}">${section.name}</a>` : ""} <span>›</span> ${escapeHTML(title)}</p>
        <h1>${escapeHTML(title)}</h1>
        ${desc ? `<p class="page-desc">${escapeHTML(desc)}</p>` : ""}
        ${tabs}
      </div>
    </div>`;

  // 같은 페이지 안에서 #앵커 탭을 누르면 탭 표시만 바꿈
  window.addEventListener("hashchange", renderPageHead, { once: true });
}

/* ---------- 11. 푸터 ---------- */
function renderFooter() {
  const box = document.querySelector("#footer");
  if (!box) return;
  const links = MENU.map(m => `<a href="${m.href}">${m.name}</a>`).join("");
  box.innerHTML = `
    <footer class="ft">
      <div class="inner ft-in">
        <div class="ft-brand">
          <p class="ft-logo">핏룸 <span>Fit Room</span></p>
          <p>내 방에 딱 맞는 가구, 치수로 찾는 가구 쇼핑몰</p>
          <nav class="ft-menu">${links}</nav>
        </div>
        <div class="ft-cs">
          <p class="ft-label">고객센터</p>
          <p class="ft-tel">1588-0000</p>
          <p>평일 10:00 ~ 18:00 · 점심 12:00 ~ 13:00<br>주말·공휴일 휴무</p>
        </div>
        <div class="ft-info">
          <p><a href="support.html">배송·반품 안내</a> · <a href="#">이용약관</a> · <a href="#"><b>개인정보처리방침</b></a></p>
          <p>상호 핏룸 · 웹 프로그래밍 과제용 사이트 · 실제 판매하지 않습니다</p>
          <p>이미지 출처: Unsplash</p>
          <p class="copy">Copyright © 2026 hsy (2435027 호세영). All rights reserved.</p>
        </div>
      </div>
    </footer>`;
}

/* ---------- 12. 페이지가 열리면 공통 영역 그리기 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderPageHead();
  renderFooter();
});
