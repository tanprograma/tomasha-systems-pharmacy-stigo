import { Routes } from '@angular/router';
import { LogsComponent } from '../pages/logs/logs.component';
import { CreateProductComponent } from '../pages/create-product/create-product.component';
import { CreateUnitComponent } from '../pages/create-unit/create-unit.component';

import { CreateCategoryComponent } from '../pages/create-category/create-category.component';
import { CreateStoreComponent } from '../pages/create-store/create-store.component';
import { CreateSupplierComponent } from '../pages/create-supplier/create-supplier.component';
import { AdminUserComponent } from '../pages/admin-user/admin-user.component';
import { AdminExpiredComponent } from '../pages/admin-expired/admin-expired.component';

export const routes: Routes = [
  { path: '', redirectTo: '/admin/logs', pathMatch: 'full' },
  { path: 'logs', component: LogsComponent },
  { path: 'create-product', component: CreateProductComponent },
  { path: 'create-unit', component: CreateUnitComponent },

  { path: 'create-category', component: CreateCategoryComponent },
  { path: 'create-store', component: CreateStoreComponent },
  { path: 'create-supplier', component: CreateSupplierComponent },
  { path: 'create-users', component: AdminUserComponent },
  { path: 'expired', component: AdminExpiredComponent },
];
