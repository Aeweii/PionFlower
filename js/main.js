
// АДМИН-ПАНЕЛЬ 
if (window.location.search.includes('admin=secret')) {
    window.location.href = 'admin.html';
}
// ==================== КОНСТАНТЫ И ДАННЫЕ ====================
const DELIVERY_PRICES = {
    center: 200,
    west: 300,
    east: 300,
    north: 300,
    south: 300,
    urban: 350,
    dzhalil: 500,
};
const FREE_DELIVERY_THRESHOLD = 3000;

const productsData = [
    {
        id: 1,
        name: "Нежность пионов",
        price: 2900,
        description: "Изысканный букет из нежных пионов",
        composition: ["Розовые пионы", "Гипсофила"],
        category: "author",
        badge: "Хит продаж",
        image: "./media/img/pion.jpeg",
    },
    {
        id: 2,
        name: "Мятный эвкалипт",
        price: 2400,
        description: "Стильная композиция с эвкалиптом",
        composition: ["Эвкалипт", "Белые розы"],
        category: "author",
        badge: "",
        image: "./media/img/mint.jpg",
    },
    {
        id: 3,
        name: "Розовое облако",
        price: 3200,
        description: "Нежный романтичный букет",
        composition: ["Розовые розы", "Гипсофила"],
        category: "wedding",
        badge: "Свадебный",
        image: "./media/img/pink.jpg",
    },
    {
        id: 4,
        name: "Корпоративный стиль",
        price: 3500,
        description: "Элегантный букет для офиса",
        composition: ["Розы", "Гортензии"],
        category: "corporate",
        badge: "Популярный",
        image: "./media/img/business.jpg",
    },
    {
        id: 5,
        name: "Свадебная нежность",
        price: 3800,
        description: "Букет невесты",
        composition: ["Пионовидные розы", "Эустомы"],
        category: "wedding",
        badge: "Свадебный",
        image: "./media/img/wedding.jpg",
    },
    {
        id: 6,
        name: "Алые розы",
        price: 4100,
        description: "15 роз премиум-класса",
        composition: ["Алые розы"],
        category: "mono",
        badge: "Премиум",
        image: "./media/img/red.jpg",
    },
    {
        id: 7,
        name: "Полевые цветы",
        price: 1900,
        description: "Букет из полевых цветов",
        composition: ["Ромашки", "Васильки"],
        category: "author",
        badge: "",
        image: "./media/img/field.jpg",
    },
    {
        id: 8,
        name: "Тюльпаны",
        price: 2100,
        description: "25 тюльпанов",
        composition: ["Тюльпаны"],
        category: "mono",
        badge: "Сезон",
        image: "./media/img/tulips.jpg",
    },
];

// ==================== СОСТОЯНИЕ ====================
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentFilter = "all";

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    initBurgerMenu();
    initMobileMenu();
    setupProfile();
    setupThemeToggle();
    setupCartModal();
    displayPopularProducts();
    setupFilters();
    setupReviewsCarousel();
    setupContactForm();
    setupScrollAnimations();
    setupQuickOrderModal();
    setupLoginModal();
    initTabs();
    initAccordion();
    updateCartCount();
});

// ==================== БУРГЕР-МЕНЮ ====================
function initBurgerMenu() {
    const burger = document.getElementById('burgerMenu');
    const nav = document.getElementById('navMenu');
    
    if (!burger || !nav) return;
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== МОБИЛЬНОЕ МЕНЮ ====================
function initMobileMenu() {
    const burger = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!burger || !mobileMenu) return;
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !burger.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== ПЕРЕКЛЮЧАТЕЛЬ ТЕМ ====================
function setupThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }
    
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
    });
}

// ==================== ПРОФИЛЬ ====================
function setupProfile() {
    const section = document.getElementById("profileSection");
    if (!section) return;
    
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userName = localStorage.getItem("userName") || "";
    const userPhone = localStorage.getItem("userPhone") || "";
    
    if (isLoggedIn && userName) {
        section.innerHTML = `
            <div class="profile-dropdown-wrapper">
                <div class="profile-info" id="profileInfoBtn">
                    <div class="profile-avatar">${escapeHtml(userName[0].toUpperCase())}</div>
                    <span class="profile-name">${escapeHtml(userName)}</span>
                    <i class="fas fa-chevron-down profile-arrow"></i>
                </div>
                <div class="profile-dropdown" id="profileDropdown">
                    <div class="dropdown-item">
                        <i class="fas fa-user"></i>
                        <span>${escapeHtml(userName)}</span>
                    </div>
                    <div class="dropdown-item">
                        <i class="fas fa-phone"></i>
                        <span>${escapeHtml(userPhone) || "Не указан"}</span>
                    </div>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item logout-btn" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Выйти</span>
                    </button>
                </div>
            </div>
        `;
        
        const profileBtn = document.getElementById("profileInfoBtn");
        const dropdown = document.getElementById("profileDropdown");
        
        if (profileBtn && dropdown) {
            profileBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.classList.toggle("active");
            });
            
            document.addEventListener("click", (e) => {
                if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove("active");
                }
            });
        }
        
        document.getElementById("logoutBtn")?.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userName");
            localStorage.removeItem("userPhone");
            showNotification("Вы вышли из аккаунта", "info");
            setupProfile();
        });
    } else {
        section.innerHTML = `<button class="profile-avatar-btn" id="loginBtn"><i class="fas fa-user"></i></button>`;
        document.getElementById("loginBtn")?.addEventListener("click", () => {
            document.getElementById("loginModal")?.classList.add("active");
        });
    }
}

// ==================== МОДАЛЬНОЕ ОКНО ВХОДА ====================
function setupLoginModal() {
    let modal = document.getElementById("loginModal");
    
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "loginModal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Вход в аккаунт</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="loginFormModal">
                        <div class="form-group">
                            <input type="text" id="loginName" placeholder="Ваше имя" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="loginPhone" placeholder="Телефон" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Войти</button>
                    </form>
                    <p class="modal-hint">Введите имя и телефон для входа</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const closeBtn = modal.querySelector(".modal-close");
    const form = document.getElementById("loginFormModal");
    
    closeBtn?.addEventListener("click", () => modal.classList.remove("active"));
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });
    
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("loginName")?.value.trim();
        const phone = document.getElementById("loginPhone")?.value.trim();
        
        if (name && phone) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", name);
            localStorage.setItem("userPhone", phone);
            showNotification(`Добро пожаловать, ${name}!`, "success");
            modal.classList.remove("active");
            setupProfile();
        } else {
            showNotification("Заполните все поля", "error");
        }
    });
}

// ==================== ОТОБРАЖЕНИЕ ПОПУЛЯРНЫХ ТОВАРОВ ====================
function displayPopularProducts() {
    const grid = document.getElementById("popularGrid");
    if (!grid) return;
    
    const popularProducts = productsData.slice(0, 4);
    grid.innerHTML = popularProducts.map(product => createProductCard(product)).join("");
    attachProductCardEvents();
}

function createProductCard(product) {
    const isFavorite = favorites.includes(product.id);
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='./media/img/default.jpg'">
                ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ""}
            </div>
            <div class="card-title">${escapeHtml(product.name)}</div>
            <div class="card-price">${product.price.toLocaleString()} ₽</div>
            <div class="card-actions">
                <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">В корзину</button>
            </div>
        </div>
    `;
}

function attachProductCardEvents() {
    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".favorite-btn") || e.target.closest(".add-to-cart")) return;
            window.location.href = `product-detail.html?id=${card.dataset.id}`;
        });
    });
    
    document.querySelectorAll(".favorite-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(parseInt(btn.dataset.id), btn);
        });
    });
    
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const product = productsData.find(p => p.id === parseInt(btn.dataset.id));
            if (product) addToCart(product, btn);
        });
    });
}

// ==================== ИЗБРАННОЕ ====================
function toggleFavorite(productId, btnElement) {
    const index = favorites.indexOf(productId);
    if (index === -1) {
        favorites.push(productId);
        btnElement.classList.add("active");
        showNotification("Добавлено в избранное", "success");
    } else {
        favorites.splice(index, 1);
        btnElement.classList.remove("active");
        showNotification("Удалено из избранного", "info");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ==================== КОРЗИНА ====================
function updateCartCount() {
    const cartCountElement = document.getElementById("cartCount");
    if (!cartCountElement) return;
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
}

function addToCart(product, btnElement) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showNotification(`"${product.name}" добавлен в корзину`, "success");
    showCartNotification();
    
    if (btnElement) {
        const originalText = btnElement.textContent;
        btnElement.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        setTimeout(() => {
            btnElement.textContent = originalText;
        }, 1500);
    }
}

function showCartNotification() {
    const notification = document.getElementById("cartNotification");
    if (notification) {
        notification.classList.add("show");
        setTimeout(() => notification.classList.remove("show"), 2000);
    }
}

function displayCart() {
    const cartItemsList = document.getElementById("cartItemsList");
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-basket"></i>
                <p>Ваша корзина пуста</p>
                <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
            </div>
        `;
        updateCartSummary();
        return;
    }
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image || "./media/img/default.jpg"}" alt="${item.name}" onerror="this.src='./media/img/default.jpg'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${escapeHtml(item.name)}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-actions">
                    <button class="cart-quantity-btn" data-action="decr" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity || 1}</span>
                    <button class="cart-quantity-btn" data-action="incr" data-id="${item.id}">+</button>
                    <button class="cart-remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `).join("");
    
    attachCartEvents();
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const deliverySelect = document.getElementById("cartDeliveryZoneSelect");
    
    let deliveryPrice = deliverySelect ? DELIVERY_PRICES[deliverySelect.value] || 0 : 0;
    const finalDelivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : deliveryPrice;
    const total = subtotal + finalDelivery;
    const needMore = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : FREE_DELIVERY_THRESHOLD - subtotal;
    
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    
    setText("cartSubtotal", `${subtotal.toLocaleString()} ₽`);
    setText("cartTotalItems", totalItems);
    setText("cartDelivery", `${finalDelivery.toLocaleString()} ₽`);
    setText("cartTotal", `${total.toLocaleString()} ₽`);
    setText("needMore", needMore > 0 ? `${needMore.toLocaleString()}` : "0");
    
    const freeDeliveryNote = document.getElementById("freeDeliveryNote");
    if (freeDeliveryNote) {
        const isFree = subtotal >= FREE_DELIVERY_THRESHOLD;
        freeDeliveryNote.style.background = isFree ? "#c8e6c9" : "#e8f5e9";
        freeDeliveryNote.innerHTML = isFree
            ? '<i class="fas fa-check-circle"></i> Бесплатная доставка!'
            : `<i class="fas fa-truck"></i> Добавьте товаров на ${needMore.toLocaleString()} ₽ для бесплатной доставки`;
    }
}

function attachCartEvents() {
    document.querySelectorAll(".cart-quantity-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (!item) return;
            
            if (btn.dataset.action === "incr") {
                item.quantity++;
            } else if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(i => i.id !== id);
            }
            
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartCount();
        });
    });
    
    document.querySelectorAll(".cart-remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            cart = cart.filter(i => i.id !== parseInt(btn.dataset.id));
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartCount();
            showNotification("Товар удален из корзины", "info");
        });
    });
}

function openCartModal() {
    const modal = document.getElementById("cartModal");
    if (modal) {
        displayCart();
        modal.classList.add("active");
    }
}

function closeCartModal() {
    const modal = document.getElementById("cartModal");
    if (modal) modal.classList.remove("active");
}

function checkout() {
    if (cart.length === 0) {
        showNotification("Корзина пуста", "error");
        return;
    }
    
    if (localStorage.getItem("isLoggedIn") !== "true") {
        closeCartModal();
        document.getElementById("loginModal")?.classList.add("active");
        showNotification("Войдите в аккаунт для оформления заказа", "info");
        return;
    }
    
    const deliverySelect = document.getElementById("cartDeliveryZoneSelect");
    const deliveryZone = deliverySelect?.options[deliverySelect.selectedIndex]?.text || "Не выбран";
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    let deliveryPrice = deliverySelect ? DELIVERY_PRICES[deliverySelect.value] || 0 : 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) deliveryPrice = 0;
    
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: localStorage.getItem("userName"),
            phone: localStorage.getItem("userPhone"),
        },
        items: [...cart],
        delivery: { zone: deliveryZone, price: deliveryPrice },
        subtotal: subtotal,
        total: subtotal + deliveryPrice,
        status: "новый",
    };
    
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
    closeCartModal();
    showNotification(`Заказ #${order.id} оформлен! Мы свяжемся с вами`, "success");
}

function setupCartModal() {
    const cartIcon = document.getElementById("cartIcon");
    const closeCart = document.getElementById("closeCartBtn");
    const continueBtn = document.getElementById("continueShoppingBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const deliverySelect = document.getElementById("cartDeliveryZoneSelect");
    const modal = document.getElementById("cartModal");
    
    cartIcon?.addEventListener("click", openCartModal);
    closeCart?.addEventListener("click", closeCartModal);
    continueBtn?.addEventListener("click", closeCartModal);
    checkoutBtn?.addEventListener("click", checkout);
    deliverySelect?.addEventListener("change", updateCartSummary);
    
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) closeCartModal();
    });
}

// ==================== ФИЛЬТРЫ ====================
function setupFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const catalogGrid = document.getElementById("mainCatalogGrid");
    
    if (!filterBtns.length || !catalogGrid) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            displayFilteredProducts();
        });
    });
}

function displayFilteredProducts() {
    const grid = document.getElementById("mainCatalogGrid");
    if (!grid) return;
    
    let filtered = [...productsData];
    if (currentFilter !== "all") {
        filtered = filtered.filter(p => p.category === currentFilter);
    }
    
    grid.innerHTML = filtered.map(product => createProductCard(product)).join("");
    attachProductCardEvents();
}

// ==================== КАРУСЕЛЬ ОТЗЫВОВ ====================
function setupReviewsCarousel() {
    const carousel = document.getElementById("reviewsCarousel");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    let scrollAmount = 0;
    const scrollStep = 280;
    
    prevBtn.addEventListener("click", () => {
        scrollAmount -= scrollStep;
        if (scrollAmount < 0) scrollAmount = 0;
        carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
    });
    
    nextBtn.addEventListener("click", () => {
        scrollAmount += scrollStep;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        if (scrollAmount > maxScroll) scrollAmount = maxScroll;
        carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
    });
    
    let autoScrollInterval;
    
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (document.hidden) return;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (scrollAmount >= maxScroll) {
                scrollAmount = 0;
            } else {
                scrollAmount += scrollStep;
                if (scrollAmount > maxScroll) scrollAmount = maxScroll;
            }
            carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }, 4000);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    carousel.addEventListener("mouseenter", stopAutoScroll);
    carousel.addEventListener("touchstart", stopAutoScroll);
    carousel.addEventListener("mouseleave", startAutoScroll);
    carousel.addEventListener("touchend", startAutoScroll);
    
    startAutoScroll();
}

// ==================== ФОРМА ОБРАТНОЙ СВЯЗИ ====================
function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contactName")?.value.trim();
        const email = document.getElementById("contactEmail")?.value.trim();
        const message = document.getElementById("contactMessage")?.value.trim();
        
        if (name && message) {
            showNotification(`Спасибо, ${name}! Мы получили ваше сообщение и скоро ответим.`, "success");
            form.reset();
            
            const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
            contacts.push({
                id: Date.now(),
                name,
                email,
                message,
                date: new Date().toISOString()
            });
            localStorage.setItem("contacts", JSON.stringify(contacts));
        } else {
            showNotification("Пожалуйста, заполните имя и сообщение", "error");
        }
    });
}

// ==================== МОДАЛЬНОЕ ОКНО БЫСТРОГО ЗАКАЗА ====================
function setupQuickOrderModal() {
    const modal = document.getElementById("quickOrderModal");
    if (!modal) return;
    
    const callbackBtn = document.getElementById("callbackBtn");
    callbackBtn?.addEventListener("click", () => modal.classList.add("active"));
    
    modal.querySelector(".modal-close")?.addEventListener("click", () => modal.classList.remove("active"));
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });
    
    const form = document.getElementById("quickOrderForm");
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("quickName")?.value.trim();
        const phone = document.getElementById("quickPhone")?.value.trim();
        
        if (name && phone) {
            showNotification(`Спасибо, ${name}! Мы свяжемся с вами`, "success");
            modal.classList.remove("active");
            form.reset();
        } else {
            showNotification("Заполните имя и телефон", "error");
        }
    });
}

// ==================== ТАБЫ ====================
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length === 0) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            tabPanes.forEach(pane => pane.classList.remove('active'));
            const activePane = document.getElementById(tabId);
            if (activePane) activePane.classList.add('active');
        });
    });
}

// ==================== АККОРДЕОН ====================
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (accordionItems.length === 0) return;
    
    function closeAllItems() {
        accordionItems.forEach(item => {
            item.classList.remove('active');
            const body = item.querySelector('.accordion-body');
            if (body) body.style.maxHeight = null;
        });
    }
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            closeAllItems();
            
            if (!isActive) {
                item.classList.add('active');
                const body = item.querySelector('.accordion-body');
                if (body) body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
}

// ==================== АНИМАЦИЯ ПРИ ПРОКРУТКЕ ====================
function setupScrollAnimations() {
    const elements = document.querySelectorAll('.product-card, .review-card, .delivery-info, .about-card, .team-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ==================== УВЕДОМЛЕНИЯ ====================
function showNotification(message, type = "info") {
    let container = document.querySelector(".notifications-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "notifications-container";
        document.body.appendChild(container);
    }
    
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    const icons = { success: "✓", error: "✗", info: "ℹ" };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || "ℹ"}</span>
        <span class="notification-message">${escapeHtml(message)}</span>
        <button class="notification-close">✕</button>
    `;
    
    container.appendChild(notification);
    
    notification.querySelector(".notification-close").addEventListener("click", () => notification.remove());
    
    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease forwards";
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ==================== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ ДЛЯ УВЕДОМЛЕНИЙ ====================
const addAnimationStyles = () => {
    if (!document.querySelector("#mainAnimationStyles")) {
        const style = document.createElement("style");
        style.id = "mainAnimationStyles";
        style.textContent = `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .btn-primary.w-100 {
                width: 100%;
            }
        `;
        document.head.appendChild(style);
    }
};

addAnimationStyles();

// ==================== СЛАЙДЕР КОМАНДЫ ====================
function initTeamSlider() {
    const track = document.getElementById('teamSliderTrack');
    const prevBtn = document.getElementById('teamPrevBtn');
    const nextBtn = document.getElementById('teamNextBtn');
    const dotsContainer = document.getElementById('teamSliderDots');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const slides = Array.from(track.children);
    const slidesPerView = getSlidesPerView();
    let currentIndex = 0;
    let autoScrollInterval;
    const autoScrollDelay = 5000;
    
    function getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    function updateSlider() {
        const slideWidth = slides[0].offsetWidth + 24; // ширина + gap
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        currentIndex = Math.min(currentIndex, maxIndex);
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateDots();
    }
    
    function updateDots() {
        if (!dotsContainer) return;
        
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        const dotsCount = maxIndex + 1;
        
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
                resetAutoScroll();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    function nextSlide() {
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        } else {
            currentIndex = 0;
            updateSlider();
        }
        resetAutoScroll();
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        } else {
            const maxIndex = Math.max(0, slides.length - slidesPerView);
            currentIndex = maxIndex;
            updateSlider();
        }
        resetAutoScroll();
    }
    
    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (!document.hidden) {
                nextSlide();
            }
        }, autoScrollDelay);
    }
    
    function resetAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            startAutoScroll();
        }
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
    
    // Обработчики событий
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Пересчет при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newSlidesPerView = getSlidesPerView();
            if (newSlidesPerView !== slidesPerView) {
                location.reload(); // Простая перезагрузка для обновления слайдера
            }
        }, 250);
    });
    
    // Пауза при наведении
    const sliderContainer = document.querySelector('.team-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoScroll);
        sliderContainer.addEventListener('mouseleave', startAutoScroll);
        sliderContainer.addEventListener('touchstart', stopAutoScroll);
        sliderContainer.addEventListener('touchend', startAutoScroll);
    }
    
    // Запуск
    setTimeout(() => {
        updateSlider();
        startAutoScroll();
    }, 100);
}

// Запуск слайдера после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    initTeamSlider();
});