import Express from 'express';
import Report from '../utils/report';
const router = Express.Router();
router.get('/dispensed', async (req, res) => {
  const store = req.query['store'];
  console.log(store);
  try {
    const dispensed = await Report.getDispensedReport(store);
    res.send(dispensed);
  } catch (error: any) {
    console.log(error.message);
    res.send([]);
  }
});

export default router;
