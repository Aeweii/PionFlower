// Константы
const DELIVERY_PRICES = {
    center: 200,
    west: 300,
    east: 300,
    north: 300,
    south: 300,
    urban: 350,
    dzhalil: 500
};
const FREE_DELIVERY_THRESHOLD = 3000;

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentDeliveryZone = 'center';
let deliveryPrice = 200;

document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initMobileMenu();
    setupThemeToggle();
    setupProfileHeader();
    
    if (!isUserLoggedIn()) {
        showAuthModal();
        return;
    }
    
    loadUserProfile();
    setupTabs();
    setupCart();
    setupDeliveryCalculator();
    setupPhotoUpload();
    loadOrders();
    setupCartModal();
    updateCartCount();
     setupLogoutButton();
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

// ==================== ТЕМА ====================
function setupThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
    
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        
        // Сохраняем выбор
        if (document.body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
}
// ==================== ПРОФИЛЬ В ШАПКЕ ====================
function setupProfileHeader() {
    const profileSection = document.getElementById('profileSection');
    if (!profileSection) return;
    
    const isLoggedIn = isUserLoggedIn();
    const userName = localStorage.getItem('userName') || '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    if (isLoggedIn && userName) {
        profileSection.innerHTML = `
            <div class="profile-menu">
                <div class="profile-avatar">${userName[0].toUpperCase()}</div>
                <div class="profile-dropdown">
                    <a href="profile.html" class="dropdown-item">Личный кабинет</a>
                    <a href="#" class="dropdown-item" id="headerFavoritesBtn">Избранное (${favorites.length})</a>
                    <a href="#" class="dropdown-item" id="headerCartBtn">Корзина (${cartCount})</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" id="logoutBtn">Выйти</a>
                </div>
            </div>
        `;
        
        const profileMenu = document.querySelector('.profile-menu');
        if (profileMenu) {
            profileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                profileMenu.classList.toggle('active');
            });
            
            document.addEventListener('click', () => {
                profileMenu.classList.remove('active');
            });
        }
        
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
        
        document.getElementById('headerCartBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    } else {
        profileSection.innerHTML = `
            <button class="login-btn" id="loginBtn">
                <i class="fas fa-user login-icon"></i>
            </button>
        `;
        
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            showAuthModal();
        });
    }
}

// ==================== ПРОВЕРКА АВТОРИЗАЦИИ ====================
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function logout() {
    localStorage.setItem('isLoggedIn', 'false');
    showNotification('Вы вышли из аккаунта', 'info');
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1500);
}

function showAuthModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('active');
}

// ==================== ЗАГРУЗКА ПРОФИЛЯ ====================
function loadUserProfile() {
    const userName = localStorage.getItem('userName') || '';
    const userPhone = localStorage.getItem('userPhone') || '+7 (XXX) XXX-XX-XX';
    
    document.getElementById('profileName').textContent = userName;
    document.getElementById('profilePhone').textContent = userPhone;
    
    const savedPhoto = localStorage.getItem('profilePhoto');
    const profilePhoto = document.getElementById('profilePhoto');
    if (savedPhoto) {
        profilePhoto.src = savedPhoto;
        profilePhoto.style.display = 'block';
    }
}

// ==================== ТАБЫ ====================
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
}

// ==================== КОРЗИНА ====================
function setupCart() {
    renderCart();
    
    const zoneSelect = document.getElementById('cartDeliveryZone');
    if (zoneSelect) {
        zoneSelect.addEventListener('change', (e) => {
            currentDeliveryZone = e.target.value;
            updateDeliveryPrice();
            updateTotalWithDelivery();
        });
    }
}

function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-image"></div>
                <p>Ваша корзина пуста</p>
                <a href="catalog.html" class="btn-catalog">Перейти в каталог</a>
            </div>
        `;
        updateCartSummary(0, 0);
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image || '/img/default-product.png'}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(145deg, #ffd9d1, #ffc5ba)';">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${escapeHtml(item.name)}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})"></button>
                </div>
            </div>
        </div>
    `).join('');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    updateCartSummary(totalItems, totalPrice);
    updateDeliveryPrice();
    updateTotalWithDelivery();
}

function updateCartSummary(totalItems, totalPrice) {
    document.getElementById('cartTotalItems').textContent = totalItems;
    document.getElementById('cartTotalPrice').textContent = `${totalPrice.toLocaleString()} ₽`;
}

function updateDeliveryPrice() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const basePrice = DELIVERY_PRICES[currentDeliveryZone] || 300;
    
    if (totalPrice >= FREE_DELIVERY_THRESHOLD) {
        deliveryPrice = 0;
        document.getElementById('deliveryCostDisplay').textContent = '0 ₽ (бесплатно)';
        document.getElementById('freeDeliveryNote').style.display = 'block';
        document.getElementById('needMoreNote').style.display = 'none';
    } else {
        deliveryPrice = basePrice;
        document.getElementById('deliveryCostDisplay').textContent = `${deliveryPrice} ₽`;
        document.getElementById('freeDeliveryNote').style.display = 'none';
        
        const needMore = FREE_DELIVERY_THRESHOLD - totalPrice;
        document.getElementById('needMoreAmount').textContent = needMore;
        document.getElementById('needMoreNote').style.display = 'block';
    }
}

function updateTotalWithDelivery() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = totalPrice + deliveryPrice;
    document.getElementById('cartTotalWithDelivery').textContent = `${finalTotal.toLocaleString()} ₽`;
}

window.updateQuantity = function(productId, newQuantity) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
            updateCartModal();
        }
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
    updateCartModal();
    showNotification('Товар удален из корзины', 'info');
};

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// ==================== МОДАЛЬНАЯ КОРЗИНА ====================
function setupCartModal() {
    const cartIcon = document.getElementById('cartIcon');
    const closeCart = document.getElementById('closeCartBtn');
    const continueBtn = document.getElementById('continueShoppingBtn');
    const checkoutBtn = document.getElementById('modalCheckoutBtn');
    const deliverySelect = document.getElementById('cartDeliveryZoneSelect');
    const modal = document.getElementById('cartModal');
    
    cartIcon?.addEventListener('click', openCartModal);
    closeCart?.addEventListener('click', closeCartModal);
    continueBtn?.addEventListener('click', closeCartModal);
    checkoutBtn?.addEventListener('click', () => checkout());
    deliverySelect?.addEventListener('change', updateCartModal);
    
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeCartModal();
    });
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        updateCartModal();
        modal.classList.add('active');
    }
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.classList.remove('active');
}

function updateCartModal() {
    const itemsList = document.getElementById('cartItemsList');
    if (!itemsList) return;
    
    if (cart.length === 0) {
        itemsList.innerHTML = `
            <div class="empty-cart-message" style="text-align:center; padding:40px 20px;">
                <i class="fas fa-shopping-basket" style="font-size:64px; color:var(--text-light);"></i>
                <p>Ваша корзина пуста</p>
                <a href="catalog.html" class="btn-catalog" style="display:inline-block; margin-top:16px;">Перейти в каталог</a>
            </div>
        `;
        document.getElementById('cartModalSubtotal').textContent = '0 ₽';
        document.getElementById('cartModalTotalItems').textContent = '0';
        document.getElementById('cartModalDelivery').textContent = '0 ₽';
        document.getElementById('cartModalTotal').textContent = '0 ₽';
        return;
    }
    
    itemsList.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image || './media/img/default.jpg'}" alt="${item.name}" onerror="this.src='./media/img/default.jpg'">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${escapeHtml(item.name)}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn modal-qty-btn" data-id="${item.id}" data-action="decr">-</button>
                    <span class="item-quantity">${item.quantity || 1}</span>
                    <button class="quantity-btn modal-qty-btn" data-id="${item.id}" data-action="incr">+</button>
                    <button class="remove-item modal-remove-btn" data-id="${item.id}">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Привязываем события
    document.querySelectorAll('.modal-qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (!item) return;
            
            if (btn.dataset.action === 'incr') {
                item.quantity++;
            } else if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(i => i.id !== id);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartModal();
            renderCart();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.modal-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            cart = cart.filter(i => i.id !== parseInt(btn.dataset.id));
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartModal();
            renderCart();
            updateCartCount();
            showNotification('Товар удален из корзины', 'info');
        });
    });
    
    // Обновляем суммы
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const deliverySelect = document.getElementById('cartDeliveryZoneSelect');
    let deliveryPriceVal = deliverySelect ? DELIVERY_PRICES[deliverySelect.value] || 0 : 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) deliveryPriceVal = 0;
    const total = subtotal + deliveryPriceVal;
    const needMore = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : FREE_DELIVERY_THRESHOLD - subtotal;
    
    document.getElementById('cartModalSubtotal').textContent = `${subtotal.toLocaleString()} ₽`;
    document.getElementById('cartModalTotalItems').textContent = totalItems;
    document.getElementById('cartModalDelivery').textContent = `${deliveryPriceVal.toLocaleString()} ₽`;
    document.getElementById('cartModalTotal').textContent = `${total.toLocaleString()} ₽`;
    document.getElementById('cartModalNeedMore').textContent = needMore;
    
    const freeNote = document.getElementById('cartModalFreeNote');
    if (freeNote) {
        if (subtotal >= FREE_DELIVERY_THRESHOLD) {
            freeNote.innerHTML = '<i class="fas fa-check-circle"></i> Бесплатная доставка!';
            freeNote.style.background = '#c8e6c9';
        } else {
            freeNote.innerHTML = `<i class="fas fa-truck"></i> Добавьте товаров на ${needMore.toLocaleString()} ₽ для бесплатной доставки`;
            freeNote.style.background = '#e8f5e9';
        }
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    if (!isUserLoggedIn()) {
        closeCartModal();
        showAuthModal();
        showNotification('Войдите в аккаунт для оформления заказа', 'info');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const deliverySelect = document.getElementById('cartDeliveryZoneSelect');
    let deliveryPriceVal = deliverySelect ? DELIVERY_PRICES[deliverySelect.value] || 0 : 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) deliveryPriceVal = 0;
    const finalTotal = subtotal + deliveryPriceVal;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        subtotal: subtotal,
        delivery: deliveryPriceVal,
        total: finalTotal,
        zone: deliverySelect?.value || 'center'
    };
    
    orders.unshift(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    renderCart();
    updateCartModal();
    loadOrders();
    closeCartModal();
    
    showNotification(`Заказ оформлен на сумму ${finalTotal.toLocaleString()} ₽!`, 'success');
}

// ==================== КАЛЬКУЛЯТОР ДОСТАВКИ ====================
function setupDeliveryCalculator() {
    const form = document.getElementById('deliveryForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const zone = document.getElementById('deliveryZone').value;
        const amount = parseFloat(document.getElementById('orderAmount').value);
        const resultDiv = document.getElementById('calcResult');
        
        if (!zone) {
            showNotification('Выберите район доставки', 'error');
            return;
        }
        
        const zoneNames = {
            center: 'Центр',
            west: 'Западный',
            east: 'Восточный',
            north: 'Северный',
            south: 'Южный',
            urban: 'Городок нефтяников',
            dzhalil: 'пгт Джалиль'
        };
        
        let price = DELIVERY_PRICES[zone];
        let zoneName = zoneNames[zone];
        let isFree = amount && amount >= FREE_DELIVERY_THRESHOLD;
        
        if (isFree) price = 0;
        
        resultDiv.style.display = 'block';
        
        if (isFree) {
            resultDiv.innerHTML = `
                <div>Бесплатная доставка!</div>
                <div class="price free">0 ₽</div>
                <div class="note">Район: ${zoneName}</div>
                <div class="note">При заказе от ${FREE_DELIVERY_THRESHOLD.toLocaleString()} ₽</div>
                <button onclick="closeResult()" style="margin-top:12px; background:none; border:none; color:var(--text-light); cursor:pointer;">✕ Закрыть</button>
            `;
        } else {
            resultDiv.innerHTML = `
                <div>Стоимость доставки</div>
                <div class="price">${price} ₽</div>
                <div class="note">Район: ${zoneName}</div>
                ${amount && amount > 0 && amount < FREE_DELIVERY_THRESHOLD ? '<div class="note">До бесплатной доставки не хватает ' + (FREE_DELIVERY_THRESHOLD - amount) + ' ₽</div>' : ''}
                <button onclick="closeResult()" style="margin-top:12px; background:none; border:none; color:var(--text-light); cursor:pointer;">✕ Закрыть</button>
            `;
        }
    });
}

window.closeResult = function() {
    const resultDiv = document.getElementById('calcResult');
    if (resultDiv) resultDiv.style.display = 'none';
};

// ==================== ФОТО ПРОФИЛЯ ====================
function setupPhotoUpload() {
    const changeBtn = document.getElementById('changePhotoBtn');
    const profilePhoto = document.getElementById('profilePhoto');
    
    if (changeBtn) {
        changeBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        profilePhoto.src = event.target.result;
                        profilePhoto.style.display = 'block';
                        localStorage.setItem('profilePhoto', event.target.result);
                        showNotification('Фото профиля обновлено!', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            };
            
            input.click();
        });
    }
}

// ==================== ЗАКАЗЫ ====================
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersContainer = document.getElementById('ordersList');
    
    if (!ordersContainer) return;
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <div class="empty-image"></div>
                <p>У вас пока нет заказов</p>
                <a href="catalog.html" class="btn-catalog">Перейти в каталог</a>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">Заказ №${order.id}</span>
                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div class="order-items">${order.items.map(i => `${escapeHtml(i.name)} x${i.quantity}`).join(', ')}</div>
            <div class="order-total">${order.total.toLocaleString()} ₽</div>
        </div>
    `).join('');
}

// ==================== МОДАЛКА ВХОДА ====================
function setupLoginModal() {
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('loginFormModal');
    
    closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('loginName')?.value.trim();
        const phone = document.getElementById('loginPhone')?.value.trim();
        
        if (name && phone) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', name);
            localStorage.setItem('userPhone', phone);
            showNotification(`Добро пожаловать, ${name}!`, 'success');
            modal.classList.remove('active');
            loadUserProfile();
            setupProfileHeader();
        } else {
            showNotification('Заполните все поля', 'error');
        }
    });
}

// Вызываем настройку модалки
setupLoginModal();

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

// ==================== КНОПКА ВЫХОДА ====================
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtnHeader');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Функция выхода
function logout() {
    localStorage.setItem('isLoggedIn', 'false');
    showNotification('Вы вышли из аккаунта', 'info');
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1500);
}

// Админ-панель
if (window.location.search.includes('admin=secret')) {
    window.location.href = 'admin.html';
}