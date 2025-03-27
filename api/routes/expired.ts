import Express from 'express';
import { ExpiredModel } from '../models/expired';
import { ProductModel } from '../models/product';
import { Expired } from '../../src/app/interfaces/expired';
import { Product } from '../../src/app/interfaces/product';
const router = Express.Router();
router.get('', async (req, res) => {
  const [items, products] = await Promise.all([
    ExpiredModel.find(),
    ProductModel.find(),
  ]);

  res.send(InsertProductNameInExpired(items, products));
});
router.post('/create', async (req, res) => {
  const item = await ExpiredModel.create(req.body);

  res.send({ result: item, status: true });
});
router.post('/createmany', async (req, res) => {
  const items = await ExpiredModel.create(req.body);

  res.send({ result: items, status: true });
});
async function getProducts() {
  const products = await ProductModel.find();
  return products;
}
function InsertProductNameInExpired(items: any[], products: Product[]) {
  return items.map((item) => ({
    ...item._doc,
    name: products.find((p) => p._id == item._doc.product_id)?.name,
  }));
}
export default router;
