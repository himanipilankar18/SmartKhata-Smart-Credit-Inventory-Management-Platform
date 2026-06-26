// Mock services — swap with REST calls later.
import {
  customers, products, transactions, notifications,
  dashboardSummary, salesTrend, categoryBreakdown,
  type Customer, type Product, type Transaction, type AppNotification,
} from "@/data/mocks";

const delay = <T,>(data: T, ms = 250): Promise<T> =>
  new Promise(res => setTimeout(() => res(data), ms));

export const dashboardService = {
  getSummary: () => delay(dashboardSummary),
  getSalesTrend: () => delay(salesTrend),
  getCategoryBreakdown: () => delay(categoryBreakdown),
  getRecentTransactions: () => delay(transactions.slice(0, 6)),
  getFollowUps: () => delay(customers.filter(c => c.outstanding > 10000).slice(0, 6)),
};

export const customerService = {
  list: () => delay(customers),
  get: (id: string) => delay(customers.find(c => c.id === id)),
  create: (data: Partial<Customer>) => delay({ ...data, id: `C${Date.now()}` } as Customer),
};

export const inventoryService = {
  list: () => delay(products),
  get: (id: string) => delay(products.find(p => p.id === id)),
  lowStock: () => delay(products.filter(p => p.stock < p.reorderLevel)),
  create: (data: Partial<Product>) => delay({ ...data, id: `P${Date.now()}` } as Product),
};

export const transactionService = {
  list: () => delay(transactions),
  byCustomer: (id: string) => delay(transactions.filter(t => t.customerId === id)),
  create: (data: Partial<Transaction>) => delay({ ...data, id: `T${Date.now()}` } as Transaction),
};

export const notificationService = {
  list: () => delay(notifications),
  markAllRead: () => delay(true),
};

export const reportService = {
  salesTrend: () => delay(salesTrend),
  categoryBreakdown: () => delay(categoryBreakdown),
};

export type { Customer, Product, Transaction, AppNotification };
