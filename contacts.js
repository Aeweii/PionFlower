// ==================== contacts.js (мобильная версия) ====================

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupProfile();
    setupFAQ();
    setupFeedbackForm();
    setupQuickContacts();
    setupSocialLinks();
    setupRouteButton();
});

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
    }
}

// ==================== ПРОФИЛЬ И АВТОРИЗАЦИЯ ====================
function setupProfile() {
    const profileSection = document.getElementById('profileSection');
    if (!profileSection) return;
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || '';
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (isLoggedIn && userName) {
        profileSection.innerHTML = `
            <div class="profile-menu">
                <div class="profile-avatar">${userName[0].toUpperCase()}</div>
                <div class="profile-dropdown">
                    <a href="#" class="dropdown-item">👤 Личный кабинет</a>
                    <a href="#" class="dropdown-item">❤️ Избранное (${favorites.length})</a>
                    <a href="#" class="dropdown-item">🛒 Корзина (${getCartCount(cart)})</a>
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

function getCartCount(cart) {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
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