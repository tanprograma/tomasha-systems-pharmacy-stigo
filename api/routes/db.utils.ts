import { Product } from '../../src/app/interfaces/product';
import { Store } from '../../src/app/interfaces/store';
import { InventoryModel } from '../models/inventory';
import { ProductModel } from '../models/product';
import { StoreModel } from '../models/store';

export class DBUTILS {
  static async createInventoryFromManyProducts(products: any) {
    const stores = await DBUTILS.getStores();
    if (stores.length == 0) return;
    const requests = [];
    for (let product of products) {
      for (let store of stores) {
        requests.push({
          store: store._id,
          product: product._id,
          prices: product.units.map((p: any) => {
            return { unit: p.name, value: 1 };
          }),
          quantity: 0,
        });
      }
    }

    await InventoryModel.create(requests);
  }
  static async addBeginningInventory(
    id: string,
    payload: { quantity: number }
  ) {
    const [products, stores, inventory] = await Promise.all([
      ProductModel.find(),
      StoreModel.find(),
      InventoryModel.findOne({ _id: id }),
    ]);

    inventory.quantity = payload.quantity;
    const item = await inventory.save();

    const product = DBUTILS.getProductFromID(item.product, products);
    return {
      _id: item._id,
      store: DBUTILS.findStore(item.store, stores),
      product: {
        _id: product._id,
        name: product.name,
        units: product.units,
        category: product.category,
      },
      quantity: item.quantity,
      prices: item.prices,
      expiry: item.expiry,
    };
  }
  static async addInventory(id: string, payload: { quantity: number }) {
    const [products, stores, inventory] = await Promise.all([
      ProductModel.find(),
      StoreModel.find(),
      InventoryModel.findOne({ _id: id }),
    ]);

    inventory.quantity += payload.quantity;
    const item = await inventory.save();

    const product = DBUTILS.getProductFromID(item.product, products);
    return {
      _id: item._id,
      store: DBUTILS.findStore(item.store, stores),
      product: {
        _id: product._id,
        name: product.name,
        units: product.units,
        category: product.category,
      },
      quantity: item.quantity,
      prices: item.prices,
    };
  }
  static async addPrices(
    id: string,
    payload: { unit: string; value: number }[]
  ) {
    const [products, stores, inventory] = await Promise.all([
      ProductModel.find(),
      StoreModel.find(),
      InventoryModel.findOne({ _id: id }),
    ]);

    inventory.prices = payload;
    const item = await inventory.save();

    const product = DBUTILS.getProductFromID(item.product, products);
    return {
      _id: item._id,
      store: DBUTILS.findStore(item.store, stores),
      product: {
        _id: product._id,
        name: product.name,
        units: product.units,
        category: product.category,
      },
      quantity: item.quantity,
      prices: item.prices,
      expiry: item.expiry,
    };
  }
  static async addExpiry(id: string, payload: { expiry: string }) {
    const [products, stores, inventory] = await Promise.all([
      ProductModel.find(),
      StoreModel.find(),
      InventoryModel.findOne({ _id: id }),
    ]);

    inventory.expiry = payload.expiry;
    const item = await inventory.save();

    const product = DBUTILS.getProductFromID(item.product, products);
    return {
      _id: item._id,
      store: DBUTILS.findStore(item.store, stores),
      product: {
        _id: product._id,
        name: product.name,
        units: product.units,
        category: product.category,
      },
      quantity: item.quantity,
      prices: item.prices,
      expiry: item.expiry,
    };
  }
  static findStore(id: string, stores: Store[]) {
    const store = stores.find((store) => {
      return store._id == id;
    });
    return {
      name: store?.name || '',
      _id: store?._id || '',
    };
  }
  static async createInventoryFromManyStores(stores: any) {
    const products = await DBUTILS.getProducts();
    if (products.length == 0) return;
    const requests = [];
    for (let product of products) {
      for (let store of stores) {
        requests.push({
          store: store._id,
          product: product._id,
          prices: product.units.map((p: any) => {
            return { unit: p.name, value: 1 };
          }),
          quantity: 0,
        });
      }
    }

    await InventoryModel.create(requests);
  }
  static async createInventoryFromProduct(product: any) {
    const stores = await DBUTILS.getStores();
    if (stores.length == 0) return;
    const request = stores.map((store: Store) => {
      return {
        store: store._id,
        product: product._id,
        prices: product.units.map((p: any) => {
          return { unit: p.name, value: 1 };
        }),
        quantity: 0,
      };
    });
    await InventoryModel.create(request);
  }
  static async createInventoryFromStore(store: any) {
    const products = await DBUTILS.getProducts();
    if (products.length == 0) return;
    const request = products.map((product: Product) => {
      return {
        store: store._id,
        product: product._id,
        prices: product.units.map((p: any) => {
          return { unit: p.name, value: 1 };
        }),
        quantity: 0,
      };
    });
    await InventoryModel.create(request);
  }
  static async getProducts() {
    const products = await ProductModel.find();
    return products;
  }
  static async getStores() {
    const stores = await StoreModel.find();
    return stores;
  }
  static async getStoreInventory(id: string) {
    const [inventories, products] = await Promise.all([
      InventoryModel.find({ store: id }),
      ProductModel.find(),
    ]);

    return inventories.map((item: any) => {
      const product = DBUTILS.getProductFromID(item.product, products);
      return {
        _id: item._id,
        store: item.store,
        product: {
          _id: product._id,
          name: product.name,
          units: product.units,
          category: product.category,
        },
        quantity: item.quantity,
        prices: item.prices,
      };
    });
  }
  static async getAllInventory() {
    const [inventories, products] = await Promise.all([
      InventoryModel.find(),
      ProductModel.find(),
    ]);

    return inventories.map((item: any) => {
      const product = DBUTILS.getProductFromID(item.product, products);
      //   return product;
      return {
        _id: item._id,
        store: item.store,
        product: {
          _id: product._id,
          name: product.name,
          units: product.units,
          category: product.category,
        },
        quantity: item.quantity,
        prices: item.prices,
      };
    });
  }
  static getProductFromID(id: string, products: Product[]) {
    return products.find((item) => item._id == id) as Product;
  }
}
