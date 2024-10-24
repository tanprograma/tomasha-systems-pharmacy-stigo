import Express from 'express';
import { SaleUtil } from '../utils/sale';
import { SaleModel } from '../models/sale';
const router = Express.Router();
router.get('/', async (req, res) => {
  const sales = await SaleUtil.getAllSales();
  res.send(sales);
});
router.get('/store/:id', async (req, res) => {
  const sales = await SaleUtil.getAllSales(req.params.id);
  res.send(sales);
});
router.post('/create', async (req, res) => {
  const sale = await SaleUtil.createSale(req.body);
  res.send({ status: true, result: sale });
});
router.post('/migrate', async (req, res) => {
  const sale = await SaleUtil.migrateSale(req.body);
  res.send(sale);
});
router.post('/createmany', async (req, res) => {
  const sales = await SaleUtil.createSales(req.body);
  res.send({ status: true, result: sales });
});
export default router;
