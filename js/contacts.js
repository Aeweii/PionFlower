// ==================== contacts.js (полная версия с объединённой шапкой) ====================

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

// ==================== СОСТОЯНИЕ ====================
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    initBurgerMenu();
    initMobileMenu();
    setupThemeToggle();
    setupProfile();
    setupCartModal();
    setupFeedbackForm();
    setupQuickContacts();
    setupSocialLinks();
    setupRouteButton();
    setupFAQ();
    updateCartCount();
    setupLoginModal();
    addAnimationStyles();
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

// ==================== ФОРМА ОБРАТНОЙ СВЯЗИ ====================
function setupFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('feedbackName')?.value.trim();
        const phone = document.getElementById('feedbackPhone')?.value.trim();
        const message = document.getElementById('feedbackMessage')?.value.trim();
        
        if (!name || !phone || !message) {
            showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }
        
        if (!/^[\d\s\+\(\)-]{10,}$/.test(phone)) {
            showNotification('Пожалуйста, введите корректный номер телефона', 'error');
            return;
        }
        
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbacks.push({
            id: Date.now(),
            name,
            phone,
            message,
            date: new Date().toISOString()
        });
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        
        showNotification(`Спасибо, ${name}! Мы ответим вам в ближайшее время 🌸`, 'success');
        form.reset();
    });
}

// ==================== БЫСТРЫЕ КОНТАКТЫ ====================
function setupQuickContacts() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    const telegramBtn = document.getElementById('telegramBtn');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const phone = '78553123456';
            const message = encodeURIComponent('Здравствуйте! Хочу заказать букет 🌸');
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        });
    }
    
    if (telegramBtn) {
        telegramBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const username = 'PionFlowerBot';
            window.open(`https://t.me/${username}`, '_blank');
        });
    }
}

// ==================== СОЦИАЛЬНЫЕ СЕТИ ====================
function setupSocialLinks() {
    const instagramBtn = document.getElementById('instagramBtn');
    const tgChannelBtn = document.getElementById('tgChannelBtn');
    
    if (instagramBtn) {
        instagramBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Наш Instagram: @pionflower_almet 🌸', 'info');
        });
    }
    
    if (tgChannelBtn) {
        tgChannelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Telegram-канал: t.me/pionflower', 'info');
        });
    }
}

// ==================== ПОСТРОЕНИЕ МАРШРУТА ====================
function setupRouteButton() {
    const routeBtn = document.getElementById('routeBtn');
    
    if (routeBtn) {
        routeBtn.addEventListener('click', () => {
            const url = 'https://yandex.ru/maps/?rtext=~54.899183,52.296782&rtt=mt';
            window.open(url, '_blank');
        });
    }
}

// ==================== FAQ (аккордеон) ====================
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        
        const toggleItem = () => {
            item.classList.toggle('active');
        };
        
        question.addEventListener('click', toggleItem);
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleItem();
            });
        }
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



// Админ-панель - добавьте к URL ?admin=secret
if (window.location.search.includes('admin=secret')) {
    window.location.href = 'admin.html';
}