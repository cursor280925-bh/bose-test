import { db } from '../database.js';

export const adminService = {
  getOrders: () => db.getOrders(),
  getDeliveryMethods: () => db.getDeliveryMethods(),
  getPaymentMethods: () => db.getPaymentMethods(),
  getProductById: id => db.getProductById(id)
};
