// Имитация базы данных для товаров и заказов
export class Database {
  constructor() {
    this.products = [
      {
        id: 1,
        name: "Bose portable Smart speaker",
        category: "Smart home",
        price: 399.00,
        image: "img/products/Bose_portable_Smart_speaker_desk.png",
        description: "Портативная умная колонка с голосовым управлением"
      },
      {
        id: 2,
        name: "SoundLink Flex Bluetooth speaker",
        category: "Portable bluetooth",
        price: 149.00,
        image: "img/products/Portable_bluetooth_desk.png",
        description: "Портативная Bluetooth колонка с водонепроницаемостью"
      },
      {
        id: 3,
        name: "SoundLink Color Bluetooth speaker II",
        category: "Portable bluetooth",
        price: 129.00,
        image: "img/products/Portable_bluetooth_II_desk.png",
        description: "Цветная портативная Bluetooth колонка"
      }
    ];

    this.cart = [];
    this.orders = [];
    this.paymentMethods = [
      { id: 'card', name: 'Банковская карта', icon: '💳' },
      { id: 'cash', name: 'Наличные при получении', icon: '💵' },
      { id: 'online', name: 'Онлайн оплата', icon: '🌐' }
    ];
    this.deliveryMethods = [
      { id: 'ukrpost', name: 'Укрпошта', price: 50, icon: '📮' },
      { id: 'novapost', name: 'Нова пошта', price: 80, icon: '🚚' }
    ];
  }

  // Получить все товары
  getProducts() {
    return this.products;
  }

  // Получить товар по ID
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  // Добавить товар в корзину
  addToCart(productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) return false;

    const existingItem = this.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        productId,
        quantity,
        addedAt: new Date()
      });
    }
    return true;
  }

  // Удалить товар из корзины
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.productId !== productId);
  }

  // Обновить количество товара в корзине
  updateCartItemQuantity(productId, quantity) {
    const item = this.cart.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  // Получить корзину
  getCart() {
    return this.cart.map(cartItem => {
      const product = this.getProductById(cartItem.productId);
      return {
        ...cartItem,
        product,
        totalPrice: product.price * cartItem.quantity
      };
    });
  }

  // Получить общую стоимость корзины
  getCartTotal() {
    return this.cart.reduce((total, item) => {
      const product = this.getProductById(item.productId);
      return total + (product.price * item.quantity);
    }, 0);
  }

  // Очистить корзину
  clearCart() {
    this.cart = [];
  }

  // Создать заказ
  createOrder(orderData) {
    const order = {
      id: Date.now(),
      items: [...this.cart],
      total: this.getCartTotal(),
      delivery: orderData.delivery,
      payment: orderData.payment,
      customerInfo: orderData.customerInfo,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.orders.push(order);
    this.clearCart();
    return order;
  }

  // Получить все заказы
  getOrders() {
    return this.orders;
  }

  // Получить способы оплаты
  getPaymentMethods() {
    return this.paymentMethods;
  }

  // Получить способы доставки
  getDeliveryMethods() {
    return this.deliveryMethods;
  }
}

// Создаем глобальный экземпляр базы данных
export const db = new Database();
