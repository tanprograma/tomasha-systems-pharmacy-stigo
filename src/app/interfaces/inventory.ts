import { Product } from './product';
import { Store } from './store';

export interface Inventory {
  _id?: string;
  store: string | Store;
  product: string | Product;
  expiry?: string;
  quantity: number;
  prices: { unit: string; value: number }[];
}
