import { Product } from '../../src/app/interfaces/product';
import { Transfer } from '../../src/app/interfaces/request';

import { Store } from '../../src/app/interfaces/store';
import { TransactionItem } from '../../src/app/interfaces/transaction-item';
import { InventoryModel } from '../models/inventory';
import { ProductModel } from '../models/product';
import { RequestModel } from '../models/request';
import { StoreModel } from '../models/store';

export class RequestUtil {
  static async createRequest(data: any) {
    let [products, stores, request] = await Promise.all([
      RequestUtil.getProducts(),
      RequestUtil.getStores(),
      RequestModel.create(data),
    ]);

    return RequestUtil.populateRequest(request, products, stores);
  }
  static async issueRequest(requestID: string, data: any) {
    let [products, stores, request] = await Promise.all([
      RequestUtil.getProducts(),
      RequestUtil.getStores(),
      RequestModel.findOne({ _id: requestID }),
    ]);
    request.products = data;
    request.completed = true;
    const result = await request.save();
    for (let item of result.products) {
      await Promise.all([
        RequestUtil.updateInventoryQuantity(
          result.store,
          item.product,
          (0 - item.received) * item.unit_value
        ),
        RequestUtil.updateInventoryQuantity(
          result.destination,
          item.product,
          item.received * item.unit_value
        ),
      ]);
    }
    return RequestUtil.populateRequest(result, products, stores);
  }

  static async getRequests(store?: string) {
    //   get requests
    if (store != undefined) {
      let [products, stores, requests] = await Promise.all([
        RequestUtil.getProducts(),
        RequestUtil.getStores(),
        RequestModel.find({ store: store }),
      ]);
      const filteredRequests = requests.filter((item: any) => {
        return item.store == store || item.destination == store;
      });
      return RequestUtil.populateRequests(filteredRequests, products, stores);
    } else {
      let [products, stores, requests] = await Promise.all([
        RequestUtil.getProducts(),
        RequestUtil.getStores(),
        RequestModel.find(),
      ]);
      return RequestUtil.populateRequests(requests, products, stores);
    }
  }
  static async getRequestsIssued(store: string) {
    //   get requests

    let [products, stores, requests] = await Promise.all([
      RequestUtil.getProducts(),
      RequestUtil.getStores(),
      RequestModel.find({ store: store }),
    ]);

    return RequestUtil.populateRequests(requests, products, stores);
  }
  static async getRequestsReceived(store: string) {
    //   get requests

    let [products, stores, requests] = await Promise.all([
      RequestUtil.getProducts(),
      RequestUtil.getStores(),
      RequestModel.find({ destination: store }),
    ]);

    return RequestUtil.populateRequests(requests, products, stores);
  }

  static populateRequests(requests: any, products: any, stores: any) {
    requests = (requests as Transfer[]).map((request) => {
      return RequestUtil.populateRequest(request, products, stores);
    });
    return requests;
  }
  static populateRequest(request: any, products: any, stores: any) {
    return {
      store: RequestUtil.getStoreFromID(request.store, stores),
      destination: RequestUtil.getStoreFromID(request.destination, stores),
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
          product: RequestUtil.getProductFromID(
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
