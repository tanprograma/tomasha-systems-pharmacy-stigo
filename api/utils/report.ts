import { SaleModel } from '../models/sale';
import { PurchaseModel } from '../models/purchase';
import { RequestModel } from '../models/request';
import { InventoryModel } from '../models/inventory';
import { ProductModel } from '../models/product';
export default class Report {
  static Sale = SaleModel;
  static Purchase = PurchaseModel;
  static Request = RequestModel;
  static Inventory = InventoryModel;
  static Product = ProductModel;
  static ProductContainer = class {
    [product: string]: {
      product: string;
      _id: string;
      unit: string;
      quantity: number;
    };
  };
  static productName(id: string, products: { _id: string; name: string }[]) {
    return products.find((p) => p._id == id)?.name as string;
  }
  static async getDispensedReport(store: any) {
    if (!store) {
      const [products, sales] = await Promise.all([
        Report.getProducts(),
        Report.Sale.find(),
      ]);

      return Report.reduceReport(products, sales);
    } else {
      const [products, sales] = await Promise.all([
        Report.getProducts(),
        Report.Sale.find({ store }),
      ]);

      return Report.reduceReport(products, sales);
    }
  }
  static reduceReport(products: any, sales: any) {
    let productContainer = new Report.ProductContainer();

    //    initialize all products as report in container
    products.forEach((p: any) => {
      productContainer[`${p._id}`] = {
        product: p.name,
        _id: p._id,
        unit: 'each',
        quantity: 0,
      };
    });

    const report = sales.reduce((cum: any, current: any) => {
      current.products.forEach((p: any) => {
        cum[p.product].quantity += p.quantity * p.unit_value;
      });
      return cum;
    }, productContainer);
    return Object.values(report);
  }

  static async getProducts() {
    return Report.Product.find();
  }
  static async getInventoryReport() {}
}
