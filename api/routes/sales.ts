import Express from 'express';
import { SaleUtil } from '../utils/sale';
import { SaleModel } from '../models/sale';
import { Sale } from '../../src/app/interfaces/sale';
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
router.patch('/date/:priordate/:newdate', async (req, res) => {
  // changing date for dispensed items
  const priorDate = req.params.priordate;

  try {
    const allSales = await SaleModel.find();

    const newDate = new Date(req.params.newdate).toISOString();
    const sales = allSales.filter((sale: any) => {
      const date = getDateString(sale.createdAt as string);

      return date == priorDate;
    });

    console.log({ sales: sales.length });
    for (let item of sales) {
      const s = await SaleModel.findOneAndDelete({ _id: item._id });

      await SaleModel.create({
        store: item.store,
        products: item.products,
        discount: item.discount || 0,
        customer: item.customer,
        createdAt: newDate,
      });
    }
    res.send({ status: true });
  } catch (error) {
    res.send({ status: false });
  }
});
function getDateString(d: string) {
  const date = new Date(d);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}
export default router;
