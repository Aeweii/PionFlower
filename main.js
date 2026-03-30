// ==================== main.js ====================
// Основной JavaScript для главной страницы с динамическими карточками

// ⭐⭐⭐ НАСТРОЙКИ КНОПКИ ИЗБРАННОГО - ЗДЕСЬ ВЫ МОЖЕТЕ ДОБАВИТЬ СВОИ ФОТОГРАФИИ СЕРДЕЧЕК ⭐⭐⭐
const FAVORITE_IMAGES = {
    active: 'img/active.svg',     // замените на путь к вашему красному сердечку
    inactive: 'img/defaut.svg'    // замените на путь к вашему пустому сердечку
};

// Данные товаров (опираясь на вашу структуру из HTML)
const productsData = [
    {
        id: 1,
        name: 'Нежность пионов',
        price: 2900,
        image: 'img/pion.jpeg',
        badge: 'Хит продаж',
        category: 'author'
    },
    {
        id: 2,
        name: 'Мятный эвкалипт',
        price: 2400,
        image: 'img/mint.jpg',
        badge: '',
        category: 'author'
    },
 {
        id: 5,
        name: 'Корпоративный стиль',
        price: 3500,
        image: 'img/business.jpg',
        badge: 'Популярный',
        category: 'corporate'
    },
    {
        id: 7,
        name: 'Свадебная нежность',
        price: 3800,
        image: 'img/wedding.jpg',
        badge: 'Свадебный',
        category: 'wedding'
    },

];

// Состояние
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';

// DOM элементы
let catalogGrid, filterBtns, reviewsCarousel, prevBtn, nextBtn;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupMobileMenu();
    setupProfile();
    setupEventListeners();
    displayProducts();
    setupReviewsCarousel();
    setupContactForm();
    setupScrollAnimations();
});

function initializeElements() {
    catalogGrid = document.getElementById('mainCatalogGrid');
    filterBtns = document.querySelectorAll('.filter-btn');
    reviewsCarousel = document.getElementById('reviewsCarousel');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
}

// ==================== ОТОБРАЖЕНИЕ ТОВАРОВ ====================
function displayProducts() {
    if (!catalogGrid) return;
    
    let filteredProducts = productsData;
    
    if (currentFilter !== 'all') {
        filteredProducts = productsData.filter(p => p.category === currentFilter);
    }
    
    catalogGrid.innerHTML = filteredProducts.map(product => {
        const isFavorite = favorites.includes(product.id);
        const favoriteImageSrc = isFavorite ? FAVORITE_IMAGES.active : FAVORITE_IMAGES.inactive;
        
        // Создаем HTML карточки точно как в вашем примере, но с динамическими данными
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="card-image">
                    <img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">
                    ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
                </div>
                <div class="card-title">${escapeHtml(product.name)}</div>
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
    
    attachProductCardHandlers();
}

function attachProductCardHandlers() {
    // Обработка клика на карточку (переход на детальную страницу)
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
    
    // Обработка иконок избранного (используем .icon-heart как в вашем HTML)
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
    
    // Обработка кнопок корзины
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.removeEventListener('click', btn._cartHandler);
        
        const cartHandler = (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            const product = productsData.find(p => p.id === productId);
            if (product) {
                addToCart(product, btn);
            }
        };
        
        btn._cartHandler = cartHandler;
        btn.addEventListener('click', cartHandler);
    });
}

// ==================== ИЗБРАННОЕ ====================
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

// ==================== КОРЗИНА ====================
function addToCart(product, btnElement) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
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

// ==================== ФИЛЬТРЫ ====================
function setupEventListeners() {
    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                displayProducts();
            });
        });
    }
}

// ==================== МОБИЛЬНОЕ МЕНЮ ====================
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

// ==================== ПРОФИЛЬ ====================
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

// ==================== КАРУСЕЛЬ ОТЗЫВОВ ====================
function setupReviewsCarousel() {
    if (!reviewsCarousel || !prevBtn || !nextBtn) return;
    
    let scrollAmount = 0;
    const scrollStep = 220;
    
    prevBtn.addEventListener('click', () => {
        scrollAmount -= scrollStep;
        if (scrollAmount < 0) scrollAmount = 0;
        reviewsCarousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        scrollAmount += scrollStep;
        const maxScroll = reviewsCarousel.scrollWidth - reviewsCarousel.clientWidth;
        if (scrollAmount > maxScroll) scrollAmount = maxScroll;
        reviewsCarousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    });
    
    let autoScrollInterval;
    
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (document.hidden) return;
            const maxScroll = reviewsCarousel.scrollWidth - reviewsCarousel.clientWidth;
            if (scrollAmount >= maxScroll) {
                scrollAmount = 0;
            } else {
                scrollAmount += scrollStep;
                if (scrollAmount > maxScroll) scrollAmount = maxScroll;
            }
            reviewsCarousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }, 4000);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    reviewsCarousel.addEventListener('mouseenter', stopAutoScroll);
    reviewsCarousel.addEventListener('touchstart', stopAutoScroll);
    reviewsCarousel.addEventListener('mouseleave', startAutoScroll);
    reviewsCarousel.addEventListener('touchend', startAutoScroll);
    
    startAutoScroll();
}

// ==================== ФОРМА ОБРАТНОЙ СВЯЗИ ====================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value.trim();
        const email = document.getElementById('contactEmail')?.value.trim();
        const message = document.getElementById('contactMessage')?.value.trim();
        
        if (name && message) {
            showNotification(`Спасибо, ${name}! Мы получили ваше сообщение и скоро ответим.`, 'success');
            form.reset();
            
            const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
            contacts.push({
                id: Date.now(),
                name,
                email,
                message,
                date: new Date().toISOString()
            });
            localStorage.setItem('contacts', JSON.stringify(contacts));
        } else {
            showNotification('Пожалуйста, заполните имя и сообщение', 'error');
        }
    });
}

// ==================== АНИМАЦИЯ ПРИ ПРОКРУТКЕ ====================
function setupScrollAnimations() {
    const elements = document.querySelectorAll('.product-card, .review-card, .delivery-info, .contact-chat-grid');
    
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

// Добавляем стили анимации
function addAnimationStyles() {
    if (!document.querySelector('#mainAnimationStyles')) {
        const style = document.createElement('style');
        style.id = 'mainAnimationStyles';
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

addAnimationStyles();