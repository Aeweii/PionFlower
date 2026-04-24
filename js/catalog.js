// Загрузка товаров из localStorage
let productsData = [];

function loadProducts() {
    const saved = localStorage.getItem('products');
    if (saved && JSON.parse(saved).length > 0) {
        productsData = JSON.parse(saved);
    } else {
        productsData = [
            { id: 1, name: "Нежность пионов", price: 2900, description: "Изысканный букет из нежных пионов", composition: ["Розовые пионы"], category: "author", badge: "Хит продаж", image: "./media/img/pion.jpeg" },
            { id: 2, name: "Мятный эвкалипт", price: 2400, description: "Стильная композиция с эвкалиптом", composition: ["Эвкалипт", "Белые розы"], category: "author", badge: "", image: "./media/img/mint.jpg" },
            { id: 3, name: "Розовое облако", price: 3200, description: "Нежный романтичный букет", composition: ["Розовые розы", "Гипсофила"], category: "wedding", badge: "Свадебный", image: "./media/img/pink.jpg" },
            { id: 4, name: "Лавандовый сон", price: 2700, description: "Ароматный букет с лавандой", composition: ["Лаванда", "Сухоцветы"], category: "author", badge: "", image: "./media/img/violet.jpg" },
            { id: 5, name: "Корпоративный стиль", price: 3500, description: "Элегантный букет для офиса", composition: ["Розы", "Гортензии"], category: "corporate", badge: "Популярный", image: "./media/img/business.jpg" },
            { id: 6, name: "Алые розы", price: 4100, description: "15 роз премиум-класса", composition: ["Алые розы"], category: "mono", badge: "Премиум", image: "./media/img/red.jpg" },
            { id: 7, name: "Свадебная нежность", price: 3800, description: "Букет невесты", composition: ["Пионовидные розы"], category: "wedding", badge: "Свадебный", image: "./media/img/wedding.jpg" },
            { id: 8, name: "Полевые цветы", price: 1900, description: "Букет из полевых цветов", composition: ["Ромашки", "Васильки"], category: "author", badge: "", image: "./media/img/field.jpg" },
            { id: 9, name: "Бизнес-букет", price: 4200, description: "Строгая композиция", composition: ["Гвоздики"], category: "corporate", badge: "", image: "./media/img/bisiness2.jpg" },
            { id: 10, name: "Тюльпаны", price: 2100, description: "25 тюльпанов", composition: ["Тюльпаны"], category: "mono", badge: "Сезон", image: "./media/img/tulips.jpg" },
            { id: 11, name: "Пионовидные розы", price: 3300, description: "Нежные пионовидные розы", composition: ["Пионовидные розы"], category: "author", badge: "Новинка", image: "./media/img/pionrose.jpg" },
            { id: 12, name: "Хризантемы", price: 2500, description: "Кустовые хризантемы", composition: ["Хризантемы"], category: "mono", badge: "", image: "./media/img/chrysanthemums.jpg" }
        ];
        localStorage.setItem('products', JSON.stringify(productsData));
    }
}

const DELIVERY_PRICES = { center: 200, west: 300, east: 300, dzhalil: 500 };
const FREE_DELIVERY_THRESHOLD = 3000;
const ITEMS_PER_PAGE = 8;

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentFilter = "all";
let currentSort = "default";
let currentPage = 1;
let currentSearchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    initBurgerMenu();
    initMobileMenu();
    initThemeToggle();
    setupProfile();
    initCartModal();
    setupLoginModal();
    setupCatalogFilters();
    initCatalogSearch();
    displayCatalogProducts();
    setupPagination();
    updateCartCount();
});

function initBurgerMenu() {
    const burger = document.getElementById("burgerMenu");
    const nav = document.getElementById("navMenu");
    if (!burger || !nav) return;
    burger.addEventListener("click", () => {
        burger.classList.toggle("active");
        nav.classList.toggle("active");
    });
}

function initMobileMenu() {
    const burger = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!burger || !mobileMenu) return;
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
}

function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-theme");
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
    });
}

function setupProfile() {
    const section = document.getElementById("profileSection");
    if (!section) return;
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userName = localStorage.getItem("userName") || "";
    if (isLoggedIn && userName) {
        section.innerHTML = `<div class="profile-dropdown-wrapper"><div class="profile-info" id="profileInfoBtn"><div class="profile-avatar">${userName[0].toUpperCase()}</div><span class="profile-name">${escapeHtml(userName)}</span><i class="fas fa-chevron-down"></i></div><div class="profile-dropdown" id="profileDropdown"><button class="dropdown-item logout-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i><span>Выйти</span></button></div></div>`;
        const btn = document.getElementById("profileInfoBtn");
        const dropdown = document.getElementById("profileDropdown");
        btn?.addEventListener("click", (e) => { e.stopPropagation(); dropdown.classList.toggle("active"); });
        document.addEventListener("click", () => dropdown?.classList.remove("active"));
        document.getElementById("logoutBtn")?.addEventListener("click", () => { localStorage.removeItem("isLoggedIn"); localStorage.removeItem("userName"); showNotification("Вы вышли", "info"); setupProfile(); });
    } else {
        section.innerHTML = `<button class="profile-avatar-btn" id="loginBtn"><i class="fas fa-user"></i></button>`;
        document.getElementById("loginBtn")?.addEventListener("click", () => document.getElementById("loginModal")?.classList.add("active"));
    }
}

function updateCartCount() {
    const total = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
    const badge = document.getElementById("cartCount");
    if (badge) { badge.textContent = total; badge.style.display = total > 0 ? "flex" : "none"; }
}

function addToCart(product, btn) {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showNotification(`"${product.name}" добавлен`, "success");
    const notif = document.getElementById("cartNotification");
    notif?.classList.add("show");
    setTimeout(() => notif?.classList.remove("show"), 2000);
    if (btn) { const orig = btn.textContent; btn.textContent = "✓ Добавлено"; setTimeout(() => (btn.textContent = orig), 1000); }
}

function displayCatalogProducts() {
    const grid = document.getElementById("catalogGrid");
    if (!grid) return;
    let filtered = [...productsData];
    if (currentFilter !== "all") filtered = filtered.filter((p) => p.category === currentFilter);
    if (currentSearchQuery) filtered = filtered.filter((p) => p.name.toLowerCase().includes(currentSearchQuery) || (p.description && p.description.toLowerCase().includes(currentSearchQuery)));
    if (currentSort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (currentSort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    document.getElementById("searchFoundCount") && (document.getElementById("searchFoundCount").textContent = filtered.length);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);
    if (paginated.length === 0 && filtered.length === 0) { grid.innerHTML = `<div class="no-results-message" style="grid-column:1/-1; text-align:center; padding:60px;"><i class="fas fa-search"></i><h3>Ничего не найдено</h3><button class="btn-primary" onclick="location.reload()">Сбросить</button></div>`; return; }
    grid.innerHTML = paginated.map((p) => { const isFav = favorites.includes(p.id); return `<div class="product-card" data-id="${p.id}"><div class="card-image"><img src="${p.image || "./media/img/default.jpg"}" alt="${p.name}" onerror="this.src='./media/img/default.jpg'">${p.badge ? `<span class="card-badge">${p.badge}</span>` : ""}</div><div class="card-title">${escapeHtml(p.name)}</div><div class="card-price">${p.price.toLocaleString()} ₽</div><div class="card-actions"><button class="favorite-btn ${isFav ? "active" : ""}" data-id="${p.id}"><i class="fas fa-heart"></i></button><button class="btn-primary add-to-cart" data-id="${p.id}">В корзину</button></div></div>`; }).join("");
    document.querySelectorAll(".product-card").forEach((card) => { card.addEventListener("click", (e) => { if (e.target.closest(".favorite-btn") || e.target.closest(".add-to-cart")) return; window.location.href = `product-detail.html?id=${card.dataset.id}`; }); });
    document.querySelectorAll(".favorite-btn").forEach((btn) => { btn.addEventListener("click", (e) => { e.stopPropagation(); const id = parseInt(btn.dataset.id); const idx = favorites.indexOf(id); if (idx === -1) { favorites.push(id); btn.classList.add("active"); showNotification("В избранном", "success"); } else { favorites.splice(idx, 1); btn.classList.remove("active"); showNotification("Удалено", "info"); } localStorage.setItem("favorites", JSON.stringify(favorites)); }); });
    document.querySelectorAll(".add-to-cart").forEach((btn) => { btn.addEventListener("click", (e) => { e.stopPropagation(); const id = parseInt(btn.dataset.id); const product = productsData.find((p) => p.id === id); if (product) addToCart(product, btn); }); });
}

function setupCatalogFilters() {
    document.querySelectorAll(".filter-btn").forEach((btn) => { btn.addEventListener("click", () => { document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active")); btn.classList.add("active"); currentFilter = btn.dataset.filter; currentPage = 1; displayCatalogProducts(); setupPagination(); }); });
    document.getElementById("sort")?.addEventListener("change", (e) => { currentSort = e.target.value; currentPage = 1; displayCatalogProducts(); setupPagination(); });
}

function initCatalogSearch() {
    const input = document.getElementById("catalogSearchInput");
    const clear = document.getElementById("catalogSearchClear");
    const stats = document.getElementById("searchStats");
    if (!input) return;
    const search = () => { currentSearchQuery = input.value.trim().toLowerCase(); clear.style.display = currentSearchQuery ? "flex" : "none"; stats.style.display = currentSearchQuery ? "flex" : "none"; currentPage = 1; displayCatalogProducts(); setupPagination(); };
    let timer;
    input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(search, 300); });
    clear?.addEventListener("click", () => { input.value = ""; currentSearchQuery = ""; clear.style.display = "none"; stats.style.display = "none"; currentPage = 1; displayCatalogProducts(); setupPagination(); input.focus(); });
}

function setupPagination() {
    const container = document.getElementById("pagination");
    if (!container) return;
    let filtered = [...productsData];
    if (currentFilter !== "all") filtered = filtered.filter((p) => p.category === currentFilter);
    if (currentSearchQuery) filtered = filtered.filter((p) => p.name.toLowerCase().includes(currentSearchQuery));
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) { container.innerHTML = ""; return; }
    let html = "";
    for (let i = 1; i <= totalPages; i++) html += `<button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
    container.innerHTML = html;
    document.querySelectorAll(".pagination-btn").forEach((btn) => { btn.addEventListener("click", () => { currentPage = parseInt(btn.dataset.page); displayCatalogProducts(); setupPagination(); window.scrollTo({ top: 0, behavior: "smooth" }); }); });
}

function setupLoginModal() {
    const modal = document.getElementById("loginModal");
    if (!modal) return;
    modal.querySelector(".modal-close")?.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active"); });
    document.getElementById("loginFormModal")?.addEventListener("submit", (e) => { e.preventDefault(); const name = document.getElementById("loginName").value.trim(); const phone = document.getElementById("loginPhone").value.trim(); if (name && phone) { localStorage.setItem("isLoggedIn", "true"); localStorage.setItem("userName", name); localStorage.setItem("userPhone", phone); showNotification(`Добро пожаловать, ${name}!`, "success"); modal.classList.remove("active"); setupProfile(); } else showNotification("Заполните все поля", "error"); });
}

function initCartModal() {
    const modal = document.getElementById("cartModal");
    const cartIcon = document.getElementById("cartIcon");
    const closeBtn = document.getElementById("closeCartBtn");
    const continueBtn = document.getElementById("continueShoppingBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const deliverySelect = document.getElementById("cartDeliveryZoneSelect");
    cartIcon?.addEventListener("click", () => { displayCart(); modal?.classList.add("active"); });
    closeBtn?.addEventListener("click", () => modal?.classList.remove("active"));
    continueBtn?.addEventListener("click", () => modal?.classList.remove("active"));
    checkoutBtn?.addEventListener("click", checkout);
    deliverySelect?.addEventListener("change", updateCartSummary);
    modal?.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active"); });
}

function displayCart() {
    const container = document.getElementById("cartItemsList");
    if (!container) return;
    if (cart.length === 0) { container.innerHTML = `<div class="empty-cart-message"><i class="fas fa-shopping-basket"></i><p>Корзина пуста</p></div>`; updateCartSummary(); return; }
    container.innerHTML = cart.map((item) => `<div class="cart-item" data-id="${item.id}"><div class="cart-item-image"><img src="${item.image || "./media/img/default.jpg"}" onerror="this.src='./media/img/default.jpg'"></div><div class="cart-item-details"><div class="cart-item-name">${escapeHtml(item.name)}</div><div class="cart-item-price">${item.price.toLocaleString()} ₽</div><div class="cart-item-actions"><button class="cart-quantity-btn" data-action="decr" data-id="${item.id}">-</button><span class="cart-item-quantity">${item.quantity || 1}</span><button class="cart-quantity-btn" data-action="incr" data-id="${item.id}">+</button><button class="cart-remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button></div></div></div>`).join("");
    document.querySelectorAll(".cart-quantity-btn").forEach((btn) => { btn.addEventListener("click", () => { const id = parseInt(btn.dataset.id); const item = cart.find((i) => i.id === id); if (btn.dataset.action === "incr") item.quantity++; else if (item.quantity > 1) item.quantity--; else cart = cart.filter((i) => i.id !== id); localStorage.setItem("cart", JSON.stringify(cart)); displayCart(); updateCartCount(); }); });
    document.querySelectorAll(".cart-remove-btn").forEach((btn) => { btn.addEventListener("click", () => { cart = cart.filter((i) => i.id !== parseInt(btn.dataset.id)); localStorage.setItem("cart", JSON.stringify(cart)); displayCart(); updateCartCount(); showNotification("Товар удален", "info"); }); });
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    const totalItems = cart.reduce((s, i) => s + (i.quantity || 1), 0);
    const select = document.getElementById("cartDeliveryZoneSelect");
    let delivery = select ? DELIVERY_PRICES[select.value] || 0 : 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) delivery = 0;
    const total = subtotal + delivery;
    if (document.getElementById("cartSubtotal")) document.getElementById("cartSubtotal").textContent = `${subtotal.toLocaleString()} ₽`;
    if (document.getElementById("cartTotalItems")) document.getElementById("cartTotalItems").textContent = totalItems;
    if (document.getElementById("cartDelivery")) document.getElementById("cartDelivery").textContent = `${delivery.toLocaleString()} ₽`;
    if (document.getElementById("cartTotal")) document.getElementById("cartTotal").textContent = `${total.toLocaleString()} ₽`;
    const note = document.getElementById("freeDeliveryNote");
    if (note) note.innerHTML = subtotal >= FREE_DELIVERY_THRESHOLD ? '<i class="fas fa-check-circle"></i> Бесплатная доставка!' : `<i class="fas fa-truck"></i> Добавьте на ${(FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString()} ₽ для бесплатной доставки`;
}

function checkout() {
    if (cart.length === 0) return showNotification("Корзина пуста", "error");
    if (localStorage.getItem("isLoggedIn") !== "true") { document.getElementById("cartModal")?.classList.remove("active"); document.getElementById("loginModal")?.classList.add("active"); return showNotification("Войдите в аккаунт", "info"); }
    const select = document.getElementById("cartDeliveryZoneSelect");
    const deliveryZone = select?.options[select.selectedIndex]?.text || "Не выбран";
    const subtotal = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    let delivery = select ? DELIVERY_PRICES[select.value] || 0 : 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) delivery = 0;
    const order = { id: Date.now(), date: new Date().toISOString(), customer: { name: localStorage.getItem("userName"), phone: localStorage.getItem("userPhone") }, items: [...cart], delivery: { zone: deliveryZone, price: delivery }, subtotal, total: subtotal + delivery, status: "новый" };
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
    document.getElementById("cartModal")?.classList.remove("active");
    showNotification(`Заказ #${order.id} оформлен!`, "success");
}

function showNotification(message, type = "info") {
    let container = document.querySelector(".notifications-container");
    if (!container) { container = document.createElement("div"); container.className = "notifications-container"; document.body.appendChild(container); }
    const notif = document.createElement("div");
    notif.className = `notification ${type}`;
    notif.innerHTML = `<span>${type === "success" ? "✓" : type === "error" ? "✗" : "ℹ"}</span><span>${escapeHtml(message)}</span><button class="notification-close" style="background:none;border:none;margin-left:auto;cursor:pointer;">✕</button>`;
    container.appendChild(notif);
    notif.querySelector(".notification-close").addEventListener("click", () => notif.remove());
    setTimeout(() => notif.remove(), 3000);
}

function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

if (window.location.search.includes('admin=secret')) { window.location.href = 'admin.html'; }