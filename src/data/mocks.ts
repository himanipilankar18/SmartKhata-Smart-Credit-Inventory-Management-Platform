// Centralized mock data for SmartKhata.
export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  outstanding: number; // positive = customer owes us
  lastActivity: string; // ISO
  totalCredit: number;
  totalPaid: number;
  tags: string[];
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  cost: number;
  reorderLevel: number;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  customerId: string;
  customerName: string;
  type: "credit" | "payment" | "sale" | "expense";
  amount: number;
  note: string;
  date: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  category: "payment" | "stock" | "system" | "reminder";
  read: boolean;
  date: string;
};

const FIRST = ["Ramesh","Suresh","Aarti","Vikram","Neha","Anil","Pooja","Mohan","Kavita","Ravi","Sunita","Deepak","Manju","Amit","Priya","Sanjay","Asha","Karan","Meena","Yash","Geeta","Ajay","Rina","Nitin","Lata"];
const LAST = ["Kumar","Sharma","Patel","Verma","Singh","Gupta","Reddy","Iyer","Khan","Das","Joshi","Mehta","Nair","Rao","Pillai","Kapoor","Bose","Chopra","Bhatt","Saxena"];
const AREAS = ["MG Road","Sector 14","Civil Lines","Lajpat Nagar","Andheri West","Indira Nagar","Adyar","Koramangala","Banjara Hills","Gomti Nagar"];
const TAGS_POOL = ["Regular", "Wholesale", "VIP", "New", "Risky", "Daily"];

const seedRand = (seed: number) => {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
};
const rand = seedRand(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const between = (a: number, b: number) => Math.floor(rand() * (b - a + 1)) + a;
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const customers: Customer[] = Array.from({ length: 25 }, (_, i) => {
  const name = `${pick(FIRST)} ${pick(LAST)}`;
  const credit = between(0, 80000);
  const paid = between(0, credit);
  return {
    id: `C${1000 + i}`,
    name,
    phone: `+91 9${between(100000000, 899999999)}`,
    address: `${between(1, 250)}, ${pick(AREAS)}`,
    outstanding: credit - paid,
    lastActivity: daysAgo(between(0, 30)),
    totalCredit: credit,
    totalPaid: paid,
    tags: [pick(TAGS_POOL)],
  };
});

const CATEGORIES = ["Grocery", "Dairy", "Snacks", "Personal Care", "Beverages", "Stationery", "Hardware", "Medical"];
const UNITS = ["pcs", "kg", "ltr", "box", "pack"];
const PRODUCT_NAMES = [
  "Basmati Rice 1kg","Wheat Flour 5kg","Toor Dal 1kg","Sunflower Oil 1L","Amul Butter 100g",
  "Britannia Bread","Maggi Noodles","Tata Salt 1kg","Sugar 1kg","Tea Powder 500g",
  "Coffee 200g","Milk 500ml","Curd 400g","Paneer 200g","Ghee 500g",
  "Lays Chips","Kurkure","Coca Cola 1L","Pepsi 1L","Bisleri 1L",
  "Colgate 200g","Lifebuoy Soap","Dettol 250ml","Surf Excel 1kg","Vim Bar",
  "Notebook A4","Pen Pack","Stapler","Tape","Glue Stick",
  "Screwdriver","Hammer","Nails 1kg","Wire 10m","Bulb 9W",
  "Paracetamol","Crocin","Band-Aid","Vicks","ORS Sachet",
];
export const products: Product[] = PRODUCT_NAMES.map((name, i) => {
  const cost = between(20, 600);
  const stock = between(0, 120);
  return {
    id: `P${2000 + i}`,
    name,
    sku: `SKU-${2000 + i}`,
    category: pick(CATEGORIES),
    stock,
    unit: pick(UNITS),
    price: cost + between(5, 80),
    cost,
    reorderLevel: 15,
    updatedAt: daysAgo(between(0, 14)),
  };
});

const NOTES = ["Credit for grocery","Partial payment received","Monthly purchase","Settled previous bill","Festival order","Wholesale order","Returned items adjustment","Cash sale","Daily expense","Bill payment"];
export const transactions: Transaction[] = Array.from({ length: 100 }, (_, i) => {
  const c = pick(customers);
  const type = pick(["credit","payment","sale","expense"] as const);
  return {
    id: `T${3000 + i}`,
    customerId: c.id,
    customerName: c.name,
    type,
    amount: between(100, 25000),
    note: pick(NOTES),
    date: daysAgo(between(0, 60)),
  };
}).sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const notifications: AppNotification[] = [
  { id: "N1", title: "Payment received", body: "Ramesh Kumar paid ₹2,500", category: "payment", read: false, date: daysAgo(0) },
  { id: "N2", title: "Low stock alert", body: "Toor Dal 1kg below reorder level", category: "stock", read: false, date: daysAgo(0) },
  { id: "N3", title: "Follow up reminder", body: "Neha Sharma has ₹12,400 outstanding for 21 days", category: "reminder", read: false, date: daysAgo(1) },
  { id: "N4", title: "Backup completed", body: "Daily backup completed successfully", category: "system", read: true, date: daysAgo(1) },
  { id: "N5", title: "Payment received", body: "Vikram Singh paid ₹4,800", category: "payment", read: true, date: daysAgo(2) },
  { id: "N6", title: "Low stock alert", body: "Sunflower Oil 1L below reorder level", category: "stock", read: true, date: daysAgo(2) },
  { id: "N7", title: "Reminder sent", body: "Reminder SMS sent to 4 customers", category: "reminder", read: true, date: daysAgo(3) },
  { id: "N8", title: "New customer added", body: "Pooja Patel was added to your ledger", category: "system", read: true, date: daysAgo(4) },
  { id: "N9", title: "Payment received", body: "Anil Verma paid ₹1,250", category: "payment", read: true, date: daysAgo(5) },
  { id: "N10", title: "Low stock alert", body: "Britannia Bread below reorder level", category: "stock", read: true, date: daysAgo(6) },
];

export const dashboardSummary = {
  cashInHand: 48250,
  bankBalance: 184300,
  totalOutstanding: customers.reduce((s, c) => s + c.outstanding, 0),
  todayCollection: 12450,
  todayExpenses: 3200,
  todaySales: 18900,
  lowStockCount: products.filter(p => p.stock < p.reorderLevel).length,
  followUps: customers.filter(c => c.outstanding > 10000).length,
};

export const salesTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  sales: between(8000, 25000),
  collection: between(5000, 18000),
}));

export const categoryBreakdown = CATEGORIES.map(c => ({
  category: c,
  value: between(5000, 40000),
}));
