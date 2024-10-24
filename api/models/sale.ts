import { Schema, model } from 'mongoose';
import { Sale } from '../../src/app/interfaces/sale';
import { TransactionItem } from '../../src/app/interfaces/transaction-item';
const productSchema = new Schema<TransactionItem>(
  {
    product: String,
    quantity: Number,
    unit: String,
    unit_value: Number,
    price: Number,
  },
  { _id: false }
);
const schema = new Schema<Sale>(
  {
    store: String,
    products: [productSchema],
    discount: Number,
    customer: String,
  },
  { timestamps: true }
);
export const SaleModel = model('Sale', schema);
