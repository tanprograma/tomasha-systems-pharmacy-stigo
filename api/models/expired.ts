import { Schema, model } from 'mongoose';
import { Expired } from '../../src/app/interfaces/expired';

const schema = new Schema<Expired>({
  name: { type: String, lowercase: true },
  product_id: String,
  unit: String,
  quantity: String,
  expiry: Date,
  status: { type: Boolean, default: () => false },
});
export const ExpiredModel = model('Expired', schema);
