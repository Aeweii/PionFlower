// ==================== КОНСТАНТЫ ====================
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

// Состояние корзины
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    setupProfile();
    setupThemeToggle();
    setupCartModal();
    setupFAQ();
    setupRouteButton();
    setupDeliveryCalculator();
    updateCartCount();
    initBurgerMenu();
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
        setupLoginModal();
    }
}

// ==================== МОДАЛЬНОЕ ОКНО ВХОДА ====================
function setupLoginModal() {
    let modal = document.getElementById("loginModal");
    if (!modal) return;
    
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

function addToCart(product) {
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
                <img src="${item.image || "media/img/default.jpg"}" alt="${item.name}" onerror="this.src='media/img/default.jpg'">
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

// ==================== FAQ ====================
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

// ==================== МАРШРУТ ====================
function setupRouteButton() {
    const routeBtn = document.getElementById('routeBtn');
    
    if (routeBtn) {
        routeBtn.addEventListener('click', () => {
            const url = 'https://yandex.ru/maps/?rtext=~54.899183,52.296782&rtt=mt';
            window.open(url, '_blank');
        });
    }
}

// ==================== КАЛЬКУЛЯТОР ДОСТАВКИ ====================
function setupDeliveryCalculator() {
    const form = document.getElementById('deliveryForm');
    const resultDiv = document.getElementById('calcResult');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const zone = document.getElementById('deliveryZone').value;
        const amount = parseFloat(document.getElementById('orderAmount').value);
        
        if (!zone) {
            showNotification('Выберите район доставки', 'error');
            return;
        }
        
        let price = 0;
        let zoneName = '';
        
        switch(zone) {
            case 'center':
                price = 200;
                zoneName = 'Центр (Ленина, Советская, Гагарина)';
                break;
            case 'west':
                price = 300;
                zoneName = 'Западный (микрорайон Западный)';
                break;
            case 'east':
                price = 300;
                zoneName = 'Восточный (микрорайон Восточный)';
                break;
            case 'north':
                price = 300;
                zoneName = 'Северный (микрорайон Северный)';
                break;
            case 'south':
                price = 300;
                zoneName = 'Южный (микрорайон Южный)';
                break;
            case 'urban':
                price = 350;
                zoneName = 'Городок нефтяников';
                break;
            case 'dzhalil':
                price = 500;
                zoneName = 'пгт Джалиль';
                break;
            default:
                price = 300;
                zoneName = 'Альметьевск';
        }
        
        let isFree = false;
        let finalPrice = price;
        
        if (amount && amount >= 3000) {
            isFree = true;
            finalPrice = 0;
        }
        
        resultDiv.style.display = 'block';
        
        if (isFree) {
            resultDiv.innerHTML = `
                <div>Бесплатная доставка!</div>
                <div class="price free">0 ₽</div>
                <div class="note">При заказе от 3000 ₽ доставка бесплатная</div>
                <div class="note">Район: ${zoneName}</div>
                <button onclick="closeResult()" style="margin-top: 12px; background: none; border: none; color: var(--text-light); font-size: 12px;">✕ Закрыть</button>
            `;
        } else {
            let timeText = '1-2 часа';
            if (zone === 'dzhalil') {
                timeText = '2-3 часа';
            }
            
            resultDiv.innerHTML = `
                <div>🚚 Доставка</div>
                <div class="price">${finalPrice} ₽</div>
                <div class="note">Район: ${zoneName}</div>
                <div class="note">Среднее время: ${timeText}</div>
                ${amount && amount > 0 && amount < 3000 ? '<div class="note">До бесплатной доставки не хватает ' + (3000 - amount) + ' ₽</div>' : ''}
                <button onclick="closeResult()" style="margin-top: 12px; background: none; border: none; color: var(--text-light); font-size: 12px;">✕ Закрыть</button>
            `;
        }
        
        const calculations = JSON.parse(localStorage.getItem('deliveryCalculations')) || [];
        calculations.push({
            id: Date.now(),
            zone,
            zoneName,
            amount: amount || 0,
            price: finalPrice,
            isFree,
            date: new Date().toISOString()
        });
        localStorage.setItem('deliveryCalculations', JSON.stringify(calculations));
        
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

function closeResult() {
    const resultDiv = document.getElementById('calcResult');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
}

// ==================== УВЕДОМЛЕНИЯ ====================
function showNotification(message, type = 'info') {
    let container = document.querySelector('.notifications-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    const icons = { success: '✓', error: '✗', info: 'ℹ' };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || 'ℹ'}</span>
        <span class="notification-message">${escapeHtml(message)}</span>
        <button class="notification-close">✕</button>
    `;
    
    container.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Админ-панель
if (window.location.search.includes('admin=secret')) {
    window.location.href = 'admin.html';
}