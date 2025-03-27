import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  document = inject(DOCUMENT);
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
  EXPIRED_API = `${this.BASE_URL}/api/expired`;

  constructor() {}
}
