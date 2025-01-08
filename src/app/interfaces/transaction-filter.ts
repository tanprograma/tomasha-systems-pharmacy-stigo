export interface TransactionFilter {
  date: string;
  product: string;
  category: string;
}
export interface RequestFilter {
  date: string;
  store: string;
  destination: string;
}
export interface NewRequestFilter {
  date: string;
  store: string;
  destination: string;
  product: string;
}
export interface PurchaseFilter {
  date: string;
  supplier: string;
  destination: string;
}
export interface StatisticsFilter {
  start_date?: string;
  end_date?: string;
  product: string;
  category: string;
}
