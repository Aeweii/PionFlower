// ==================== profile.js ====================
// Скрипт для страницы личного кабинета

document.addEventListener('DOMContentLoaded', () => {
    // Проверяем авторизацию
    if (!isUserLoggedIn()) {
        // Если не авторизован - показываем модалку входа
        showAuthModal();
        return;
    }
    
    // Если авторизован - загружаем данные
    loadUserProfile();
    setupMobileMenu();  // Должен быть вызван первым
    setupTabs();
    setupCart();
    setupDeliveryCalculator();
    setupPhotoUpload();
    loadOrders();
    
    // Обновляем отображение профиля в шапке
    updateProfileDisplay();
});

// Проверка авторизации
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Загрузка данных пользователя
function loadUserProfile() {
    const userName = localStorage.getItem('userName') || '';
    const userPhone = localStorage.getItem('userPhone') || '+7 (XXX) XXX-XX-XX';
    
    document.getElementById('profileName').textContent = userName;
    document.getElementById('profilePhone').textContent = userPhone;
    
    // Загружаем фото профиля
    const savedPhoto = localStorage.getItem('profilePhoto');
    const profilePhoto = document.getElementById('profilePhoto');
    if (savedPhoto) {
        profilePhoto.src = savedPhoto;
        profilePhoto.style.display = 'block';
    }
}

// ==================== МОБИЛЬНОЕ МЕНЮ (ИСПРАВЛЕНО) ====================
function setupMobileMenu() {
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    console.log('setupMobileMenu вызван', burger, mobileMenu); // Для отладки
    
    if (burger && mobileMenu) {
        // Убираем старые обработчики, чтобы не было дублирования
        const newBurger = burger.cloneNode(true);
        burger.parentNode.replaceChild(newBurger, burger);
        const newMobileMenu = mobileMenu.cloneNode(true);
        mobileMenu.parentNode.replaceChild(newMobileMenu, mobileMenu);
        
        const freshBurger = document.getElementById('burger');
        const freshMobileMenu = document.getElementById('mobileMenu');
        
        // Открытие/закрытие меню
        freshBurger.addEventListener('click', (e) => {
            e.stopPropagation();
            freshBurger.classList.toggle('active');
            freshMobileMenu.classList.toggle('active');
            
            if (freshMobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие при клике на ссылки
        freshMobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                freshBurger.classList.remove('active');
                freshMobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', (e) => {
            if (freshMobileMenu.classList.contains('active') && 
                !freshBurger.contains(e.target) && 
                !freshMobileMenu.contains(e.target)) {
                freshBurger.classList.remove('active');
                freshMobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие при свайпе влево на мобильных
        let touchStartX = 0;
        freshMobileMenu.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        freshMobileMenu.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchEndX - touchStartX > 50) {
                freshBurger.classList.remove('active');
                freshMobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        console.error('Burger или mobileMenu не найдены');
    }
}

// ==================== ОБНОВЛЕНИЕ ПРОФИЛЯ В ШАПКЕ ====================
function updateProfileDisplay() {
    const profileSection = document.getElementById('profileSection');
    if (!profileSection) return;
    
    const isLoggedIn = isUserLoggedIn();
    const userName = localStorage.getItem('userName') || '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    if (isLoggedIn && userName) {
        profileSection.innerHTML = `
            <div class="profile-menu">
                <div class="profile-avatar">${userName[0].toUpperCase()}</div>
                <div class="profile-dropdown">
                    <a href="profile.html" class="dropdown-item">Личный кабинет</a>
                    <a href="#" class="dropdown-item">Избранное (${favorites.length})</a>
                    <a href="#" class="dropdown-item">Корзина (${cartCount})</a>
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
    } else {
        profileSection.innerHTML = `
            <div class="login-btn" id="loginBtn">
                <span class="login-icon"></span>
            </div>
        `;
        
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            showAuthModal();
        });
    }
}

// Выход из аккаунта
function logout() {
    localStorage.setItem('isLoggedIn', 'false');
    showNotification('Вы вышли из аккаунта', 'info');
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1500);
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
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentDeliveryZone = 'center';
let deliveryPrice = 200;

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
                <img src="${item.image || '/img/default-product.png'}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(145deg, #ffd9d1, #ffc5ba)'; this.parentElement.innerHTML=''">
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
    
    const zonePrices = {
        center: 200,
        west: 300,
        east: 300,
        north: 300,
        south: 300,
        urban: 350,
        dzhalil: 500
    };
    
    const basePrice = zonePrices[currentDeliveryZone] || 300;
    
    if (totalPrice >= 3000) {
        deliveryPrice = 0;
        document.getElementById('deliveryCostDisplay').textContent = '0 ₽ (бесплатно)';
        document.getElementById('freeDeliveryNote').style.display = 'block';
        document.getElementById('needMoreNote').style.display = 'none';
    } else {
        deliveryPrice = basePrice;
        document.getElementById('deliveryCostDisplay').textContent = `${deliveryPrice} ₽`;
        document.getElementById('freeDeliveryNote').style.display = 'none';
        
        const needMore = 3000 - totalPrice;
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
        }
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    showNotification('Товар удален из корзины', 'info');
};

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
        
        const zonePrices = {
            center: { price: 200, name: 'Центр' },
            west: { price: 300, name: 'Западный' },
            east: { price: 300, name: 'Восточный' },
            north: { price: 300, name: 'Северный' },
            south: { price: 300, name: 'Южный' },
            urban: { price: 350, name: 'Городок нефтяников' },
            dzhalil: { price: 500, name: 'пгт Джалиль' }
        };
        
        let price = zonePrices[zone].price;
        let zoneName = zonePrices[zone].name;
        let isFree = false;
        
        if (amount && amount >= 3000) {
            isFree = true;
            price = 0;
        }
        
        resultDiv.style.display = 'block';
        
        if (isFree) {
            resultDiv.innerHTML = `
                <div>Бесплатная доставка!</div>
                <div class="price free">0 ₽</div>
                <div class="note">Район: ${zoneName}</div>
                <div class="note">При заказе от 3000 ₽</div>
                <button onclick="closeResult()" style="margin-top: 12px; background: none; border: none; color: var(--text-light);">✕ Закрыть</button>
            `;
        } else {
            resultDiv.innerHTML = `
                <div>Стоимость доставки</div>
                <div class="price">${price} ₽</div>
                <div class="note">Район: ${zoneName}</div>
                ${amount && amount > 0 && amount < 3000 ? '<div class="note">До бесплатной доставки не хватает ' + (3000 - amount) + ' ₽</div>' : ''}
                <button onclick="closeResult()" style="margin-top: 12px; background: none; border: none; color: var(--text-light);">✕ Закрыть</button>
            `;
        }
    });
}

window.closeResult = function() {
    const resultDiv = document.getElementById('calcResult');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
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
            <div class="order-items">${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>
            <div class="order-total">${order.total.toLocaleString()} ₽</div>
        </div>
    `).join('');
}

// ==================== ОФОРМЛЕНИЕ ЗАКАЗА ====================
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = totalPrice + deliveryPrice;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        subtotal: totalPrice,
        delivery: deliveryPrice,
        total: finalTotal,
        zone: currentDeliveryZone
    };
    
    orders.unshift(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    showNotification(`Заказ оформлен на сумму ${finalTotal.toLocaleString()} ₽!`, 'success');
    renderCart();
    loadOrders();
});

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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Добавляем стили для анимации, если их нет
function addMissingStyles() {
    if (!document.querySelector('#profileExtraStyles')) {
        const style = document.createElement('style');
        style.id = 'profileExtraStyles';
        style.textContent = `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .empty-cart, .empty-orders {
                text-align: center;
                padding: 40px 20px;
            }
            
            .empty-cart .empty-image,
            .empty-orders .empty-image {
                font-size: 64px;
                margin-bottom: 16px;
            }
            
            .btn-catalog {
                display: inline-block;
                background: #fba8a8;
                color: white;
                padding: 12px 24px;
                border-radius: 30px;
                text-decoration: none;
                margin-top: 16px;
            }
            
            .order-card {
                padding: 16px;
                border-bottom: 1px solid #ffd0cb;
            }
            
            .order-card:last-child {
                border-bottom: none;
            }
            
            .order-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
            }
            
            .order-number {
                font-weight: 500;
                color: #614949;
            }
            
            .order-date {
                font-size: 12px;
                color: #9e7a7a;
            }
            
            .order-items {
                font-size: 13px;
                color: #9e7a7a;
                margin-bottom: 12px;
            }
            
            .order-total {
                font-weight: 600;
                color: #fba8a8;
            }
        `;
        document.head.appendChild(style);
    }
}

// Вызываем добавление стилей
addMissingStyles();