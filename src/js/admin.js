import { db } from './database.js';

export class AdminPanel {
  constructor() {
    this.init();
  }

  init() {
    // Создаем кнопку для открытия админ-панели (только для разработки)
    this.createAdminButton();
  }

  createAdminButton() {
    // Добавляем кнопку админ-панели только в режиме разработки
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const adminBtn = document.createElement('button');
      adminBtn.textContent = 'Админ-панель';
      adminBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
        font-size: 14px;
      `;
      
      adminBtn.addEventListener('click', () => this.openAdminPanel());
      document.body.appendChild(adminBtn);
    }
  }

  openAdminPanel() {
    const orders = db.getOrders();
    
    const adminModal = document.createElement('div');
    adminModal.className = 'admin-modal';
    adminModal.innerHTML = `
      <div class="admin-modal-content">
        <div class="admin-header">
          <h2>Админ-панель - Заказы</h2>
          <button class="close-admin">&times;</button>
        </div>
        <div class="admin-body">
          ${orders.length === 0 ? 
            '<p>Заказов пока нет</p>' : 
            this.renderOrdersList(orders)
          }
        </div>
      </div>
    `;
    
    adminModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1003;
    `;
    
    // Стили для админ-панели
    const style = document.createElement('style');
    style.textContent = `
      .admin-modal-content {
        background: white;
        border-radius: 10px;
        width: 90%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
        background: #f8f9fa;
      }
      
      .admin-header h2 {
        margin: 0;
        color: #333;
      }
      
      .close-admin {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
      
      .admin-body {
        padding: 20px;
      }
      
      .order-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        background: #f9f9f9;
      }
      
      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      
      .order-id {
        font-weight: 600;
        color: #2c5aa0;
      }
      
      .order-date {
        color: #666;
        font-size: 14px;
      }
      
      .order-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }
      
      .status-pending {
        background: #fff3cd;
        color: #856404;
      }
      
      .order-details {
        margin-bottom: 10px;
      }
      
      .order-items {
        margin-bottom: 10px;
      }
      
      .order-item-product {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
      }
      
      .order-total {
        font-weight: 600;
        color: #2c5aa0;
        font-size: 16px;
      }
      
      .customer-info {
        background: #f0f8ff;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      
      .delivery-payment {
        display: flex;
        gap: 20px;
        margin-bottom: 10px;
      }
      
      .delivery-info, .payment-info {
        flex: 1;
        background: #f8f9fa;
        padding: 10px;
        border-radius: 5px;
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(adminModal);
    
    // Обработчики закрытия
    const closeBtn = adminModal.querySelector('.close-admin');
    closeBtn.addEventListener('click', () => {
      adminModal.remove();
      style.remove();
    });
    
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) {
        adminModal.remove();
        style.remove();
      }
    });
  }

  renderOrdersList(orders) {
    return orders.map(order => {
      const deliveryMethod = db.getDeliveryMethods().find(m => m.id === order.delivery);
      const paymentMethod = db.getPaymentMethods().find(m => m.id === order.payment);
      
      return `
        <div class="order-item">
          <div class="order-header">
            <span class="order-id">Заказ #${order.id}</span>
            <span class="order-date">${new Date(order.createdAt).toLocaleString('ru-RU')}</span>
            <span class="order-status status-${order.status}">${this.getOrderStatusText(order.status)}</span>
          </div>
          
          <div class="customer-info">
            <strong>Клиент:</strong> ${order.customerInfo.name}<br>
            <strong>Телефон:</strong> ${order.customerInfo.phone}<br>
            ${order.customerInfo.email ? `<strong>Email:</strong> ${order.customerInfo.email}` : ''}
          </div>
          
          <div class="order-items">
            <strong>Товары:</strong>
            ${order.items.map(item => {
              const product = db.getProductById(item.productId);
              return `
                <div class="order-item-product">
                  <span>${product.name} x${item.quantity}</span>
                  <span>$${(product.price * item.quantity).toFixed(2)}</span>
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="delivery-payment">
            <div class="delivery-info">
              <strong>Доставка:</strong><br>
              ${deliveryMethod.icon} ${deliveryMethod.name}<br>
              <span style="color: #2c5aa0;">$${deliveryMethod.price}</span>
            </div>
            <div class="payment-info">
              <strong>Оплата:</strong><br>
              ${paymentMethod.icon} ${paymentMethod.name}
            </div>
          </div>
          
          <div class="order-total">
            Итого: $${order.total.toFixed(2)}
          </div>
        </div>
      `;
    }).join('');
  }

  getOrderStatusText(status) {
    const statusMap = {
      'pending': 'Ожидает обработки',
      'processing': 'В обработке',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  }
}

// Инициализируем админ-панель
export const adminPanel = new AdminPanel();
