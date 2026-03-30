// ==================== product-detail.js ====================
// Скрипт для страницы детального просмотра товара

// ⭐⭐⭐ НАСТРОЙКИ КНОПКИ ИЗБРАННОГО (СВОИ ФОТОГРАФИИ) ⭐⭐⭐
// Здесь вы указываете пути к своим фотографиям для кнопки избранного
const FAVORITE_IMAGES = {
    active: 'img/active.svg',    // Путь к фото когда добавлено в избранное
    inactive: 'img/defaut.svg'   // Путь к фото когда не в избранном
};

// Данные о товаре
const productsData = {
    1: {
        id: 1,
        name: 'Нежность пионов',
        price: 2900,
        description: 'Изысканный букет из нежных пионов, который станет идеальным подарком для любого случая. Пионы символизируют любовь, счастье и процветание.',
        composition: ['Розовые пионы'],
        badge: 'Хит продаж',
        image: 'img/pion.jpeg',
        category: 'author'
    },
    2: {
        id: 2,
        name: 'Мятный эвкалипт',
        price: 2400,
        description: 'Стильная композиция с эвкалиптом и полевыми цветами. Идеально подходит для тех, кто ценит натуральную красоту и свежесть.',
        composition: ['Эвкалипт', 'Белые розы', 'Гортензии', 'Рускус'],
        badge: '',
        image: 'img/mint.jpg',
        category: 'author'
    },
    3: {
        id: 3,
        name: 'Розовое облако',
        price: 3200,
        description: 'Нежный и романтичный букет из роз и альстромерий. Прекрасный выбор для признания в чувствах или подарка любимой.',
        composition: ['Розовые розы', 'Гипсофилы'],
        badge: 'Свадебный',
        image: 'img/pink.jpg',
        category: 'wedding'
    },
    4: {
        id: 4,
        name: 'Лавандовый сон',
        price: 2700,
        description: 'Ароматный букет с лавандой и сухоцветами. Долго сохраняет свежий вид и нежный аромат.',
        composition: ['Лаванда', 'Розовые пионы', 'Белые пионы '],
        badge: '',
        image: 'img/violet.jpg',
        category: 'author'
    },
    5: {
        id: 5,
        name: 'Корпоративный стиль',
        price: 3500,
        description: 'Элегантный букет для офиса или деловой встречи. Строгая композиция в сдержанных тонах.',
        composition: ['Розовые розы', 'Гортензии', 'Кустиковые розы'],
        badge: 'Популярный',
        image: 'img/business.jpg',
        category: 'corporate'
    },
    6: {
        id: 6,
        name: 'Алые розы',
        price: 4100,
        description: 'Классический букет из 15 алых роз премиум-класса. Символ страсти и любви.',
        composition: ['Алые розы'],
        badge: 'Премиум',
        image: 'img/red.jpg',
        category: 'mono'
    },
    7: {
        id: 7,
        name: 'Свадебная нежность',
        price: 3800,
        description: 'Идеальный букет невесты в пастельных тонах. Легкий, воздушный и очень нежный.',
        composition: ['Пионовидные розы', 'Эустомы', 'Эвкалипт'],
        badge: 'Свадебный',
        image: 'img/wedding.jpg',
        category: 'wedding'
    },
    8: {
        id: 8,
        name: 'Полевые цветы',
        price: 1900,
        description: 'Букет в стиле рустик из полевых цветов. Простота и естественная красота.',
        composition: ['Васильки', 'Колокольчики', 'Розы', 'Орхидеи', 'Ранункулюсы', 'Космея',],
        badge: '',
        image: 'img/field.jpg',
        category: 'author'
    },
    9: {
        id: 9,
        name: 'Бизнес-букет',
        price: 4200,
        description: 'Строгая и статусная композиция для деловых партнеров. Впечатляет своим стилем.',
        composition: ['Розовые гвоздики', 'Эустомы', 'Эвкалипт'],
        badge: '',
        image: 'img/bisiness2.jpg',
        category: 'corporate'
    },
    10: {
        id: 10,
        name: 'Тюльпаны',
        price: 2100,
        description: 'Яркий весенний букет из 25 разноцветных тюльпанов. Поднимает настроение!',
        composition: ['Тюльпаны'],
        badge: 'Сезон',
        image: 'img/tulips.jpg',
        category: 'mono'
    },
    11: {
        id: 11,
        name: 'Пионовидные розы',
        price: 3300,
        description: 'Нежные пионовидные розы в элегантной упаковке. Выглядят роскошно и изысканно.',
        composition: ['Пионовидные розы', 'Эвкалипт'],
        badge: 'Новинка',
        image: 'img/pionrose.jpg',
        category: 'author'
    },
    12: {
        id: 12,
        name: 'Хризантемы',
        price: 2500,
        description: 'Яркий букет из кустовых хризантем. Долго стоит и радует своей красотой.',
        composition: ['Хризантемы', 'Эвкалипт'],
        badge: '',
        image: 'img/chrysanthemums.jpg',
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

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupProfile();
    
    const productId = getProductIdFromUrl();
    if (productId && productsData[productId]) {
        currentProduct = productsData[productId];
        renderProductDetail();
        setupProductActions();
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
});

function renderProductDetail() {
    if (!currentProduct) return;
    
    const isFavorite = favorites.includes(currentProduct.id);
    const hasImage = currentProduct.image && currentProduct.image !== '';
    
    // ⭐⭐⭐ ВЫБИРАЕМ КАРТИНКУ ДЛЯ КНОПКИ ИЗБРАННОГО ⭐⭐⭐
    const favoriteImageSrc = isFavorite ? FAVORITE_IMAGES.active : FAVORITE_IMAGES.inactive;
    
    const html = `
        <div class="product-image" style="${hasImage ? 'background: none;' : ''}">
            ${hasImage ? `<img src="${currentProduct.image}" alt="${currentProduct.name}" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(145deg, #ffd9d1, #ffc5ba)'">` : ''}
            ${currentProduct.badge ? `<span class="product-badge">${currentProduct.badge}</span>` : ''}
            <!-- ⭐⭐⭐ ИСПРАВЛЕННАЯ КНОПКА ИЗБРАННОГО С ФОТОГРАФИЕЙ ⭐⭐⭐ -->
            <button class="favorite-corner-btn ${isFavorite ? 'active' : ''}" id="favoriteCornerBtn">
                <img src="${favoriteImageSrc}" alt="Избранное" class="favorite-image">
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

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ 
            ...product, 
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`"${product.name}" добавлен в корзину`, 'success');
    updateProfileDisplay();
}

// ⭐⭐⭐ ИСПРАВЛЕННАЯ ФУНКЦИЯ ДЛЯ ПЕРЕКЛЮЧЕНИЯ ИЗБРАННОГО С ФОТОГРАФИЕЙ ⭐⭐⭐
function toggleFavorite() {
    const btn = document.getElementById('favoriteCornerBtn');
    if (!btn || !currentProduct) return;
    
    const imgElement = btn.querySelector('.favorite-image');
    const index = favorites.indexOf(currentProduct.id);
    
    if (index === -1) {
        // Добавляем в избранное
        favorites.push(currentProduct.id);
        btn.classList.add('active');
        // Меняем фотографию на активную
        if (imgElement) imgElement.src = FAVORITE_IMAGES.active;
        showNotification('Добавлено в избранное', 'success');
    } else {
        // Удаляем из избранного
        favorites.splice(index, 1);
        btn.classList.remove('active');
        // Меняем фотографию на неактивную
        if (imgElement) imgElement.src = FAVORITE_IMAGES.inactive;
        showNotification('Удалено из избранного', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateProfileDisplay();
}

// Мобильное меню
function setupMobileMenu() {
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (burger && mobileMenu) {
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
}

// Профиль
function setupProfile() {
    const profileSection = document.getElementById('profileSection');
    if (!profileSection) return;
    
    updateProfileDisplay();
}

function updateProfileDisplay() {
    const profileSection = document.getElementById('profileSection');
    if (!profileSection) return;
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || '';
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    if (isLoggedIn && userName) {
        profileSection.innerHTML = `
            <div class="profile-menu">
                <div class="profile-avatar">${userName[0].toUpperCase()}</div>
                <div class="profile-dropdown">
                    <a href="profile.html" class="dropdown-item">👤 Личный кабинет</a>
                    <a href="#" class="dropdown-item">❤️ Избранное (${favorites.length})</a>
                    <a href="#" class="dropdown-item">🛒 Корзина (${cartCount})</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" id="logoutBtn">🚪 Выйти</a>
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
        
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('userName');
            showNotification('Вы вышли из аккаунта', 'info');
            setTimeout(() => location.reload(), 1500);
        });
    } else {
        profileSection.innerHTML = `
            <div class="login-btn" id="loginBtn">
                <span class="login-icon">👤</span>
            </div>
        `;
        
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            if (typeof showAuthModal === 'function') {
                showAuthModal();
            } else {
                window.location.href = 'profile.html';
            }
        });
    }
}

// Модальное окно быстрого заказа
function setupQuickOrderModal() {
    const modal = document.getElementById('quickOrderModal');
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
            
            if (!/^[\d\s\+\(\)-]{10,}$/.test(phone)) {
                showNotification('Введите корректный номер телефона', 'error');
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

// Уведомления
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

// Добавляем стили для анимации
function addAnimationStyles() {
    if (!document.querySelector('#productDetailStyles')) {
        const style = document.createElement('style');
        style.id = 'productDetailStyles';
        style.textContent = `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

addAnimationStyles();