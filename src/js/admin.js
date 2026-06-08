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
        border-bottom: 1px solid #e5e7eb;
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
        color: #292929;
      }
      .close-admin:hover { color: #000; }
      .admin-body { padding: 16px 20px; }

      .modal-text {
      color: #292929
      }

      .order-item {
        background: #fafafa;
        border: 1px solid #e5e7eb;
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
      .order-date { color: #6b7280; font-size: 13px; }
      .order-status {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 14px;
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
        border-bottom: 1px dashed #e5e7eb;
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
          <h2 class="modal-text">${TEXTS.ADMIN_PANEL_TITLE}</h2>
          <button class="close-admin">
          <svg
          class="close-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.1943 6.41714C19.6393 5.97216 19.6393 5.2507 19.1943 4.80571C18.7493 4.36073 18.0278 4.36073 17.5829 4.80571L12 10.3886L6.41714 4.80572C5.97216 4.36073 5.2507 4.36073 4.80571 4.80571C4.36073 5.2507 4.36073 5.97216 4.80571 6.41714L10.3886 12L4.80572 17.5829C4.36073 18.0278 4.36073 18.7493 4.80571 19.1943C5.2507 19.6393 5.97216 19.6393 6.41714 19.1943L12 13.6114L17.5829 19.1943C18.0278 19.6393 18.7493 19.6393 19.1943 19.1943C19.6393 18.7493 19.6393 18.0278 19.1943 17.5829L13.6114 12L19.1943 6.41714Z"
            fill="#292929"
          />
        </svg>
        </div>
        <div class="admin-body">
          ${
            orders.length === 0
              ? `<p class="modal-text">${TEXTS.NO_ORDERS}</p>`
              : this.renderOrdersList(orders)
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
              <span style="color: #e59700;">$${deliveryMethod.price}</span>
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
