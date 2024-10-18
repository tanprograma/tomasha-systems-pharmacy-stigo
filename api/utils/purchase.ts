import { Product } from '../../src/app/interfaces/product';
import { Transfer } from '../../src/app/interfaces/request';

import { Store } from '../../src/app/interfaces/store';
import { TransactionItem } from '../../src/app/interfaces/transaction-item';
import { InventoryModel } from '../models/inventory';
import { ProductModel } from '../models/product';
import { PurchaseModel } from '../models/purchase';
import { StoreModel } from '../models/store';
import { SupplierModel } from '../models/supplier';

export class PurchaseUtil {
  static async createPurchase(data: any) {
    let [products, stores, suppliers, request] = await Promise.all([
      PurchaseUtil.getProducts(),
      PurchaseUtil.getStores(),
      PurchaseUtil.getSuppliers(),
      PurchaseModel.create(data),
    ]);

    return PurchaseUtil.populateRequest(request, products, stores, suppliers);
  }
  static async receivePurchase(requestID: string, data: any) {
    let [products, stores, suppliers, request] = await Promise.all([
      PurchaseUtil.getProducts(),
      PurchaseUtil.getStores(),
      PurchaseUtil.getSuppliers(),
      PurchaseModel.findOne({ _id: requestID }),
    ]);
    request.products = data;
    request.completed = true;
    const result = await request.save();
    for (let item of result.products) {
      await PurchaseUtil.updateInventoryQuantity(
        result.destination,
        item.product,
        item.received * item.unit_value
      );
    }
    return PurchaseUtil.populateRequest(result, products, stores, suppliers);
  }

  static async getPurchases(store?: string) {
    //   get requests
    if (store != undefined) {
      let [products, stores, suppliers, requests] = await Promise.all([
        PurchaseUtil.getProducts(),
        PurchaseUtil.getStores(),
        PurchaseUtil.getSuppliers(),
        PurchaseModel.find({ destination: store }),
      ]);
      return PurchaseUtil.populateRequests(
        requests,
        products,
        stores,
        suppliers
      );
    } else {
      let [products, stores, suppliers, requests] = await Promise.all([
        PurchaseUtil.getProducts(),
        PurchaseUtil.getStores(),
        PurchaseUtil.getSuppliers(),
        PurchaseModel.find(),
      ]);
      return PurchaseUtil.populateRequests(
        requests,
        products,
        stores,
        suppliers
      );
    }
  }

  static populateRequests(
    requests: any,
    products: any,
    stores: any,
    suppliers: any
  ) {
    requests = (requests as Transfer[]).map((request) => {
      return PurchaseUtil.populateRequest(request, products, stores, suppliers);
    });
    return requests;
  }
  static populateRequest(
    request: any,
    products: any,
    stores: any,
    suppliers: any
  ) {
    return {
      supplier: PurchaseUtil.getStoreFromID(request.supplier, suppliers),
      destination: PurchaseUtil.getStoreFromID(request.destination, stores),
      _id: request._id,
      createdAt: request.createdAt,
      completed: request.completed,
      products: (request.products as TransactionItem[]).map((item) => {
        return {
          quantity: item.quantity,
          received: item.received,
          unit: item.unit,
          unit_value: item.unit_value,
          price: item.price,
          product: PurchaseUtil.getProductFromID(
            item.product as string,
            products as Product[]
          ),
        };
      }),
    };
  }
  static getStoreFromID(id: string, stores: Store[]) {
    return stores.find((store) => store._id == id) as Store;
  }
  static async getStores() {
    return StoreModel.find();
  }
  static async getSuppliers() {
    return SupplierModel.find();
  }
  static async getProducts() {
    return ProductModel.find();
  }
  static async updateInventoryQuantity(
    storeID: string,
    productID: string,
    quantity: number
  ) {
    const inventory = await InventoryModel.findOne({
      store: storeID,
      product: productID,
    });
    inventory.quantity += quantity;
    return inventory.save();
  }
  static getProductID(id: string, products: Product[]) {
    return products.find((product) => product._id == id)?._id as string;
  }
  static getProductFromID(id: string, products: Product[]) {
    return products.find((product) => product._id == id) as Product;
  }
}
