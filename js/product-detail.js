

// Константы доставки
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

// Данные о товаре
const productsData = {
    1: {
        id: 1,
        name: 'Нежность пионов',
        price: 2900,
        description: 'Изысканный букет из нежных пионов, который станет идеальным подарком для любого случая. Пионы символизируют любовь, счастье и процветание.',
        composition: ['Розовые пионы', 'Гипсофила'],
        badge: 'Хит продаж',
        image: './media/img/pion.jpeg',
        category: 'author'
    },
    2: {
        id: 2,
        name: 'Мятный эвкалипт',
        price: 2400,
        description: 'Стильная композиция с эвкалиптом и полевыми цветами. Идеально подходит для тех, кто ценит натуральную красоту и свежесть.',
        composition: ['Эвкалипт', 'Белые розы', 'Гортензии', 'Рускус'],
        badge: '',
        image: './media/img/mint.jpg',
        category: 'author'
    },
    3: {
        id: 3,
        name: 'Розовое облако',
        price: 3200,
        description: 'Нежный и романтичный букет из роз и альстромерий. Прекрасный выбор для признания в чувствах или подарка любимой.',
        composition: ['Розовые розы', 'Гипсофила'],
        badge: 'Свадебный',
        image: './media/img/pink.jpg',
        category: 'wedding'
    },
    4: {
        id: 4,
        name: 'Лавандовый сон',
        price: 2700,
        description: 'Ароматный букет с лавандой и сухоцветами. Долго сохраняет свежий вид и нежный аромат.',
        composition: ['Лаванда', 'Розовые пионы', 'Белые пионы'],
        badge: '',
        image: './media/img/violet.jpg',
        category: 'author'
    },
    5: {
        id: 5,
        name: 'Корпоративный стиль',
        price: 3500,
        description: 'Элегантный букет для офиса или деловой встречи. Строгая композиция в сдержанных тонах.',
        composition: ['Розовые розы', 'Гортензии', 'Кустиковые розы'],
        badge: 'Популярный',
        image: './media/img/business.jpg',
        category: 'corporate'
    },
    6: {
        id: 6,
        name: 'Алые розы',
        price: 4100,
        description: 'Классический букет из 15 алых роз премиум-класса. Символ страсти и любви.',
        composition: ['Алые розы'],
        badge: 'Премиум',
        image: './media/img/red.jpg',
        category: 'mono'
    },
    7: {
        id: 7,
        name: 'Свадебная нежность',
        price: 3800,
        description: 'Идеальный букет невесты в пастельных тонах. Легкий, воздушный и очень нежный.',
        composition: ['Пионовидные розы', 'Эустомы', 'Эвкалипт'],
        badge: 'Свадебный',
        image: './media/img/wedding.jpg',
        category: 'wedding'
    },
    8: {
        id: 8,
        name: 'Полевые цветы',
        price: 1900,
        description: 'Букет в стиле рустик из полевых цветов. Простота и естественная красота.',
        composition: ['Васильки', 'Колокольчики', 'Розы', 'Орхидеи', 'Ранункулюсы', 'Космея'],
        badge: '',
        image: './media/img/field.jpg',
        category: 'author'
    },
    9: {
        id: 9,
        name: 'Бизнес-букет',
        price: 4200,
        description: 'Строгая и статусная композиция для деловых партнеров. Впечатляет своим стилем.',
        composition: ['Розовые гвоздики', 'Эустомы', 'Эвкалипт'],
        badge: '',
        image: './media/img/bisiness2.jpg',
        category: 'corporate'
    },
    10: {
        id: 10,
        name: 'Тюльпаны',
        price: 2100,
        description: 'Яркий весенний букет из 25 разноцветных тюльпанов. Поднимает настроение!',
        composition: ['Тюльпаны'],
        badge: 'Сезон',
        image: './media/img/tulips.jpg',
        category: 'mono'
    },
    11: {
        id: 11,
        name: 'Пионовидные розы',
        price: 3300,
        description: 'Нежные пионовидные розы в элегантной упаковке. Выглядят роскошно и изысканно.',
        composition: ['Пионовидные розы', 'Эвкалипт'],
        badge: 'Новинка',
        image: './media/img/pionrose.jpg',
        category: 'author'
    },
    12: {
        id: 12,
        name: 'Хризантемы',
        price: 2500,
        description: 'Яркий букет из кустовых хризантем. Долго стоит и радует своей красотой.',
        composition: ['Хризантемы', 'Эвкалипт'],
        badge: '',
        image: './media/img/chrysanthemums.jpg',
        category: 'mono'
    }
};

// Получаем ID товара из URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Состояние
let currentProduct = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let reviews = JSON.parse(localStorage.getItem('productReviews')) || {};

document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    setupThemeToggle();
    setupProfile();
    setupLoginModal();
    setupCartModal();
    setupCartEvents();
    
    const productId = getProductIdFromUrl();
    if (productId && productsData[productId]) {
        currentProduct = productsData[productId];
        renderProductDetail();
        setupProductActions();
        renderReviews();
        setupReviewForm();
    } else {
        document.getElementById('productDetail').innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2>Товар не найден</h2>
                <p>К сожалению, запрошенный букет отсутствует в каталоге.</p>
                <a href="catalog.html" style="color: var(--accent-rose);">Вернуться в каталог</a>
            </div>
        `;
    }
    
    setupQuickOrderModal();
    updateCartCount();
});

// ==================== БУРГЕР-МЕНЮ ====================
function initBurgerMenu() {
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

// ==================== МОДАЛЬНОЕ ОКНО ВХОДА ====================
function setupLoginModal() {
    const modal = document.getElementById("loginModal");
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
            updateCartCount();
        } else {
            showNotification("Заполните все поля", "error");
        }
    });
}

// ==================== ПРОФИЛЬ ====================
function setupProfile() {
    const section = document.getElementById("profileSection");
    if (!section) return;
    
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userName = localStorage.getItem("userName") || "";
    const userPhone = localStorage.getItem("userPhone") || "";
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
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
                    <div class="dropdown-item" id="profileFavoritesBtn">
                        <i class="fas fa-heart"></i>
                        <span>Избранное (${favorites.length})</span>
                    </div>
                    <div class="dropdown-item" id="profileCartBtn">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Корзина (${cartCount})</span>
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
        
        document.getElementById("profileFavoritesBtn")?.addEventListener("click", () => {
            window.location.href = "favorites.html";
        });
        
        document.getElementById("profileCartBtn")?.addEventListener("click", () => {
            openCartModal();
        });
    } else {
        // Просто кнопка "Войти" без лишнего шарика
        section.innerHTML = `<button class="login-btn-header" id="loginBtn"><i class="fas fa-user"></i> Войти</button>`;
        document.getElementById("loginBtn")?.addEventListener("click", () => {
            document.getElementById("loginModal")?.classList.add("active");
        });
    }
}

// ==================== МОДАЛЬНОЕ ОКНО ВХОДА/РЕГИСТРАЦИИ ====================
function setupLoginModal() {
    const modal = document.getElementById("loginModal");
    if (!modal) return;
    
    const closeBtn = modal.querySelector(".modal-close");
    const registerLink = document.getElementById("registerLink");
    const loginForm = document.getElementById("loginFormModal");
    const registerForm = document.getElementById("registerFormModal");
    
    // Переключение между формами
    if (registerLink) {
        registerLink.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("loginFormContainer").style.display = "none";
            document.getElementById("registerFormContainer").style.display = "block";
        });
    }
    
    const switchToLogin = document.getElementById("switchToLogin");
    if (switchToLogin) {
        switchToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("loginFormContainer").style.display = "block";
            document.getElementById("registerFormContainer").style.display = "none";
        });
    }
    
    closeBtn?.addEventListener("click", () => modal.classList.remove("active"));
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });
    
    // Вход существующего пользователя
    loginForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("loginName")?.value.trim();
        const phone = document.getElementById("loginPhone")?.value.trim();
        
        if (!name || !phone) {
            showNotification("Заполните все поля", "error");
            return;
        }
        
        // Проверяем, зарегистрирован ли пользователь
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.name === name && u.phone === phone);
        
        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userPhone", user.phone);
            showNotification(`Добро пожаловать, ${name}!`, "success");
            modal.classList.remove("active");
            setupProfile();
            updateCartCount();
            loginForm.reset();
        } else {
            showNotification("Пользователь не найден. Зарегистрируйтесь.", "error");
        }
    });
    
    // Регистрация нового пользователя
    registerForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("regName")?.value.trim();
        const phone = document.getElementById("regPhone")?.value.trim();
        const email = document.getElementById("regEmail")?.value.trim();
        
        if (!name || !phone) {
            showNotification("Заполните имя и телефон", "error");
            return;
        }
        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        
        // Проверяем, не занят ли телефон
        if (users.some(u => u.phone === phone)) {
            showNotification("Этот телефон уже зарегистрирован", "error");
            return;
        }
        
        // Регистрируем нового пользователя
        const newUser = { name, phone, email, registeredAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        
        // Автоматически входим
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", name);
        localStorage.setItem("userPhone", phone);
        
        showNotification(`Регистрация успешна! Добро пожаловать, ${name}!`, "success");
        modal.classList.remove("active");
        setupProfile();
        updateCartCount();
        registerForm.reset();
        
        // Сбрасываем на форму входа
        document.getElementById("loginFormContainer").style.display = "block";
        document.getElementById("registerFormContainer").style.display = "none";
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
    setupProfile(); // Обновляем профиль для обновления счетчика
}

function showCartNotification() {
    const notification = document.getElementById("cartNotification");
    if (notification) {
        notification.classList.add("show");
        setTimeout(() => notification.classList.remove("show"), 2000);
    }
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

function displayCart() {
    const cartItemsList = document.getElementById("cartItemsList");
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-basket"></i>
                <p>Ваша корзина пуста</p>
                <button class="btn btn-primary" onclick="closeCartModal()">Продолжить покупки</button>
            </div>
        `;
        updateCartSummary();
        return;
    }
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image || './media/img/default.jpg'}" alt="${item.name}" onerror="this.src='./media/img/default.jpg'">
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
    
    attachCartItemEvents();
    updateCartSummary();
}

function attachCartItemEvents() {
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
            setupProfile();
        });
    });
    
    document.querySelectorAll(".cart-remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            cart = cart.filter(i => i.id !== parseInt(btn.dataset.id));
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartCount();
            setupProfile();
            showNotification("Товар удален из корзины", "info");
        });
    });
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
    setupProfile();
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

function setupCartEvents() {
    // Инициализация (дополнительные события при необходимости)
    updateCartSummary();
}

// ==================== ОТРИСОВКА ТОВАРА ====================
function renderProductDetail() {
    if (!currentProduct) return;
    
    const isFavorite = favorites.includes(currentProduct.id);
    const hasImage = currentProduct.image && currentProduct.image !== '';
    
    const html = `
        <div class="product-image" style="${hasImage ? 'background: none;' : ''}">
            ${hasImage ? `<img src="${currentProduct.image}" alt="${currentProduct.name}" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(145deg, #ffd9d1, #ffc5ba)'">` : ''}
            ${currentProduct.badge ? `<span class="product-badge">${currentProduct.badge}</span>` : ''}
            <button class="favorite-corner-btn ${isFavorite ? 'active' : ''}" id="favoriteCornerBtn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <h1 class="product-title">${escapeHtml(currentProduct.name)}</h1>
            <div class="product-price">${currentProduct.price.toLocaleString()} ₽</div>
            <div class="product-description">${escapeHtml(currentProduct.description)}</div>
            
            <div class="product-composition">
                <div class="composition-title">Состав букета:</div>
                <ul class="composition-list">
                    ${currentProduct.composition.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
            </div>
            
            <div class="product-actions">
                <button class="btn btn-primary" id="addToCartBtn">В корзину</button>
                <button class="btn btn-outline" id="quickOrderBtn">Купить в 1 клик</button>
            </div>
        </div>
    `;
    
    document.getElementById('productDetail').innerHTML = html;
}

function setupProductActions() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const quickOrderBtn = document.getElementById('quickOrderBtn');
    const favoriteBtn = document.getElementById('favoriteCornerBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => addToCart(currentProduct));
    }
    
    if (quickOrderBtn) {
        quickOrderBtn.addEventListener('click', () => openQuickOrderModal());
    }
    
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite();
        });
    }
}

// ==================== ИЗБРАННОЕ (fa-heart) ====================
function toggleFavorite() {
    const btn = document.getElementById('favoriteCornerBtn');
    if (!btn || !currentProduct) return;
    
    const icon = btn.querySelector('i');
    const index = favorites.indexOf(currentProduct.id);
    
    if (index === -1) {
        favorites.push(currentProduct.id);
        btn.classList.add('active');
        if (icon) {
            icon.style.color = '#ff4d4d';
        }
        showNotification('Добавлено в избранное', 'success');
    } else {
        favorites.splice(index, 1);
        btn.classList.remove('active');
        if (icon) {
            icon.style.color = '';
        }
        showNotification('Удалено из избранного', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setupProfile(); // Обновляем профиль для обновления счетчика
}

// ==================== ОТЗЫВЫ ====================
function renderReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList || !currentProduct) return;
    
    const productReviews = reviews[currentProduct.id] || [];
    
    if (productReviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="empty-reviews">
                <i class="fas fa-comment-dots"></i>
                <p>Пока нет отзывов. Будьте первым, кто оценит этот букет!</p>
            </div>
        `;
        return;
    }
    
    reviewsList.innerHTML = productReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">
                    ${escapeHtml(review.name[0].toUpperCase())}
                </div>
                <div class="review-info">
                    <div class="review-name">${escapeHtml(review.name)}</div>
                    <div class="review-date">${formatDate(review.date)}</div>
                </div>
            </div>
            <div class="review-rating">
                ${renderStars(review.rating)}
            </div>
            <div class="review-text">"${escapeHtml(review.text)}"</div>
        </div>
    `).join('');
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'сегодня';
    if (diff === 1) return 'вчера';
    if (diff < 7) return `${diff} дня назад`;
    return date.toLocaleDateString('ru-RU');
}

function setupReviewForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;
    
    // Звездочки для ввода
    const starsContainer = document.getElementById('ratingStarsInput');
    const ratingInput = document.getElementById('reviewRating');
    
    if (starsContainer && ratingInput) {
        const stars = starsContainer.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                ratingInput.value = rating;
                
                stars.forEach(s => {
                    if (parseInt(s.dataset.rating) <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                        s.style.color = '#ffb800';
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                        s.style.color = '#ddd';
                    }
                });
            });
            
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                stars.forEach(s => {
                    if (parseInt(s.dataset.rating) <= rating) {
                        s.style.color = '#ffb800';
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            });
            
            star.addEventListener('mouseleave', () => {
                const currentRating = parseInt(ratingInput.value) || 5;
                stars.forEach(s => {
                    if (parseInt(s.dataset.rating) <= currentRating) {
                        s.style.color = '#ffb800';
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            });
        });
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reviewName')?.value.trim();
        const rating = parseInt(document.getElementById('reviewRating')?.value || 5);
        const text = document.getElementById('reviewText')?.value.trim();
        
        if (!name) {
            showNotification('Введите ваше имя', 'error');
            return;
        }
        
        if (!text) {
            showNotification('Введите текст отзыва', 'error');
            return;
        }
        
        const newReview = {
            id: Date.now(),
            name: name,
            rating: rating,
            text: text,
            date: new Date().toISOString()
        };
        
        if (!reviews[currentProduct.id]) {
            reviews[currentProduct.id] = [];
        }
        
        reviews[currentProduct.id].unshift(newReview);
        localStorage.setItem('productReviews', JSON.stringify(reviews));
        
        form.reset();
        if (ratingInput) ratingInput.value = '5';
        
        // Сброс звездочек
        if (starsContainer) {
            const stars = starsContainer.querySelectorAll('i');
            stars.forEach((star, index) => {
                if (index < 5) {
                    star.classList.remove('fas');
                    star.classList.add('far');
                    star.style.color = '#ddd';
                }
            });
        }
        
        renderReviews();
        showNotification('Спасибо за ваш отзыв!', 'success');
    });
}

// ==================== БЫСТРЫЙ ЗАКАЗ ====================
function setupQuickOrderModal() {
    const modal = document.getElementById('quickOrderModal');
    if (!modal) return;
    
    const closeBtn = document.getElementById('closeModalBtn');
    const form = document.getElementById('quickOrderForm');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('quickName').value.trim();
            const phone = document.getElementById('quickPhone').value.trim();
            const address = document.getElementById('quickAddress').value.trim();
            
            if (!name || !phone) {
                showNotification('Пожалуйста, заполните имя и телефон', 'error');
                return;
            }
            
            const quickOrders = JSON.parse(localStorage.getItem('quickOrders')) || [];
            quickOrders.push({
                id: Date.now(),
                product: currentProduct,
                name,
                phone,
                address,
                date: new Date().toISOString()
            });
            localStorage.setItem('quickOrders', JSON.stringify(quickOrders));
            
            showNotification(`Спасибо, ${name}! Мы свяжемся с вами для подтверждения заказа`, 'success');
            modal.classList.remove('active');
            form.reset();
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function openQuickOrderModal() {
    const modal = document.getElementById('quickOrderModal');
    if (modal) {
        modal.classList.add('active');
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
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ ====================
function addAnimationStyles() {
    if (!document.querySelector('#productDetailStyles')) {
        const style = document.createElement('style');
        style.id = 'productDetailStyles';
        style.textContent = `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .cart-notification {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 1001;
                transform: translateX(150%);
                transition: transform 0.3s ease;
            }
            .cart-notification.show {
                transform: translateX(0);
            }
            .cart-notification-content {
                background: #4caf50;
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            .empty-reviews {
                text-align: center;
                padding: 60px 20px;
                background: white;
                border-radius: 20px;
                border: 1px solid var(--border-rose);
                color: var(--text-light);
            }
            .empty-reviews i {
                font-size: 48px;
                margin-bottom: 16px;
                color: var(--text-light);
            }
            .favorite-corner-btn i {
                font-size: 24px;
                color: #fba8a8;
                transition: color 0.2s ease;
            }
            .favorite-corner-btn.active i {
                color: #ff4d4d;
            }
            .favorite-corner-btn:hover {
                transform: scale(1.05);
            }
            .favorite-corner-btn:active {
                transform: scale(0.92);
            }
            .empty-cart-message {
                text-align: center;
                padding: 40px 20px;
            }
            .empty-cart-message i {
                font-size: 64px;
                color: var(--text-light);
                margin-bottom: 16px;
            }
            .cart-summary {
                margin-top: 20px;
            }
            .cart-item {
                display: flex;
                gap: 15px;
                padding: 15px 0;
                border-bottom: 1px solid var(--border-rose);
            }
            .cart-item-image {
                width: 70px;
                height: 70px;
                background: var(--primary-rose);
                border-radius: 12px;
                overflow: hidden;
                flex-shrink: 0;
            }
            .cart-item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .cart-item-details {
                flex: 1;
            }
            .cart-item-name {
                font-weight: 600;
                color: var(--text-dark);
                margin-bottom: 5px;
                font-size: 15px;
            }
            .cart-item-price {
                color: var(--accent-rose);
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .cart-item-actions {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .cart-quantity-btn {
                width: 28px;
                height: 28px;
                background: var(--primary-rose);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                transition: 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cart-quantity-btn:hover {
                background: var(--accent-rose);
                color: white;
            }
            .cart-item-quantity {
                font-size: 14px;
                font-weight: 500;
                min-width: 30px;
                text-align: center;
            }
            .cart-remove-btn {
                background: none;
                border: none;
                color: var(--text-light);
                cursor: pointer;
                font-size: 16px;
                margin-left: auto;
                transition: 0.2s;
                padding: 5px;
            }
            .cart-remove-btn:hover {
                color: #f44336;
            }
            .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                font-size: 15px;
            }
            .total-row {
                font-size: 18px;
                font-weight: 700;
                color: var(--text-dark);
                border-top: 2px solid var(--border-rose);
                margin-top: 8px;
                padding-top: 15px;
            }
            .delivery-row {
                border-bottom: 1px dashed var(--border-rose);
                margin-bottom: 8px;
                padding-bottom: 12px;
            }
            .delivery-selector {
                margin: 16px 0;
            }
            .delivery-selector label {
                font-size: 13px;
                color: var(--text-light);
                display: block;
                margin-bottom: 8px;
            }
            .delivery-select {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid var(--border-rose);
                border-radius: 30px;
                font-family: var(--font-roboto);
                font-size: 14px;
                background: white;
                cursor: pointer;
            }
            .free-delivery-note {
                background: #e8f5e9;
                color: #2e7d32;
                padding: 12px 15px;
                border-radius: 12px;
                font-size: 13px;
                margin: 16px 0;
                text-align: center;
            }
            .free-delivery-note i {
                margin-right: 8px;
            }
            .checkout-btn {
                width: 100%;
                padding: 14px;
                background: var(--accent-rose);
                color: white;
                border: none;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: 0.2s;
                margin-bottom: 12px;
            }
            .checkout-btn:hover {
                background: #f59292;
                transform: translateY(-2px);
            }
            .continue-shopping-btn {
                width: 100%;
                padding: 12px;
                background: transparent;
                color: var(--text-light);
                border: 1px solid var(--border-rose);
                border-radius: 30px;
                font-size: 14px;
                cursor: pointer;
                transition: 0.2s;
            }
            .continue-shopping-btn:hover {
                background: var(--primary-rose);
                border-color: var(--accent-rose);
            }
            body.dark-theme .empty-reviews {
                background: var(--bg-card);
            }
            body.dark-theme .empty-reviews i {
                color: var(--text-light);
            }
            body.dark-theme .review-card {
                background: var(--bg-card);
            }
            body.dark-theme .review-form-container {
                background: var(--bg-card);
            }
            body.dark-theme .stars-input i {
                color: #555;
            }
            body.dark-theme .stars-input i.active,
            body.dark-theme .stars-input i:hover {
                color: #ffb800;
            }
            body.dark-theme .cart-summary {
                background: var(--bg-card);
            }
            body.dark-theme .delivery-select {
                background: var(--bg-main);
                color: var(--text-dark);
            }
        `;
        document.head.appendChild(style);
    }
}

addAnimationStyles();

// Админ-панель
if (window.location.search.includes('admin=secret')) {
    window.location.href = 'admin.html';
}