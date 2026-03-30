// ==================== catalog.js - МОБИЛЬНАЯ ВЕРСИЯ ====================
// ⭐⭐⭐ НАСТРОЙКИ КНОПКИ ИЗБРАННОГО - ЗДЕСЬ ВЫ МОЖЕТЕ ДОБАВИТЬ СВОИ ФОТОГРАФИИ СЕРДЕЧЕК ⭐⭐⭐
const FAVORITE_IMAGES = {
    active: 'img/active.svg',     // замените на путь к вашему красному сердечку
    inactive: 'img/defaut.svg'    // замените на путь к вашему пустому сердечку
};

// ⭐⭐⭐ В ЭТОМ МАССИВЕ ВЫ ДОБАВЛЯЕТЕ СВОИ ФОТО ⭐⭐⭐
const products = [
    { 
        id: 1, 
        name: 'Нежность пионов', 
        description: 'Букет из 25 пионов', 
        price: 2900, 
        category: 'author', 
        badge: 'Хит',
        image: 'img/pion.jpeg',
    },
    { 
        id: 2, 
        name: 'Мятный эвкалипт', 
        description: 'Композиция с эвкалиптом', 
        price: 2400, 
        category: 'author', 
        badge: '',
        image: 'img/mint.jpg'
    },
    { 
        id: 3, 
        name: 'Розовое облако', 
        description: 'Нежные розы и альстромерии', 
        price: 3200, 
        category: 'wedding', 
        badge: 'Свадебный',
        image: 'img/pink.jpg'
    },
    { 
        id: 4, 
        name: 'Лавандовый сон', 
        description: 'Лаванда и сухоцветы', 
        price: 2700, 
        category: 'author', 
        badge: '',
        image: 'img/violet.jpg'
    },
    { 
        id: 5, 
        name: 'Корпоративный стиль', 
        description: 'Деловые букеты в офис', 
        price: 3500, 
        category: 'corporate', 
        badge: 'Популярный',
        image: 'img/business.jpg'
    },
    { 
        id: 6, 
        name: 'Алые розы', 
        description: '15 роз премиум-класса', 
        price: 4100, 
        category: 'mono', 
        badge: 'Премиум',
        image: 'img/red.jpg'
    },
    { 
        id: 7, 
        name: 'Свадебная нежность', 
        description: 'Букет невесты', 
        price: 3800, 
        category: 'wedding', 
        badge: 'Свадебный',
        image: 'img/wedding.jpg'
    },
    { 
        id: 8, 
        name: 'Полевые цветы', 
        description: 'Ромашки, васильки', 
        price: 1900, 
        category: 'author', 
        badge: '',
        image: 'img/field.jpg'
    },
    { 
        id: 9, 
        name: 'Бизнес-букет', 
        description: 'Строгая композиция', 
        price: 4200, 
        category: 'corporate', 
        badge: '',
        image: 'img/bisiness2.jpg'
    },
    { 
        id: 10, 
        name: 'Тюльпаны', 
        description: '25 тюльпанов', 
        price: 2100, 
        category: 'mono', 
        badge: 'Сезон',
        image: 'img/tulips.jpg'
    },
    { 
        id: 11, 
        name: 'Пионовидные розы', 
        description: 'Букет из 9 роз', 
        price: 3300, 
        category: 'author', 
        badge: 'Новинка',
        image: 'img/pionrose.jpg'
    },
    { 
        id: 12, 
        name: 'Хризантемы', 
        description: 'Кустовые хризантемы', 
        price: 2500, 
        category: 'mono', 
        badge: '',
        image: 'img/chrysanthemums.jpg'
    }
];

// Состояние
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';
let currentSort = 'popular';
let currentPage = 1;
const itemsPerPage = 8;

// DOM элементы
let catalogGrid, filterBtns, sortSelect, paginationContainer;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    catalogGrid = document.getElementById('catalogGrid');
    filterBtns = document.querySelectorAll('.filter-btn');
    sortSelect = document.getElementById('sort');
    paginationContainer = document.getElementById('pagination');
    
    setupMobileMenu();
    setupProfile();
    setupEventListeners();
    displayProducts();
    setupPagination();
    addAnimationStyles();
});

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
        
        document.querySelectorAll('.mobile-link').forEach(link => {
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

// Профиль и авторизация
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
        
        document.getElementById('loginBtn')?.addEventListener('click', showLoginModal);
    }
}

// Отображение товаров
function displayProducts() {
    if (!catalogGrid) return;
    
    let filteredProducts = [...products];
    
    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
    }
    
    switch(currentSort) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'new':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, start + itemsPerPage);
    
    catalogGrid.innerHTML = paginatedProducts.map(product => {
        const isFavorite = favorites.includes(product.id);
        const hasImage = product.image && product.image !== '';
        const favoriteImageSrc = isFavorite ? FAVORITE_IMAGES.active : FAVORITE_IMAGES.inactive;
        
        const imageHtml = hasImage 
            ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(145deg, #ffd9d1, #ffc5ba)'">`
            : '';
        
        return `
            <div class="product-card" data-id="${product.id}" data-product='${JSON.stringify(product)}'>
                <div class="card-image ${!hasImage ? 'gradient-' + product.id : ''}" style="${hasImage ? 'background: none;' : ''}">
                    ${imageHtml}
                    ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
                </div>
                <div class="card-title">${escapeHtml(product.name)}</div>
                <div class="card-description">${escapeHtml(product.description)}</div>
                <div class="card-price">${product.price.toLocaleString()} ₽</div>
                <div class="card-actions">
                    <span class="icon-heart favorite-icon ${isFavorite ? 'active' : ''}" data-id="${product.id}">
                        <img src="${favoriteImageSrc}" alt="Избранное" style="width:20px;height:20px;">
                    </span>
                    <button class="btn add-to-cart-btn" data-id="${product.id}">В корзину</button>
                </div>
            </div>
        `;
    }).join('');
    
    attachProductCardClickHandlers();
}

// Обработчик клика на карточку
function attachProductCardClickHandlers() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.removeEventListener('click', card._clickHandler);
        
        const handler = (e) => {
            if (e.target.closest('.favorite-icon') || e.target.closest('.add-to-cart-btn')) {
                return;
            }
            
            const productId = card.dataset.id;
            if (productId) {
                window.location.href = `product-detail.html?id=${productId}`;
            }
        };
        
        card._clickHandler = handler;
        card.addEventListener('click', handler);
    });
    
    // Обработка избранного
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        icon.removeEventListener('click', icon._favHandler);
        
        const favHandler = (e) => {
            e.stopPropagation();
            const productId = parseInt(icon.dataset.id);
            toggleFavorite(productId, icon);
        };
        
        icon._favHandler = favHandler;
        icon.addEventListener('click', favHandler);
    });
    
    // Обработка корзины
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.removeEventListener('click', btn._cartHandler);
        
        const cartHandler = (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product, btn);
            }
        };
        
        btn._cartHandler = cartHandler;
        btn.addEventListener('click', cartHandler);
    });
}

// События
function setupEventListeners() {
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                currentPage = 1;
                displayProducts();
                setupPagination();
            });
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            currentPage = 1;
            displayProducts();
            setupPagination();
        });
    }
}

// Пагинация
function setupPagination() {
    if (!paginationContainer) return;
    
    let filteredProducts = [...products];
    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
    }
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.dataset.page = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            displayProducts();
            setupPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationContainer.appendChild(btn);
    }
}

// Избранное
function toggleFavorite(productId, iconElement) {
    const imgElement = iconElement.querySelector('img');
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        favorites.push(productId);
        iconElement.classList.add('active');
        if (imgElement) imgElement.src = FAVORITE_IMAGES.active;
        showNotification('Добавлено в избранное', 'success');
    } else {
        favorites.splice(index, 1);
        iconElement.classList.remove('active');
        if (imgElement) imgElement.src = FAVORITE_IMAGES.inactive;
        showNotification('Удалено из избранного', 'info');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateProfileDisplay();
}

// Корзина
function addToCart(product, btnElement) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ 
            ...product, 
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`"${product.name}" добавлен в корзину`, 'success');
    updateProfileDisplay();
    
    if (btnElement) {
        const originalText = btnElement.textContent;
        btnElement.textContent = '✓ Добавлено';
        btnElement.style.background = '#4CAF50';
        setTimeout(() => {
            btnElement.textContent = originalText;
            btnElement.style.background = '';
        }, 1000);
    }
}

// Модалка входа
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.innerHTML = `
        <div class="login-modal-content">
            <div class="login-modal-header">
                <h3>Вход в аккаунт</h3>
                <button class="close-login-modal">✕</button>
            </div>
            <div class="login-modal-body">
                <form id="loginForm">
                    <div class="form-group">
                        <input type="text" id="loginName" placeholder="Ваше имя" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="loginPhone" placeholder="+7 (XXX) XXX-XX-XX" required>
                    </div>
                    <button type="submit" class="btn-login-submit">Войти</button>
                </form>
                <p class="login-hint">* Для входа достаточно указать имя и телефон</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    const closeBtn = modal.querySelector('.close-login-modal');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    const form = modal.querySelector('#loginForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('loginName').value.trim();
        const phone = document.getElementById('loginPhone').value.trim();
        
        if (name && phone) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', name);
            localStorage.setItem('userPhone', phone);
            showNotification(`Добро пожаловать, ${name}!`, 'success');
            modal.remove();
            document.body.style.overflow = '';
            setTimeout(() => location.reload(), 1000);
        } else {
            showNotification('Пожалуйста, заполните все поля', 'error');
        }
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
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

function addAnimationStyles() {
    if (!document.querySelector('#catalogAnimationStyles')) {
        const style = document.createElement('style');
        style.id = 'catalogAnimationStyles';
        style.textContent = `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notifications-container {
                position: fixed;
                top: 70px;
                left: 16px;
                right: 16px;
                z-index: 10001;
                pointer-events: none;
            }
            .notification {
                background: white;
                border-radius: 50px;
                padding: 12px 16px;
                margin-bottom: 8px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideDown 0.3s ease;
                border-left: 4px solid;
                pointer-events: auto;
                font-size: 14px;
            }
            .notification.success { border-left-color: #4CAF50; }
            .notification.error { border-left-color: #f44336; }
            .notification.info { border-left-color: #2196F3; }
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
                margin-left: auto;
            }
            @keyframes slideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}