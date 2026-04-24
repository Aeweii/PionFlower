
// Проверка авторизации
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Получение данных пользователя
function getUserData() {
    return {
        name: localStorage.getItem('userName') || '',
        phone: localStorage.getItem('userPhone') || '',
        email: localStorage.getItem('userEmail') || ''
    };
}

// Проверка и перенаправление при клике на Личный кабинет
function setupProfileNavigation() {
    // Обработка клика на мобильном меню
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        if (link.getAttribute('href') === 'profile.html') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (isUserLoggedIn()) {
                    // Если авторизован - переходим в профиль
                    window.location.href = 'profile.html';
                } else {
                    // Если не авторизован - показываем модалку входа
                    showAuthModal();
                }
            });
        }
    });
    
    // Обработка клика на десктопной навигации (если есть)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'profile.html') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (isUserLoggedIn()) {
                    window.location.href = 'profile.html';
                } else {
                    showAuthModal();
                }
            });
        }
    });
}

// Показать модальное окно авторизации/регистрации
function showAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h3>Вход в личный кабинет</h3>
                <button class="close-auth-modal">✕</button>
            </div>
            <div class="auth-modal-body">
                <div class="auth-tabs">
                    <button class="auth-tab-btn active" data-auth-tab="login">Вход</button>
                    <button class="auth-tab-btn" data-auth-tab="register">Регистрация</button>
                </div>
                
                <!-- Форма входа -->
                <form id="loginForm" class="auth-form active">
                    <div class="form-group">
                        <input type="text" id="loginName" placeholder="Ваше имя" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="loginPhone" placeholder="+7 (XXX) XXX-XX-XX" required>
                    </div>
                    <button type="submit" class="btn-auth-submit">Войти</button>
                    <p class="auth-hint">* Для входа достаточно указать имя и телефон</p>
                </form>
                
                <!-- Форма регистрации -->
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <input type="text" id="regName" placeholder="Ваше имя" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="regPhone" placeholder="+7 (XXX) XXX-XX-XX" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="regEmail" placeholder="Email (необязательно)">
                    </div>
                    <button type="submit" class="btn-auth-submit">Зарегистрироваться</button>
                    <p class="auth-hint">* Регистрация займет меньше минуты</p>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Переключение между вкладками
    const tabBtns = modal.querySelectorAll('.auth-tab-btn');
    const forms = modal.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.authTab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}Form`).classList.add('active');
        });
    });
    
    // Закрытие модалки
    const closeBtn = modal.querySelector('.close-auth-modal');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
    
    // Обработка формы входа
    const loginForm = modal.querySelector('#loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('loginName').value.trim();
        const phone = document.getElementById('loginPhone').value.trim();
        
        if (name && phone) {
            // Сохраняем данные пользователя
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', name);
            localStorage.setItem('userPhone', phone);
            
            showNotification(`Добро пожаловать, ${name}!`, 'success');
            modal.remove();
            document.body.style.overflow = '';
            
            // Перенаправляем в личный кабинет
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            showNotification('Пожалуйста, заполните все поля', 'error');
        }
    });
    
    // Обработка формы регистрации
    const registerForm = modal.querySelector('#registerForm');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        
        if (name && phone) {
            // Сохраняем данные пользователя
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', name);
            localStorage.setItem('userPhone', phone);
            if (email) localStorage.setItem('userEmail', email);
            
            // Сохраняем в список пользователей
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(u => u.phone === phone);
            
            if (!existingUser) {
                users.push({
                    id: Date.now(),
                    name,
                    phone,
                    email,
                    registerDate: new Date().toISOString()
                });
                localStorage.setItem('users', JSON.stringify(users));
                showNotification(`Регистрация прошла успешно! Добро пожаловать, ${name}!`, 'success');
            } else {
                showNotification(`С возвращением, ${name}!`, 'success');
            }
            
            modal.remove();
            document.body.style.overflow = '';
            
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            showNotification('Пожалуйста, заполните имя и телефон', 'error');
        }
    });
}

// Обновление отображения профиля в шапке
function updateProfileDisplay() {
    const profileSection = document.getElementById('profileSection');
    if (!profileSection) return;
    
    const isLoggedIn = isUserLoggedIn();
    const userData = getUserData();
    
    if (isLoggedIn && userData.name) {
        profileSection.innerHTML = `
            <div class="profile-menu">
                <div class="profile-avatar">${userData.name[0].toUpperCase()}</div>
                <div class="profile-dropdown">
                    <a href="profile.html" class="dropdown-item">Личный кабинет</a>
                    <a href="#" class="dropdown-item">Избранное (${getFavoritesCount()})</a>
                    <a href="#" class="dropdown-item">Корзина (${getCartCount()})</a>
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
                <span class="login-icon">
                <img src="./media/icon/userrr.svg" alt="PionFlower" class="logo-img">
                </span>
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
        location.reload();
    }, 1500);
}

// Получение количества избранного
function getFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.length;
}

// Получение количества товаров в корзине
function getCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

// Показать уведомление
function showNotification(message, type = 'info') {
    let container = document.querySelector('.notifications-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    const icons = { success: '✓', error: '✗', info: 'ℹ', warning: '⚠' };
    
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

// Добавляем стили для модального окна
function addAuthStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Стили для модального окна авторизации */
        .auth-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .auth-modal-content {
            background: white;
            width: 90%;
            max-width: 340px;
            border-radius: 24px;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        }
        
        .auth-modal-header {
            padding: 16px 20px;
            background: var(--primary-rose, #ffdbd3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .auth-modal-header h3 {
            margin: 0;
            font-size: 18px;
            color: var(--text-dark, #614949);
        }
        
        .close-auth-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-dark, #614949);
        }
        
        .auth-modal-body {
            padding: 20px;
        }
        
        .auth-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            background: #f5f5f5;
            border-radius: 50px;
            padding: 4px;
        }
        
        .auth-tab-btn {
            flex: 1;
            padding: 10px;
            background: transparent;
            border: none;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: 0.2s;
            color: var(--text-light, #9e7a7a);
        }
        
        .auth-tab-btn.active {
            background: var(--accent-rose, #fba8a8);
            color: white;
        }
        
        .auth-form {
            display: none;
        }
        
        .auth-form.active {
            display: block;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border-rose, #ffd0cb);
            border-radius: 30px;
            font-size: 14px;
            font-family: inherit;
            background: #fff5f2;
            transition: all 0.2s ease;
        }
        
        /* ========== РОЗОВАЯ ОБВОДКА ПРИ ФОКУСЕ ========== */
        .form-group input:focus {
            outline: none;
            border-color: var(--accent-rose, #fba8a8);
            box-shadow: 0 0 0 2px rgba(251, 168, 168, 0.2);
        }
        
        .btn-auth-submit {
            width: 100%;
            padding: 12px;
            background: var(--accent-rose, #fba8a8);
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: 0.2s;
        }
        
        .btn-auth-submit:active {
            transform: scale(0.98);
        }
        
        .auth-hint {
            font-size: 12px;
            color: var(--text-light, #9e7a7a);
            text-align: center;
            margin-top: 16px;
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
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
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

        /* Кнопки переключения табов при фокусе */
.auth-tab-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 168, 168, 0.4);
    background: var(--accent-rose, #fba8a8);
    color: white;
}

/* Кнопка входа/регистрации при фокусе */
.btn-auth-submit:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 168, 168, 0.4);
    transform: scale(0.98);
}

/* Кнопка закрытия модалки при фокусе */
.close-auth-modal:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 168, 168, 0.4);
    border-radius: 50%;
}
        
        @keyframes slideUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    addAuthStyles();
    updateProfileDisplay();
    setupProfileNavigation();
});