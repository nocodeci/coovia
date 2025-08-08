export interface KPIs {
  revenueToday: number;
  revenue7d: number;
  ordersToday: number;
  orders7d: number;
}

export interface Order {
  id: string;
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  customerName: string;
  customerEmail: string;
}

export interface DashboardData {
  kpis: KPIs;
  recentOrders: Order[];
}
