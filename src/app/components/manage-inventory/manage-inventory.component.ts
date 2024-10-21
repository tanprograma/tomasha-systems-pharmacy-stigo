import {
  Component,
  computed,
  EventEmitter,
  inject,
  OnInit,
  Output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Inventory } from '../../interfaces/inventory';
import { ManageInventoryService } from '../../services/manage-inventory.service';
import { ShopService } from '../../services/shop.service';
import { PropCardComponent } from '../prop-card/prop-card.component';
import { PropCardActionComponent } from '../prop-card-action/prop-card-action.component';
import { Product } from '../../interfaces/product';
import { isPlatformBrowser, UpperCasePipe } from '@angular/common';
import { of } from 'rxjs';
import { AddInventoryComponent } from '../add-inventory/add-inventory.component';
import { AllertLoadingComponent } from '../allert-loading/allert-loading.component';
import { Allert } from '../../interfaces/allert';
import { AllertStatusComponent } from '../allert-status/allert-status.component';
import { RequestAllertComponent } from '../request-allert/request-allert.component';
import { AddPriceComponent } from '../add-price/add-price.component';
import { AddExpiryComponent } from '../add-expiry/add-expiry.component';
@Component({
  selector: 'manage-inventory',
  standalone: true,
  imports: [
    FontAwesomeModule,
    PropCardComponent,
    PropCardActionComponent,
    UpperCasePipe,
    AddInventoryComponent,
    AllertLoadingComponent,
    AllertStatusComponent,
    RequestAllertComponent,
    AddPriceComponent,
    AddExpiryComponent,
  ],
  templateUrl: './manage-inventory.component.html',
  styleUrl: './manage-inventory.component.scss',
})
export class ManageInventoryComponent implements OnInit {
  icon = faArrowLeft;
  searchIcon = faSearch;
  platfromID = inject(PLATFORM_ID);
  manageService = inject(ManageInventoryService);
  shopService = inject(ShopService);
  storeConfig = this.shopService.storeConfig;
  view = this.manageService.view;
  viewToggler = this.manageService.viewReducer;
  inventory = this.manageService.inventory;
  inventories = signal<Inventory[]>([]);
  searchKey = signal('');
  displayed = computed(() => {
    if (this.searchKey() == '') return this.inventories();
    return this.inventories().filter((item) => {
      return (item.product as Product).name.includes(this.searchKey());
    });
  });
  storeName: string = '';
  allert: Allert = {
    loading: false,
  };
  ngOnInit(): void {
    this.getShopInventories();
  }
  search(v: Event) {
    const target = v.target as HTMLInputElement;
    this.searchKey.set(target.value);
  }
  back() {
    this.searchKey.set('');
    this.viewToggler({ type: 'all' });
  }
  // toggleView(action: { type: string; inventory?: Inventory }) {
  //   this.viewToggler(action);
  // }
  getShopInventories() {
    this.allert.loading = true;
    (this.allert.message = 'getting inventories'),
      this.shopService.getShopInventories().subscribe((inventories) => {
        this.inventories.set(inventories);
        this.allert = { ...this.allert, loading: false, message: '' };
      });
  }

  updateInventory(action: {
    type: string;
    inventoryID: string;
    data: unknown;
  }) {
    this.allert = {
      ...this.allert,
      loading: true,
      message: 'updating inventory',
    };
    this.shopService.updateInventory(action).subscribe((res) => {
      if (res.status) {
        this.inventory = res.result;
        this.inventories.update((v) => {
          return v.map((item) => {
            return item._id == res.result?._id
              ? (res.result as Inventory)
              : item;
          });
        });
        console.log(res.result);
        this.allert = {
          ...this.allert,
          message: 'successfully updated',
          status: true,
        };
      } else {
        this.allert = {
          ...this.allert,
          status: false,
          message: 'could not updating inventory',
        };
      }
    });
  }
  handleAllert(e: any) {
    this.allert = {
      ...this.allert,
      loading: false,
      message: '',
      status: undefined,
    };
  }
  parseProduct(item: Product | string | undefined) {
    return item as Product;
  }
  setStoreName() {
    return of(sessionStorage);
    // if (isPlatformBrowser(this.platfromID)) {
    //   const store = sessionStorage.getItem('store');
    //   if (store != null) {
    //     return JSON.parse(store).name as string;
    //   }
    // }
    // return '';
  }
  addInventory(inventoryID: string, data: { quantity: number }) {}
  addPrice(inventoryID: string, data: { unit: string; value: number }) {}
  addExpiry(inventoryID: string, data: { expiry: string }) {}
}
