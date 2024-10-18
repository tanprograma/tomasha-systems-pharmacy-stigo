import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { InventoryService } from './inventory.service';
import { StoreService } from './store.service';
import { HttpService } from './http.service';
import { UrlService } from './url.service';
import { catchError, forkJoin } from 'rxjs';
import { Store } from '../interfaces/store';
import { Inventory } from '../interfaces/inventory';
import { RequestService } from './request.service';
import { Sale } from '../interfaces/sale';
import { SalesService } from './sales.service';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product';
import { UnitService } from './unit.service';
import { Unit } from '../interfaces/unit';
import { CategoryService } from './category.service';
import { Category } from '../interfaces/category';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { Transfer } from '../interfaces/request';
import { TransactionItem } from '../interfaces/transaction-item';
import {
  PurchaseFilter,
  RequestFilter,
  TransactionFilter,
} from '../interfaces/transaction-filter';
import { Comparable } from '../interfaces/comparable';
import { Purchase } from '../interfaces/purchase';
import { Supplier } from '../interfaces/supplier';
import { SupplierService } from './supplier.service';
import { PurchaseService } from './purchase.service';
import { InventoryFilter } from '../interfaces/inventory-filter';
import { User } from '../interfaces/user';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { StatisticsSummary } from '../interfaces/statistics-summary';
import { StatisticsService } from './statistics.service';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  router = inject(Router);
  inventoryService = inject(InventoryService);
  storeService = inject(StoreService);
  salesService = inject(SalesService);
  requestService = inject(RequestService);
  productService = inject(ProductService);
  unitService = inject(UnitService);
  loginService = inject(LoginService);
  supplierService = inject(SupplierService);
  categoryService = inject(CategoryService);
  purchaseService = inject(PurchaseService);
  statisticsService = inject(StatisticsService);
  http = inject(HttpService);
  document = inject(DOCUMENT);
  appID = inject(PLATFORM_ID);
  BASE_URL =
    environment.env == 'development'
      ? environment.origin
      : this.document.location.origin;
  INVENTORY_API = `${this.BASE_URL}/api/inventories`;
  STORE_API = `${this.BASE_URL}/api/stores`;
  SALE_API = `${this.BASE_URL}/api/sales`;
  UNIT_API = `${this.BASE_URL}/api/units`;
  PRODUCT_API = `${this.BASE_URL}/api/products`;
  CATEGORY_API = `${this.BASE_URL}/api/categories`;
  REQUEST_API = `${this.BASE_URL}/api/requests`;
  SUPPLIER_API = `${this.BASE_URL}/api/suppliers`;
  PURCHASE_API = `${this.BASE_URL}/api/purchases`;
  USER_API = `${this.BASE_URL}/api/users`;
  storeConfig = signal<{ store_name: string; store_id: string; user?: User }>({
    store_id: '',
    store_name: '',
  });
  constructor() {}
  // session management
  setCurrentUser(data: User) {
    sessionStorage.setItem('user', JSON.stringify(data));
    // this.storeConfig.update((s) => ({ ...s, user: data }));
  }
  setCurrentStore(data: { store_name: string; store_id: string }) {
    sessionStorage.setItem('store', JSON.stringify(data));
  }
  getCurrentUser() {
    if (isPlatformBrowser(this.appID)) {
      const user = sessionStorage.getItem('user');
      if (user == null) {
        return undefined;
      } else {
        return JSON.parse(user) as User;
      }
    }
    return undefined;
  }
  getCurrentStore() {
    const store = sessionStorage.getItem('store');
    if (store == null) {
      return undefined;
    } else {
      return JSON.parse(store) as { store_name: string; store_id: string };
    }
  }

  getSession() {}
  endSession() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  // isSession() {
  //   return (
  //     (this.getCurrentStore() as { store_name: string; store_id: string })
  //       .user != undefined
  //   );
  // }
  //utilities
  productName(product: Product | string) {
    return this.parseProductName(product);
  }
  amount(item: TransactionItem) {
    return this.calcAmount(item.quantity, item.price as number);
  }
  subtotal(items: TransactionItem[]) {
    return this.calSubtotal(items);
  }
  private parseProductName(product: Product | string) {
    return (product as Product).name;
  }
  private calcAmount(quantity: number, price: number) {
    return quantity * price;
  }
  private calSubtotal(items: TransactionItem[]) {
    return items.reduce((acc, curr) => {
      return acc + this.amount(curr);
    }, 0);
  }
  // statistics code
  getStatistics() {
    return forkJoin([
      this.getInventories(),
      this.getPurchases(),
      this.getSales(),
      this.getProducts(),
    ]);
  }
  summarizeDispensed(sales: Sale[]) {
    return this.statisticsService.getDispensedSummary(sales);
  }
  summarizePurchased(sales: Purchase[]) {
    return this.statisticsService.getPurchaseSummary(sales);
  }
  summarizeInventory(sales: Inventory[]) {
    return this.statisticsService.getInventorySummary(sales);
  }
  // summarizeStatistics(
  //   products: Product[],
  //   inventories: Inventory[],
  //   purchases: Purchase[],
  //   dispensed: Sale[]
  // ): StatisticsSummary[] {
  //   const sInventories = this.statisticsService.summarizeInventories(
  //     inventories,
  //     products
  //   );
  //   const sPurchases = this.statisticsService.summarizePurchased(
  //     purchases,
  //     products
  //   );
  //   const sDispensed = this.statisticsService.summarizeDispensed(
  //     dispensed,
  //     products
  //   );
  //   return products.map((item) => {
  //     return {
  //       product: item.name,
  //       category: item.category,
  //       quantity: this.statisticsService.findSummary(
  //         sInventories,
  //         item._id as string
  //       ),
  //       dispensed: this.statisticsService.findSummary(
  //         sDispensed,
  //         item._id as string
  //       ),
  //       purchased: this.statisticsService.findSummary(
  //         sPurchases,
  //         item._id as string
  //       ),
  //       unit: this.getLargeUnit(item).name,
  //       unit_value: this.getLargeUnit(item).value,
  //     };
  //   });
  // }
  getLargeUnit(product: Product) {
    return product.units.sort((a, b) => {
      return this.descending(a.value, b.value);
    })[0];
  }
  // user code{}
  login(data: User) {
    return this.loginService.login(`${this.USER_API}/login`, data);
  }
  createUser(data: User) {
    return this.loginService.createUser(`${this.USER_API}/create`, data);
  }
  createUsers(data: User[]) {
    return this.loginService.createManyUser(
      `${this.USER_API}/createmany`,
      data
    );
  }
  logOut() {
    this.endSession();
  }
  // sales code
  getSales() {
    return this.salesService.getSales(this.SALE_API);
  }
  getShopSales() {
    return this.salesService.getSales(
      `${this.SALE_API}/store/${
        (
          this.getCurrentStore() as {
            store_name: string;
            store_id: string;
          } as { store_name: string; store_id: string }
        ).store_id
      }`
    );
  }

  createSale(data: Sale) {
    return this.salesService.postSale(`${this.SALE_API}/create`, data);
  }
  createSales(data: Sale[]) {
    return this.salesService.postSales(`${this.SALE_API}/createmany`, data);
  }
  // requests
  getAllRequests() {
    return this.requestService.getRequests(this.REQUEST_API);
  }
  getShopRequests() {
    return this.requestService.getRequests(
      `${this.REQUEST_API}/store/${
        (this.getCurrentStore() as { store_name: string; store_id: string })
          .store_id
      }`
    );
  }
  getShopIssuedRequests() {
    return this.requestService.getRequests(
      `${this.REQUEST_API}/store/issued/${
        (this.getCurrentStore() as { store_name: string; store_id: string })
          .store_id
      }`
    );
  }
  getShopReceivedRequests() {
    return this.requestService.getRequests(
      `${this.REQUEST_API}/store/received/${
        (this.getCurrentStore() as { store_name: string; store_id: string })
          .store_id
      }`
    );
  }
  createRequest(data: Transfer) {
    return this.requestService.postRequest(`${this.REQUEST_API}/create`, data);
  }
  issueRequest(inventoryID: string, data: TransactionItem[]) {
    return this.requestService.issueRequest(
      `${this.REQUEST_API}/issue/${inventoryID}`,
      data
    );
  }
  // purchase code
  getPurchases() {
    return this.purchaseService.getPurchases(this.PURCHASE_API);
  }
  getShopPurchases() {
    return this.purchaseService.getPurchases(
      `${this.PURCHASE_API}/store/${
        (this.getCurrentStore() as { store_name: string; store_id: string })
          .store_id
      }`
    );
  }
  createPurchase(data: Purchase) {
    return this.purchaseService.postPurchase(
      `${this.PURCHASE_API}/create`,
      data
    );
  }
  receivePurchase(purchaseID: string, data: TransactionItem[]) {
    return this.purchaseService.receivePurchase(
      `${this.PURCHASE_API}/receive/${purchaseID}`,
      data
    );
  }
  // inventory code
  getInventories() {
    return this.inventoryService.getInventory(`${this.INVENTORY_API}`);
  }
  getShopInventories() {
    return this.inventoryService.getInventory(
      `${this.INVENTORY_API}/store/${
        (this.getCurrentStore() as { store_name: string; store_id: string })
          .store_id
      }`
    );
  }
  updateInventory(action: {
    type: string;
    inventoryID: string;
    data: unknown;
  }) {
    switch (action.type) {
      case 'inventory': {
        return this.inventoryService.addBegginingInventory(
          `${this.INVENTORY_API}/beginning-quantity/${action.inventoryID}`,
          action.data as { quantity: number }
        );
      }
      case 'prices': {
        return this.inventoryService.editPrice(
          `${this.INVENTORY_API}/update-price/${action.inventoryID}`,
          action.data as { unit: string; value: number }[]
        );
      }
      case 'expiry': {
        return this.inventoryService.addExpiry(
          `${this.INVENTORY_API}/update-expiry/${action.inventoryID}`,
          action.data as { expiry: string }
        );
      }

      default: {
        throw new Error('wrong action');
      }
    }
  }
  editInventoryPrice(
    inventoryID: string,
    data: { unit: string; value: number }[]
  ) {
    return this.inventoryService.editPrice(
      `${this.INVENTORY_API}/update-price/${inventoryID}`,
      data
    );
  }
  // redundant
  addBegginingInventory(inventoryID: string, data: { quantity: number }) {
    return this.inventoryService.addBegginingInventory(
      `${this.INVENTORY_API}/beginning-quantity/${inventoryID}`,
      data
    );
  }
  // redundant
  addExpiry(inventoryID: string, data: { expiry: string }) {
    return this.inventoryService.addExpiry(
      `${this.INVENTORY_API}/beginning-quantity/${inventoryID}`,
      data
    );
  }
  // stores
  getStores() {
    return this.storeService.getStores(`${this.STORE_API}`);
  }
  postStore(data: Store) {
    return this.storeService.postStore(`${this.STORE_API}/create`, data);
  }
  postStores(data: Store[]) {
    return this.storeService.postStores(`${this.STORE_API}/createmany`, data);
  }
  // supplier code
  getSuppliers() {
    return this.supplierService.getSuppliers(this.SUPPLIER_API);
  }
  postSupplier(data: Supplier) {
    return this.supplierService.postSupplier(
      `${this.SUPPLIER_API}/create`,
      data
    );
  }
  postSuppliers(data: Supplier[]) {
    return this.supplierService.postSuppliers(
      `${this.SUPPLIER_API}/createmany`,
      data
    );
  }
  // products code
  getProducts() {
    return this.productService.getProducts(`${this.PRODUCT_API}`);
  }
  createProduct(data: Product) {
    return this.productService.postProduct(`${this.PRODUCT_API}/create`, data);
  }
  createProducts(data: Product[]) {
    return this.productService.postProducts(
      `${this.PRODUCT_API}/createmany`,
      data
    );
  }
  // units code
  getUnits() {
    return this.unitService.getUnits(`${this.UNIT_API}`);
  }
  createUnit(data: Unit) {
    return this.unitService.postUnit(`${this.UNIT_API}/create`, data);
  }
  createUnits(data: Unit[]) {
    return this.unitService.postUnits(`${this.UNIT_API}/createmany`, data);
  }
  // category code
  getCategories() {
    return this.categoryService.getCategories(`${this.CATEGORY_API}`);
  }
  createCategory(data: Category) {
    return this.categoryService.postCategory(
      `${this.CATEGORY_API}/create`,
      data
    );
  }
  createCategories(data: Category[]) {
    return this.categoryService.postCategories(
      `${this.CATEGORY_API}/createmany`,
      data
    );
  }
  sortTransactions<
    K extends { createdAt?: string; products: TransactionItem[] }
  >(
    data: WritableSignal<K[]>,
    filterObject: WritableSignal<TransactionFilter>,
    flag?: 'asc' | 'desc'
  ) {
    // for sorting on date, product and category
    const f_1 = data().filter((item) => {
      if (filterObject().date == '') {
        // console.log('date is empty');
        return true;
      }
      const date_1 = new Date(filterObject().date).toLocaleDateString();

      const date_2 = new Date(item.createdAt as string).toLocaleDateString();
      // console.log({ date_2 });

      // console.log('checked data');
      return date_1 == date_2;
    });
    // console.log({ f_1 });

    const f_2 = f_1.reduce((cum: TransactionItem[], curr) => {
      const products = curr.products.map((p) => ({
        ...p,
        date: curr.createdAt,
      }));
      cum.push(...products);
      return cum;
    }, []);
    // console.log({ f_2 });

    const f_3 = f_2.filter((item) => {
      const pro = filterObject().product;
      const cate = filterObject().category;
      if (pro == '' && cate == '') {
        // console.log('not checking product and category');
        return true;
      }
      const p = item.product as Product;
      if (pro != '' && cate == '') {
        // console.log('checking product not category');
        p.name.includes(pro);
      }
      if (pro == '' && cate != '') {
        // console.log('checking category not product');
        return p.category.includes(cate);
      }

      // console.log('both pattern checked');
      return p.name.includes(pro) && p.category.includes(cate);
    });
    // console.log(f_3);
    if (flag == undefined || flag == 'desc') {
      return f_3.sort((a, b) => {
        const date_1 = new Date(a.date as string);
        const date_2 = new Date(b.date as string);
        return this.descending(date_1, date_2);
        // return this.ascending(date_1, date_2);
      });
    }
    return f_3.sort((a, b) => {
      const date_1 = new Date(a.date as string);
      const date_2 = new Date(b.date as string);
      // return this.descending(date_1, date_2);
      return this.ascending(date_1, date_2);
    });
  }
  filterSalesTransactions(
    data: WritableSignal<Sale[]>,
    filterObject: WritableSignal<TransactionFilter>,
    flag?: 'asc' | 'desc'
  ) {
    // for sorting on date, product and category
    const f_1 = data().filter((item) => {
      if (filterObject().date == '') {
        return true;
      }
      const date_1 = new Date(filterObject().date).toLocaleDateString();

      const date_2 = new Date(item.createdAt as string).toLocaleDateString();

      return date_1 == date_2;
    });
    // console.log({ f_1 });

    const f_2 = f_1.reduce((cum: TransactionItem[], curr) => {
      const products = curr.products.map((p) => ({
        ...p,
        date: curr.createdAt,
        discount: curr.discount / curr.products.length,
      }));
      cum.push(...products);
      return cum;
    }, []);
    // console.log({ f_2 });

    const f_3 = f_2.filter((item) => {
      const pro = filterObject().product;
      const cate = filterObject().category;
      if (pro == '' && cate == '') {
        // console.log('not checking product and category');
        return true;
      }
      const p = item.product as Product;
      if (pro != '' && cate == '') {
        // console.log('checking product not category');
        p.name.includes(pro);
      }
      if (pro == '' && cate != '') {
        // console.log('checking category not product');
        return p.category.includes(cate);
      }

      // console.log('both pattern checked');
      return p.name.includes(pro) && p.category.includes(cate);
    });
    // console.log(f_3);
    if (flag == undefined || flag == 'desc') {
      return f_3.sort((a, b) => {
        const date_1 = new Date(a.date as string);
        const date_2 = new Date(b.date as string);
        return this.descending(date_1, date_2);
        // return this.ascending(date_1, date_2);
      });
    }
    return f_3.sort((a, b) => {
      const date_1 = new Date(a.date as string);
      const date_2 = new Date(b.date as string);
      // return this.descending(date_1, date_2);
      return this.ascending(date_1, date_2);
    });
  }
  sortSales<K extends { createdAt?: string; products: TransactionItem[] }>(
    data: WritableSignal<K[]>,
    filterObject: WritableSignal<TransactionFilter>,
    flag?: 'asc' | 'desc'
  ) {
    // for sorting on date, product and category
    const f_1 = data().filter((item) => {
      if (filterObject().date == '') {
        console.log('date is empty');
        return true;
      }
      const date_1 = new Date(filterObject().date).toLocaleDateString();
      console.log({ date_1 });
      const date_2 = new Date(item.createdAt as string).toLocaleDateString();
      console.log({ date_2 });

      console.log('checked data');
      return date_1 == date_2;
    });
    // console.log({ f_1 });

    const f_2 = f_1.reduce((cum: TransactionItem[], curr) => {
      const products = curr.products.map((p) => ({
        ...p,
        date: curr.createdAt,
      }));
      cum.push(...products);
      return cum;
    }, []);
    // console.log({ f_2 });

    const f_3 = f_2.filter((item) => {
      const pro = filterObject().product;
      const cate = filterObject().category;
      if (pro == '' && cate == '') {
        console.log('not checking product and category');
        return true;
      }
      const p = item.product as Product;
      if (pro != '' && cate == '') {
        console.log('checking product not category');
        p.name.includes(pro);
      }
      if (pro == '' && cate != '') {
        console.log('checking category not product');
        return p.category.includes(cate);
      }

      console.log('both pattern checked');
      return p.name.includes(pro) && p.category.includes(cate);
    });
    // console.log(f_3);
    if (flag == undefined || flag == 'desc') {
      return f_3.sort((a, b) => {
        const date_1 = new Date(a.date as string);
        const date_2 = new Date(b.date as string);
        return this.descending(date_1, date_2);
        // return this.ascending(date_1, date_2);
      });
    }
    return f_3.sort((a, b) => {
      const date_1 = new Date(a.date as string);
      const date_2 = new Date(b.date as string);
      // return this.descending(date_1, date_2);
      return this.ascending(date_1, date_2);
    });
  }
  filterRequests(
    data: WritableSignal<Transfer[]>,
    filterObject: WritableSignal<RequestFilter>,
    flag?: 'asc' | 'desc'
  ) {
    // for sorting on date, product and category
    const f_1 = data().filter((item) => {
      if (filterObject().date == '') {
        console.log('date is empty');
        return true;
      }
      const date_1 = new Date(filterObject().date).toLocaleDateString();
      console.log({ date_1 });
      const date_2 = new Date(item.createdAt as string).toLocaleDateString();
      console.log({ date_2 });

      console.log('checked data');
      return date_1 == date_2;
    });
    // console.log({ f_1 });

    const f_2 = f_1.filter((item) => {
      const store_prompt = filterObject().store;
      const destination_prompt = filterObject().destination;
      if (store_prompt == '' && destination_prompt == '') {
        console.log('not checking store and destination');
        return true;
      }
      const store = (item.store as Store).name;
      const destination = (item.destination as Store).name;
      if (store_prompt == '' && destination_prompt != '') {
        console.log('checking destination not store');
        destination.includes(destination_prompt);
      }
      if (store_prompt != '' && destination_prompt == '') {
        console.log('checking store not destination');
        return store.includes(store_prompt);
      }

      console.log('both destination and store checked');
      return (
        store.includes(store_prompt) && destination.includes(destination_prompt)
      );
    });
    // console.log(f_3);
    if (flag == undefined || flag == 'desc') {
      return f_2.sort((a, b) => {
        const date_1 = new Date(a.createdAt as string);
        const date_2 = new Date(b.createdAt as string);
        return this.descending(date_1, date_2);
        // return this.ascending(date_1, date_2);
      });
    }
    return f_2.sort((a, b) => {
      const date_1 = new Date(a.createdAt as string);
      const date_2 = new Date(b.createdAt as string);
      return this.ascending(date_1, date_2);
    });
  }
  filterPurchases(
    data: WritableSignal<Purchase[]>,
    filterObject: WritableSignal<PurchaseFilter>,
    flag?: 'asc' | 'desc'
  ) {
    // for sorting on date, product and category
    const f_1 = data().filter((item) => {
      if (filterObject().date == '') {
        console.log('date is empty');
        return true;
      }
      const date_1 = new Date(filterObject().date).toLocaleDateString();
      console.log({ date_1 });
      const date_2 = new Date(item.createdAt as string).toLocaleDateString();
      console.log({ date_2 });

      console.log('checked data');
      return date_1 == date_2;
    });
    // console.log({ f_1 });

    const f_2 = f_1.filter((item) => {
      const supplier_prompt = filterObject().supplier;
      const destination_prompt = filterObject().destination;
      if (supplier_prompt == '' && destination_prompt == '') {
        console.log('not checking supplier and destination');
        return true;
      }
      const supplier = (item.supplier as Supplier).name;
      const destination = (item.destination as Store).name;
      if (supplier_prompt == '' && destination_prompt != '') {
        console.log('checking destination not supplier');
        destination.includes(destination_prompt);
      }
      if (supplier_prompt != '' && destination_prompt == '') {
        console.log('checking supplier not destination');
        return supplier.includes(supplier_prompt);
      }

      console.log('both destination and supplier checked');
      return (
        supplier.includes(supplier_prompt) &&
        destination.includes(destination_prompt)
      );
    });
    // console.log(f_3);
    if (flag == undefined || flag == 'desc') {
      return f_2.sort((a, b) => {
        const date_1 = new Date(a.createdAt as string);
        const date_2 = new Date(b.createdAt as string);
        return this.descending(date_1, date_2);
        // return this.ascending(date_1, date_2);
      });
    }
    return f_2.sort((a, b) => {
      const date_1 = new Date(a.createdAt as string);
      const date_2 = new Date(b.createdAt as string);
      return this.ascending(date_1, date_2);
    });
  }
  filterInventories(
    data: Inventory[],
    filterObject: WritableSignal<InventoryFilter>
  ) {
    const product_prompt = filterObject().product;
    const category_prompt = filterObject().category;

    return data.filter((inventory) => {
      if (product_prompt == '' && category_prompt == '') {
        console.log('not checking supplier and destination');
        return true;
      }
      const product = (inventory.product as Product).name;
      const category = (inventory.product as Product).category;
      if (product_prompt == '' && category_prompt != '') {
        return category.includes(category_prompt);
      }
      if (product_prompt != '' && category_prompt == '') {
        return product.includes(product_prompt);
      }

      return (
        product.includes(product_prompt) && category.includes(category_prompt)
      );
    });
  }

  ascending(a: Comparable, b: Comparable) {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }
  descending(a: Comparable, b: Comparable) {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  }
}
