import { db } from './database.js';

export class CartManager {
  constructor() {
    this.cart = [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateCartDisplay();
  }

  bindEvents() {
    // Обработчики для кнопок "В корзину"
    document.addEventListener('click', e => {
      if (e.target.textContent === 'В корзину' || e.target.textContent.trim() === 'В корзину') {
        e.preventDefault();
        const card = e.target.closest('.card');
        if (card) {
          this.addToCartFromCard(card);
        }
      }
    });

    // Обработчики для кнопок "Купить" (добавляем в корзину и открываем корзину)
    document.addEventListener('click', e => {
      if (e.target.textContent === 'Купить' || e.target.textContent.trim() === 'Купить') {
        e.preventDefault();
        const card = e.target.closest('.card');
        if (card) {
          this.addToCartFromCard(card);
          this.openCart();
        }
      }
    });

    // Обработчик для кнопки корзины в header
    document.addEventListener('click', e => {
      if (e.target.closest('[data-open-cart]')) {
        e.preventDefault();
        this.openCart();
      }
    });
  }

  addToCartFromCard(card) {
    const title = card.querySelector('.card-title');
    const price = card.querySelector('.card-price');

    if (title && price) {
      const productName = title.textContent.trim();
      const productPrice = parseFloat(price.textContent.replace(/[^0-9.]/g, ''));

      // Находим товар в базе данных по названию
      const product = db.getProducts().find(p => p.name === productName);

      if (product) {
        const success = db.addToCart(product.id, 1);
        if (success) {
          this.showNotification('Товар добавлен в корзину!');
          this.updateCartDisplay();
        }
      }
    }
  }

  addToCart(productId, quantity = 1) {
    const success = db.addToCart(productId, quantity);
    if (success) {
      this.updateCartDisplay();
      return true;
    }
    return false;
  }

  removeFromCart(productId) {
    db.removeFromCart(productId);
    this.updateCartDisplay();
  }

  updateCartItemQuantity(productId, quantity) {
    db.updateCartItemQuantity(productId, quantity);
    this.updateCartDisplay();
  }

  getCart() {
    return db.getCart();
  }

  getCartTotal() {
    return db.getCartTotal();
  }

  clearCart() {
    db.clearCart();
    this.updateCartDisplay();
  }

  updateCartDisplay() {
    const cart = this.getCart();
    const total = this.getCartTotal();

    // Обновляем счетчик товаров в корзине (если есть)
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCounter.textContent = totalItems;
      cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
    }

    // Обновляем содержимое корзины если она открыта
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal && cartModal.style.display !== 'none') {
      this.renderCartItems();
    }
  }

  renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    const cart = this.getCart();

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
      return;
    }

    cartItemsContainer.innerHTML = cart
      .map(
        item => `
      <div class="cart-item" data-product-id="${item.productId}">
        <div class="cart-item-image">
          <img src="${item.product.image}" alt="${item.product.name}" />
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.product.name}</h4>
          <p class="cart-item-category">${item.product.category}</p>
          <div class="cart-item-controls">
            <button class="quantity-btn minus" data-product-id="${item.productId}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" data-product-id="${item.productId}">+</button>
            <button class="remove-btn" data-product-id="${item.productId}">×</button>
          </div>
        </div>
        <div class="cart-item-price">
          <span class="price">$${item.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    `
      )
      .join('');

    // Добавляем обработчики для кнопок управления количеством
    cartItemsContainer.addEventListener('click', e => {
      const productId = parseInt(e.target.dataset.productId);

      if (e.target.classList.contains('minus')) {
        const item = cart.find(item => item.productId === productId);
        if (item && item.quantity > 1) {
          this.updateCartItemQuantity(productId, item.quantity - 1);
        } else {
          this.removeFromCart(productId);
        }
      } else if (e.target.classList.contains('plus')) {
        const item = cart.find(item => item.productId === productId);
        if (item) {
          this.updateCartItemQuantity(productId, item.quantity + 1);
        }
      } else if (e.target.classList.contains('remove-btn')) {
        this.removeFromCart(productId);
      }
    });

    // Обновляем общую сумму
    const totalElement = document.querySelector('.cart-total');
    if (totalElement) {
      totalElement.textContent = `$${this.getCartTotal().toFixed(2)}`;
    }
  }

  openCart() {
    // Создаем модальное окно корзины если его нет
    let cartModal = document.querySelector('.cart-modal');
    if (!cartModal) {
      cartModal = this.createCartModal();
      document.body.appendChild(cartModal);
    }

    this.renderCartItems();
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  closeCart() {
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
      cartModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
      <div class="cart-modal-content">
        <div class="cart-header">
          <h2 class="cart-title">Корзина</h2>
          <button class="close-cart">
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
          </button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
          <div class="cart-total-section">
            <span class="total-label">Итого:</span>
            <span class="cart-total">$0.00</span>
          </div>
          <button class="btn checkout-btn">Оформить заказ</button>
        </div>
      </div>
    `;

    // Добавляем обработчики событий
    modal.querySelector('.close-cart').addEventListener('click', () => this.closeCart());
    modal.querySelector('.checkout-btn').addEventListener('click', () => this.openCheckout());

    // Закрытие по клику вне модального окна
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        this.closeCart();
      }
    });

    return modal;
  }

  openCheckout() {
    const cart = this.getCart();
    if (cart.length === 0) {
      this.showNotification('Корзина пуста!');
      return;
    }

    // Создаем модальное окно оформления заказа
    let checkoutModal = document.querySelector('.checkout-modal');
    if (!checkoutModal) {
      checkoutModal = this.createCheckoutModal();
      document.body.appendChild(checkoutModal);
    }

    this.renderCheckoutForm();
    checkoutModal.style.display = 'flex';
    this.closeCart();
  }

  createCheckoutModal() {
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    modal.innerHTML = `
      <div class="checkout-modal-content">
        <div class="checkout-header">
          <h2>Оформление заказа</h2>
          <button class="close-checkout">&times;</button>
        </div>
        <form class="checkout-form">
          <div class="checkout-items"></div>
          
          <div class="form-section">
            <h3>Контактная информация</h3>
            <div class="form-group">
              <label for="customer-name">Имя *</label>
              <input type="text" id="customer-name" name="name" required>
            </div>
            <div class="form-group">
              <label for="customer-phone">Телефон *</label>
              <input type="tel" id="customer-phone" name="phone" required>
            </div>
            <div class="form-group">
              <label for="customer-email">Email</label>
              <input type="email" id="customer-email" name="email">
            </div>
          </div>

          <div class="form-section">
            <h3>Способ доставки</h3>
            <div class="delivery-methods"></div>
          </div>

          <div class="form-section">
            <h3>Способ оплаты</h3>
            <div class="payment-methods"></div>
          </div>

          <div class="checkout-total">
            <div class="total-line">
              <span>Товары:</span>
              <span class="items-total">$0.00</span>
            </div>
            <div class="total-line">
              <span>Доставка:</span>
              <span class="delivery-total">$0.00</span>
            </div>
            <div class="total-line total-final">
              <span>Итого:</span>
              <span class="final-total">$0.00</span>
            </div>
          </div>

          <button type="submit" class="btn submit-order">Подтвердить заказ</button>
        </form>
      </div>
    `;

    // Добавляем обработчики событий
    modal.querySelector('.close-checkout').addEventListener('click', () => this.closeCheckout());

    modal.addEventListener('click', e => {
      if (e.target === modal) {
        this.closeCheckout();
      }
    });

    // Обработчик формы заказа
    const form = modal.querySelector('.checkout-form');
    form.addEventListener('submit', e => this.handleOrderSubmit(e));

    return modal;
  }

  renderCheckoutForm() {
    const cart = this.getCart();
    const total = this.getCartTotal();

    // Рендерим товары в заказе
    const checkoutItems = document.querySelector('.checkout-items');
    checkoutItems.innerHTML = cart
      .map(
        item => `
      <div class="checkout-item">
        <img src="${item.product.image}" alt="${item.product.name}" />
        <div class="checkout-item-info">
          <h4>${item.product.name}</h4>
          <p>Количество: ${item.quantity}</p>
          <p>Цена: $${item.totalPrice.toFixed(2)}</p>
        </div>
      </div>
    `
      )
      .join('');

    // Рендерим способы доставки
    const deliveryMethods = document.querySelector('.delivery-methods');
    const deliveryOptions = db.getDeliveryMethods();
    deliveryMethods.innerHTML = deliveryOptions
      .map(
        method => `
      <label class="delivery-option">
        <input type="radio" name="delivery" value="${method.id}" required>
        <span class="option-info">
          <span class="option-name">${method.icon} ${method.name}</span>
          <span class="option-price">$${method.price}</span>
        </span>
      </label>
    `
      )
      .join('');

    // Рендерим способы оплаты
    const paymentMethods = document.querySelector('.payment-methods');
    const paymentOptions = db.getPaymentMethods();
    paymentMethods.innerHTML = paymentOptions
      .map(
        method => `
      <label class="payment-option">
        <input type="radio" name="payment" value="${method.id}" required>
        <span class="option-info">
          <span class="option-name">${method.icon} ${method.name}</span>
        </span>
      </label>
    `
      )
      .join('');

    // Обновляем итоговую сумму
    document.querySelector('.items-total').textContent = `$${total.toFixed(2)}`;
    this.updateCheckoutTotal();

    // Добавляем обработчики для обновления суммы при изменении доставки
    deliveryMethods.addEventListener('change', () => this.updateCheckoutTotal());
  }

  updateCheckoutTotal() {
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    const deliveryPrice = selectedDelivery
      ? db.getDeliveryMethods().find(m => m.id === selectedDelivery.value)?.price || 0
      : 0;

    const itemsTotal = this.getCartTotal();
    const finalTotal = itemsTotal + deliveryPrice;

    document.querySelector('.delivery-total').textContent = `$${deliveryPrice}`;
    document.querySelector('.final-total').textContent = `$${finalTotal.toFixed(2)}`;
  }

  closeCheckout() {
    const checkoutModal = document.querySelector('.checkout-modal');
    if (checkoutModal) {
      checkoutModal.style.display = 'none';
    }
  }

  handleOrderSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Собираем данные формы
    const customerInfo = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
    };

    const delivery = formData.get('delivery');
    const payment = formData.get('payment');

    // Валидация
    if (!customerInfo.name || !customerInfo.phone) {
      this.showNotification('Пожалуйста, заполните обязательные поля');
      return;
    }

    if (!delivery) {
      this.showNotification('Пожалуйста, выберите способ доставки');
      return;
    }

    if (!payment) {
      this.showNotification('Пожалуйста, выберите способ оплаты');
      return;
    }

    // Создаем заказ
    const orderData = {
      customerInfo,
      delivery,
      payment,
    };

    try {
      const order = db.createOrder(orderData);
      this.showNotification(`Заказ #${order.id} успешно оформлен!`);
      this.closeCheckout();
      this.updateCartDisplay();

      // Показываем информацию о заказе
      this.showOrderConfirmation(order);
    } catch (error) {
      this.showNotification('Ошибка при оформлении заказа. Попробуйте еще раз.');
      console.error('Order error:', error);
    }
  }

  showOrderConfirmation(order) {
    const deliveryMethod = db.getDeliveryMethods().find(m => m.id === order.delivery);
    const paymentMethod = db.getPaymentMethods().find(m => m.id === order.payment);

    // confirmation-modal styles???
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'confirmation-modal';
    confirmationModal.innerHTML = `
      <div class="confirmation-modal-content">
        <div class="confirmation-header">
          <h2 class="modal-text">Заказ успешно оформлен!</h2>
          <button class="close-confirmation">&times;</button>
        </div>
        <div class="confirmation-body">
          <div class="order-info">
            <h3>Информация о заказе</h3>
            <p><strong>Номер заказа:</strong> #${order.id}</p>
            <p><strong>Дата:</strong> ${new Date(order.createdAt).toLocaleDateString('ru-RU')}</p>
            <p><strong>Статус:</strong> ${this.getOrderStatusText(order.status)}</p>
          </div>
          
          <div class="delivery-info">
            <h3>Доставка</h3>
            <p><strong>Способ:</strong> ${deliveryMethod.icon} ${deliveryMethod.name}</p>
            <p><strong>Стоимость:</strong> $${deliveryMethod.price}</p>
          </div>
          
          <div class="payment-info">
            <h3>Оплата</h3>
            <p><strong>Способ:</strong> ${paymentMethod.icon} ${paymentMethod.name}</p>
          </div>
          
          <div class="total-info">
            <h3>Итого к оплате</h3>
            <p class="total-amount">$${order.total.toFixed(2)}</p>
          </div>
        </div>
        <div class="confirmation-footer">
          <button class="btn close-confirmation">Закрыть</button>
        </div>
      </div>
    `;

    document.body.appendChild(confirmationModal);
    confirmationModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1002;
    `;

    // Обработчики закрытия
    const closeBtn = confirmationModal.querySelector('.close-confirmation');
    closeBtn.addEventListener('click', () => {
      confirmationModal.remove();
      style.remove();
    });

    confirmationModal.addEventListener('click', e => {
      if (e.target === confirmationModal) {
        confirmationModal.remove();
        style.remove();
      }
    });
  }

  getOrderStatusText(status) {
    const statusMap = {
      pending: 'Ожидает обработки',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    };
    return statusMap[status] || status;
  }

  showNotification(message) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Инициализируем менеджер корзины
export const cartManager = new CartManager();
