import { adminService } from './services/adminService.js';
import { ORDER_STATUS, TEXTS } from './constants.js';

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
    const orders = adminService.getOrders();

    // Вставляем стили для модалки админ-панели (удаляются при закрытии)
    const style = document.createElement('style');
    style.textContent = `
      .admin-modal { }
      .admin-modal-content {
        background: #ffffff;
        width: 90%;
        max-width: 920px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        max-height: 85vh;
        overflow: auto;
      }
      .admin-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #eaeaea;
      }
      .admin-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
      .close-admin {
        appearance: none;
        background: transparent;
        border: none;
        font-size: 24px;
        line-height: 1;
        cursor: pointer;
        color: #888;
      }
      .close-admin:hover { color: #222; }
      .admin-body { padding: 16px 20px; }

      .order-item {
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      }
      .order-header {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }
      .order-id { font-weight: 600; }
      .order-date { color: #666; font-size: 13px; }
      .order-status {
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        background: #6c757d; /* базовый цвет, если не задан класс статуса */
      }
      .customer-info { margin-bottom: 8px; }
      .order-items { margin: 8px 0; }
      .order-item-product {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 0;
        border-bottom: 1px dashed #e8e8e8;
      }
      .order-item-product:last-child { border-bottom: 0; }
      .delivery-payment {
        display: flex;
        gap: 24px;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 8px;
      }
      .order-total {
        margin-top: 10px;
        text-align: right;
        font-weight: 700;
        font-size: 16px;
      }
    `;
    document.head.appendChild(style);

    const adminModal = document.createElement('div');
    adminModal.className = 'admin-modal';
    adminModal.innerHTML = `
      <div class="admin-modal-content">
        <div class="admin-header">
          <h2>${TEXTS.ADMIN_PANEL_TITLE}</h2>
          <button class="close-admin">&times;</button>
        </div>
        <div class="admin-body">
          ${orders.length === 0 ? `<p>${TEXTS.NO_ORDERS}</p>` : this.renderOrdersList(orders)}
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

    document.body.appendChild(adminModal);

    // Обработчики закрытия
    const closeBtn = adminModal.querySelector('.close-admin');
    closeBtn.addEventListener('click', () => {
      adminModal.remove();
      style.remove();
    });

    adminModal.addEventListener('click', e => {
      if (e.target === adminModal) {
        adminModal.remove();
        style.remove();
      }
    });
  }

  renderOrdersList(orders) {
    return orders
      .map(order => {
        const deliveryMethod = adminService.getDeliveryMethods().find(m => m.id === order.delivery);
        const paymentMethod = adminService.getPaymentMethods().find(m => m.id === order.payment);

        return `
        <div class="order-item">
          <div class="order-header">
            <span class="order-id">Заказ #${order.id}</span>
            <span class="order-date">${new Date(order.createdAt).toLocaleString('ru-RU')}</span>
            <span class="order-status ${ORDER_STATUS[order.status]?.class ?? ''}">
              ${ORDER_STATUS[order.status]?.label ?? order.status}
            </span>
          </div>
          <div class="customer-info">
            <strong>${TEXTS.CUSTOMER}:</strong> ${order.customerInfo.name}<br>
            <strong>${TEXTS.PHONE}:</strong> ${order.customerInfo.phone}<br>
            ${
              order.customerInfo.email
                ? `<strong>${TEXTS.EMAIL}:</strong> ${order.customerInfo.email}`
                : ''
            }
          </div>
          <div class="order-items">
            <strong>Товары:</strong>
            ${(order.items || [])
              .map(item => {
                const product = adminService.getProductById(item.productId);
                return `<div class="order-item-product">
                <span>${product.name} x${item.quantity}</span>
                <span>$${(product.price * item.quantity).toFixed(2)}</span>
              </div>`;
              })
              .join('')}
          </div>
          <div class="delivery-payment">
            <div class="delivery-info">
              <strong>${TEXTS.DELIVERY}:</strong><br>
              ${deliveryMethod.icon} ${deliveryMethod.name}<br>
              <span style="color: #2c5aa0;">$${deliveryMethod.price}</span>
            </div>
            <div class="payment-info">
              <strong>${TEXTS.PAYMENT}:</strong><br>
              ${paymentMethod.icon} ${paymentMethod.name}
            </div>
          </div>
          <div class="order-total">
            ${TEXTS.TOTAL}: $${order.total.toFixed(2)}
          </div>
        </div>
      `;
      })
      .join('');
  }
}

// Инициализируем админ-панель
export const adminPanel = new AdminPanel();
