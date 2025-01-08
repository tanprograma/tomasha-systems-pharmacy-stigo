import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterTransactionsComponent } from '../../components/filter-transactions/filter-transactions.component';
import { PropCardComponent } from '../../components/prop-card/prop-card.component';
import { SalesInfoComponent } from '../../components/sales-info/sales-info.component';
import { Sale } from '../../interfaces/sale';
import {
  RequestFilter,
  TransactionFilter,
} from '../../interfaces/transaction-filter';
import { ShopService } from '../../services/shop.service';
import {
  ReceivedInfoComponent,
  ReceivedItem,
} from '../../components/received-info/received-info.component';
import { Allert } from '../../interfaces/allert';
import { Product } from '../../interfaces/product';
import { Transfer } from '../../interfaces/request';
import { Store } from '../../interfaces/store';
import { FilterUniversalComponent } from '../../components/filter-universal/filter-universal.component';

@Component({
  selector: 'app-shop-requests-info-detailed',
  standalone: true,
  imports: [
    ReceivedInfoComponent,
    UpperCasePipe,
    ReactiveFormsModule,
    FilterUniversalComponent,
    PropCardComponent,
  ],
  templateUrl: './shop-requests-info-detailed.component.html',
  styleUrl: './shop-requests-info-detailed.component.scss',
})
export class ShopRequestsInfoDetailedComponent {
  shopService = inject(ShopService);
  storeConfig = this.shopService.storeConfig;
  filter = signal<any>({
    date: '',
    store: '',
    destination: '',
    product: '',
  });
  requests = signal<Transfer[]>([]);
  displayed_requests = computed(() => {
    const all_items: ReceivedItem[] = [];
    return this.shopService
      .filterRequests(this.requests, this.filter)
      .reduce((cum, transfer) => {
        cum.push(...this.mapToReceivedItems(transfer));
        return cum;
      }, all_items)
      .filter((item) => {
        if (this.filter().product == '') {
          return true;
        } else {
          return item.item.includes(this.filter().product.toLowerCase());
        }
      });
  });
  stores: Store[] = [];
  allert: Allert = {
    loading: false,
  };
  ngOnInit(): void {
    this.getResources();
  }
  filterRequests(filter: RequestFilter) {
    console.log(filter);
    this.filter.set(filter);
  }
  mapToReceivedItems(transfer: Transfer): ReceivedItem[] {
    return transfer.products.map((i) => ({
      date: this.parseTime(transfer.createdAt),
      src: this.parseStore(transfer.store),

      destination: this.parseStore(transfer.destination),
      item: this.parseProductName(i.product),
      unit: i.unit,
      quantity: i.quantity,
    }));
  }
  parseString(item: any) {
    return `${item}`;
  }
  getResources() {
    this.shopService.getShopReceivedRequests().subscribe((requests) => {
      this.requests.set(requests);
    });
  }
  getSN(n: number) {
    return `${n}`;
  }
  parseStore(store: Store | string) {
    return (store as Store).name;
  }
  parseProductName(product: string | Product) {
    return (product as Product).name;
  }
  parseTime(date: string | undefined) {
    // return date and time
    const d = new Date(date as string);
    return `${d.toLocaleTimeString()}  ${d.toLocaleDateString()}`;
  }
}
