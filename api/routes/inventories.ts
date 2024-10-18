import Express from 'express';
import { InventoryModel } from '../models/inventory';
import { DBUTILS } from './db.utils';
const router = Express.Router();
router.get('', async (req, res) => {
  const items = await DBUTILS.getAllInventory();
  res.send(items);
});
router.get('/store/:id', async (req, res) => {
  const items = await DBUTILS.getStoreInventory(req.params.id);
  res.send(items);
});
router.patch('/update-price/:id', async (req, res) => {
  const result = await DBUTILS.addPrices(req.params.id, req.body);
  res.send({ result, status: true });
});
router.patch('/update-expiry/:id', async (req, res) => {
  const result = await DBUTILS.addExpiry(req.params.id, req.body);
  res.send({ result, status: true });
});

router.patch('/beginning-quantity/:id', async (req, res) => {
  const result = await DBUTILS.addBeginningInventory(req.params.id, req.body);
  res.send({ result, status: true });
});
export default router;
