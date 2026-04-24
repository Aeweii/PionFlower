let products = [];
let orders = [];
let messages = [];

// Загрузка данных
function loadData() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    messages = JSON.parse(localStorage.getItem('feedbacks')) || [];
    
    if (products.length === 0) {
        products = [
            { id: 1, name: 'Нежность пионов', price: 2900, description: 'Изысканный букет из нежных пионов', composition: ['Розовые пионы'], category: 'author', badge: 'Хит', image: 'img/pion.jpeg' },
            { id: 2, name: 'Мятный эвкалипт', price: 2400, description: 'Стильная композиция с эвкалиптом', composition: ['Эвкалипт', 'Белые розы'], category: 'author', badge: '', image: 'img/mint.jpg' },
            { id: 3, name: 'Розовое облако', price: 3200, description: 'Нежный романтичный букет', composition: ['Розовые розы', 'Гипсофила'], category: 'wedding', badge: 'Свадебный', image: 'img/pink.jpg' }
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    updateStats();
    renderOrders();
    renderProducts();
    renderMessages();
    
}

// Обновление статистики
function updateStats() {
    const statOrders = document.getElementById('statOrders');
    const statProducts = document.getElementById('statProducts');
    const statMessages = document.getElementById('statMessages');
    
    if (statOrders) statOrders.textContent = orders.length;
    if (statProducts) statProducts.textContent = products.length;
    if (statMessages) statMessages.textContent = messages.length;
}

// Отображение заказов
function renderOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-state">Нет заказов</div>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="item-card">
            <div class="item-header">
                <span class="item-name">Заказ №${order.id}</span>
                <span class="item-badge">${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div class="item-desc">${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>
            <div class="item-price">${order.total.toLocaleString()} ₽</div>
            <div class="item-actions">
                <button class="delete-btn" onclick="deleteOrder(${order.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

// Удаление заказа
window.deleteOrder = function(id) {
    if (confirm('Удалить заказ?')) {
        orders = orders.filter(o => o.id !== id);
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrders();
        updateStats();
    }
};

// Отображение товаров
function renderProducts() {
    const container = document.getElementById('productsList');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<div class="empty-state">Нет товаров. Нажмите + чтобы добавить</div>';
        return;
    }
    
    container.innerHTML = products.map(p => `
        <div class="item-card">
            <div class="item-header">
                <span class="item-name">${escapeHtml(p.name)}</span>
                ${p.badge ? `<span class="item-badge">${p.badge}</span>` : ''}
            </div>
            <div class="item-price">${p.price.toLocaleString()} ₽</div>
            <div class="item-desc">${escapeHtml(p.description || '')}</div>
            <div class="item-meta">Категория: ${p.category}</div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editProduct(${p.id})">Редактировать</button>
                <button class="delete-btn" onclick="deleteProduct(${p.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

// Удаление товара
window.deleteProduct = function(id) {
    if (confirm('Удалить товар?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        updateStats();
    }
};

// Редактирование товара
window.editProduct = function(id) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    
    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name;
    document.getElementById('productPrice').value = p.price;
    document.getElementById('productDescription').value = p.description || '';
    document.getElementById('productComposition').value = p.composition ? p.composition.join(', ') : '';
    document.getElementById('productCategory').value = p.category;
    document.getElementById('productBadge').value = p.badge || '';
    document.getElementById('productImage').value = p.image || '';
    
    document.getElementById('modalTitle').textContent = 'Редактировать товар';
    document.getElementById('productModal').classList.add('active');
};

// Сохранение товара
function saveProduct(e) {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const price = parseInt(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const compositionStr = document.getElementById('productComposition').value;
    const category = document.getElementById('productCategory').value;
    const badge = document.getElementById('productBadge').value;
    const image = document.getElementById('productImage').value || 'img/default.jpg';
    
    if (!name || !price) {
        alert('Заполните название и цену');
        return;
    }
    
    const composition = compositionStr ? compositionStr.split(',').map(s => s.trim()) : [];
    
    if (id) {
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { ...products[index], name, price, description, composition, category, badge, image };
        }
    } else {
        const newId = Math.max(0, ...products.map(p => p.id), 0) + 1;
        products.push({ id: newId, name, price, description, composition, category, badge, image });
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    updateStats();
    closeModal();
    alert('Товар сохранен');
}

// Отображение сообщений
function renderMessages() {
    const container = document.getElementById('messagesList');
    if (!container) return;
    
    if (messages.length === 0) {
        container.innerHTML = '<div class="empty-state">Нет сообщений</div>';
        return;
    }
    
    container.innerHTML = messages.map(msg => `
        <div class="item-card">
            <div class="item-header">
                <span class="item-name">${escapeHtml(msg.name)}</span>
                <span class="item-badge">${new Date(msg.date).toLocaleDateString()}</span>
            </div>
            <div class="item-desc">${msg.phone || 'нет телефона'}</div>
            <div class="item-desc">${escapeHtml(msg.message)}</div>
            <div class="item-actions">
                <button class="delete-btn" onclick="deleteMessage(${msg.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

// Удаление сообщения
window.deleteMessage = function(id) {
    if (confirm('Удалить сообщение?')) {
        messages = messages.filter(m => m.id !== id);
        localStorage.setItem('feedbacks', JSON.stringify(messages));
        renderMessages();
        updateStats();
    }
};

// Закрытие модалки
function closeModal() {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    if (modal) modal.classList.remove('active');
    if (form) form.reset();
    const productId = document.getElementById('productId');
    if (productId) productId.value = '';
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = 'Добавить товар';
}

// Эскейп HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Переключение табов
function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const contents = document.querySelectorAll('.admin-tab-content');
    
    if (!tabs.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const activeTab = document.getElementById(`${tabId}Tab`);
            if (activeTab) activeTab.classList.add('active');
        });
    });
}

// ========== ИСПРАВЛЕННАЯ КНОПКА ВЫХОДА ==========
function setupCloseButton() {
    const closeBtn = document.getElementById('closeAdminBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            // Просто переходим на главную страницу
            window.location.href = 'main.html';
        });
    }
}

// Сохраняем страницу, с которой пришли в админку
function saveReturnUrl() {
    const referrer = document.referrer;
    
    if (referrer && referrer !== '') {
        // Извлекаем имя файла из URL
        let fileName = referrer.split('/').pop();
        if (!fileName || fileName === '' || fileName.includes('admin')) {
            fileName = 'main.html';
        }
        localStorage.setItem('adminReturnUrl', fileName);
    } else {
        // Если нет referrer, проверяем localStorage на наличие посещенных страниц
        const possiblePages = ['main.html', 'catalog.html', 'delivery.html', 'contacts.html', 'profile.html'];
        for (let page of possiblePages) {
            if (localStorage.getItem(`visited_${page}`) === 'true') {
                localStorage.setItem('adminReturnUrl', page);
                break;
            }
        }
        
        // Если всё равно нет - ставим главную
        if (!localStorage.getItem('adminReturnUrl')) {
            localStorage.setItem('adminReturnUrl', 'main.html');
        }
    }
}

// Сохраняем посещение страниц (вызывается на каждой странице сайта)
function trackPageVisit() {
    const currentPage = window.location.pathname.split('/').pop() || 'main.html';
    localStorage.setItem(`visited_${currentPage}`, 'true');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    saveReturnUrl();    // Сохраняем URL возврата
    loadData();
    setupTabs();
    setupCloseButton();
    initDarkTheme();
    
    const addBtn = document.getElementById('addProductBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const form = document.getElementById('productForm');
            const productId = document.getElementById('productId');
            const modalTitle = document.getElementById('modalTitle');
            const modal = document.getElementById('productModal');
            
            if (form) form.reset();
            if (productId) productId.value = '';
            if (modalTitle) modalTitle.textContent = 'Добавить товар';
            if (modal) modal.classList.add('active');
        });
    }
    
    const closeModalBtns = document.querySelectorAll('.admin-modal-close');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', saveProduct);
    }
});

// Вызываем trackPageVisit на всех страницах (можно добавить в каждый HTML)
if (typeof trackPageVisit === 'function') {
    trackPageVisit();
}

// ========== ТЁМНАЯ ТЕМА ДЛЯ АДМИНКИ ==========
function initDarkTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('adminTheme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('adminTheme', 'dark');
        } else {
            localStorage.setItem('adminTheme', 'light');
        }
    });
}