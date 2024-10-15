import { Schema, model } from 'mongoose';
import { Inventory } from '../../src/app/interfaces/inventory';
const priceSchema = new Schema<{ name: string; value: number }>(
  {
    unit: String,
    value: Number,
  },
  { _id: false }
);
const schema = new Schema<Inventory>({
  store: String,
  product: String,
  prices: [priceSchema],
  quantity: Number,
  expiry: String,
});
export const InventoryModel = model('Inventories', schema);
