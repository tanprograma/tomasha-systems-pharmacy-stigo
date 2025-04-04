import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { forkJoin } from 'rxjs';
import { Inventory } from '../../interfaces/inventory';
import { Product } from '../../interfaces/product';
import { Sale } from '../../interfaces/sale';
import { TransactionItem } from '../../interfaces/transaction-item';
import { ShopService } from '../../services/shop.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SaleFormItemsComponent } from '../../components/sale-form-items/sale-form-items.component';
import { SalesInfoComponent } from '../../components/sales-info/sales-info.component';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'shop-sell-backdate',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    SaleFormItemsComponent,
    SalesInfoComponent,
    RouterLink,
    UpperCasePipe,
    CurrencyPipe,
  ],
  templateUrl: './shop-sell-backdate.component.html',
  styleUrl: './shop-sell-backdate.component.scss',
})
export class ShopSellBackdateComponent {
  plusIcon = faPlus;
  formBuilder = inject(FormBuilder);
  item_form = this.formBuilder.group({
    date: ['', Validators.required],
    product: ['', Validators.required],
    unit: ['', Validators.required],
    quantity: [0, Validators.required],
    customer_id: [''],
  });
  discount = new FormControl(0);
  units: { name: string; value: number }[] = [];
  shopService = inject(ShopService);
  route = inject(ActivatedRoute);
  storeConfig = this.shopService.storeConfig;
  items: TransactionItem[] = [];
  inventories: Inventory[] = [];
  sales = signal<Sale[]>([]);
  displayed_sales = computed(() => {
    console.log('running signal');
    console.log(this.sales());
    return this.sales()
      .reduce((cum, curr) => {
        cum.push(...curr.products.map((p) => ({ ...p, date: curr.createdAt })));
        return cum;
      }, [] as TransactionItem[])
      .slice(0, 5);
  });
  ngOnInit(): void {
    this.getResources();
  }
  submitSales() {
    // creating a sale and registering to sales stack
    this.shopService
      .createSale({
        createdAt: new Date(
          this.item_form.value.date ?? ('' as string)
        ).toISOString(),
        customer: this.item_form.value.customer_id ?? '0000',
        discount: this.discount.value ?? 0,
        store: this.storeConfig().store_id,
        products: this.items.map((item) => ({
          ...item,
          product: (item.product as Product)._id as string,
        })),
      })
      .subscribe((res) => {
        if (res.status) {
          this.items = [];
          this.discount.patchValue(0);
          this.item_form.patchValue({
            customer_id: '',
          });
          const result = res.result as Sale;
          this.sales.update((v) => [result, ...v].slice(0, 5));
        }
      });
  }
  addItem() {
    this.items.push({
      product: this.getProduct(),
      unit: this.item_form.value.unit ?? '',
      price: this.getPrice(),
      unit_value: this.getUnitValue(),
      quantity: this.item_form.value.quantity ?? 0,
    });
    this.clearForm();
  }
  remove(transaction: TransactionItem) {
    this.items = this.items.filter((item) => item != transaction);
  }
  clearForm() {
    this.item_form.patchValue({
      product: '',

      quantity: 0,
      unit: '',
    });
    this.units = [];
  }
  getProduct() {
    // get product for item in form
    const product = this.item_form.value.product ?? '';
    return this.getInventoryByProductName(product).product as Product;
  }
  parseProductName(product: string | Product) {
    return (product as Product).name;
  }
  parseTime(date: string | undefined) {
    // return date and time
    const d = new Date(date as string);
    return `${d.toLocaleTimeString()}  ${d.toLocaleDateString()}`;
  }
  getSubtotal() {
    return this.items.reduce((acc: number, curr: TransactionItem) => {
      return acc + this.calculateAmount(curr);
    }, 0);
  }
  calculateAmount(item: TransactionItem) {
    return (item.price as number) * item.quantity;
  }
  getUnits() {
    // get units for product in form
    this.units = this.getProduct().units;
  }
  getInventoryByProductName(name: string) {
    return this.inventories.find((item) => {
      return (item.product as Product).name == name;
    }) as Inventory;
  }
  getPrice() {
    // get price of item in form
    const product = this.item_form.value.product ?? '';
    const unit = this.item_form.value.unit ?? '';
    return this.getInventoryByProductName(product)?.prices.find((p) => {
      return p.unit == unit;
    })?.value as number;
  }
  getUnitValue() {
    //  get unit value

    const unit = this.item_form.value.unit ?? '';
    return this.getProduct().units.find((u) => {
      return u.name == unit;
    })?.value as number;
  }
  getResources() {
    console.log('initializing');
    forkJoin([
      this.shopService.getShopInventories(),
      this.shopService.getShopSales(),
    ]).subscribe(([inventories, sales]) => {
      this.inventories = inventories;

      this.sales.set(this.sortSalesDescending(sales).slice(0, 5));
    });
  }

  sortSalesDescending(sales: Sale[]) {
    return sales.sort((a, b) => {
      const date_1 = new Date(a.createdAt as string);
      const date_2 = new Date(b.createdAt as string);
      return this.shopService.descending(date_1, date_2);
    });
  }
  sortSalesAscending(sales: Sale[]) {
    return sales.sort((a, b) => {
      const date_1 = new Date(a.createdAt as string);
      const date_2 = new Date(b.createdAt as string);
      return this.shopService.ascending(date_1, date_2);
    });
  }
  sortRecentSales(sales: Sale[]) {
    return sales.sort((a, b) => {
      const less = this.compareDates(
        a.createdAt as string,
        b.createdAt as string
      );
      if (less) {
        return 1;
      }
      if (!less) {
        return -1;
      }
      return 0;
    });
  }
  compareDates(a: string, b: string) {
    return new Date(a).getMilliseconds() < new Date(b).getMilliseconds();
  }
}
