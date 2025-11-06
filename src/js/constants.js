// Константы для статусов заказа и текстов
export const ORDER_STATUS = {
  pending: { label: 'Ожидает обработки', class: 'status-pending' },
  processing: { label: 'В обработке', class: 'status-processing' },
  shipped: { label: 'Отправлен', class: 'status-shipped' },
  delivered: { label: 'Доставлен', class: 'status-delivered' },
  cancelled: { label: 'Отменен', class: 'status-cancelled' },
};

export const TEXTS = {
  ADMIN_PANEL_TITLE: 'Админ-панель: Заказы',
  NO_ORDERS: 'Заказов пока нет',
  CUSTOMER: 'Клиент',
  PHONE: 'Телефон',
  EMAIL: 'Email',
  DELIVERY: 'Доставка',
  PAYMENT: 'Оплата',
  TOTAL: 'Итого',
  ORDER_CREATED: id => `Заказ #${id} успешно оформлен!`,
  ORDER_ERROR: 'Ошибка при оформлении заказа. Попробуйте еще раз.',
};
