import { Routes } from '@angular/router';
import { ShopStatisticsComponent } from '../pages/shop-statistics/shop-statistics.component';
import { ShopSalesComponent } from '../pages/shop-sales/shop-sales.component';
import { ShopPurchasesComponent } from '../pages/shop-purchases/shop-purchases.component';
import { ShopRequestsComponent } from '../pages/shop-requests/shop-requests.component';
import { ShopCreatePurchaseComponent } from '../pages/shop-create-purchase/shop-create-purchase.component';
import { ShopCreateRequestComponent } from '../pages/shop-create-request/shop-create-request.component';
import { ShopSalesInfoComponent } from '../pages/shop-sales-info/shop-sales-info.component';
import { ShopIssueRequestComponent } from '../pages/shop-issue-request/shop-issue-request.component';
import { ShopReceivePurchaseComponent } from '../pages/shop-receive-purchase/shop-receive-purchase.component';
import { ShopSellBackdateComponent } from '../pages/shop-sell-backdate/shop-sell-backdate.component';
import { ShopService } from '../services/shop.service';

import { ManageInventoryComponent } from '../components/manage-inventory/manage-inventory.component';
export const routes: Routes = [
  {
    path: '',
    component: ShopStatisticsComponent,
  },
  {
    path: 'statistics',
    component: ShopStatisticsComponent,
    loadChildren: () =>
      import('./shop-statistics.routes').then((mod) => mod.routes),
  },

  { path: 'sell', component: ShopSalesComponent },
  { path: 'sell-backdate', component: ShopSellBackdateComponent },

  { path: 'create-purchase', component: ShopCreatePurchaseComponent },
  { path: 'receive-purchase', component: ShopReceivePurchaseComponent },

  {
    path: 'create-requests',
    component: ShopCreateRequestComponent,
  },
  {
    path: 'issue-requests',
    component: ShopIssueRequestComponent,
  },
  {
    path: 'manage-inventory',
    component: ManageInventoryComponent,
  },
];
