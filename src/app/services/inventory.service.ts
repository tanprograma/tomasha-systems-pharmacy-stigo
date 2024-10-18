import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from './http.service';
import { UrlService } from './url.service';
import { Inventory } from '../interfaces/inventory';
import { catchError } from 'rxjs';
import { PostResponse } from '../interfaces/post-result';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  http = inject(HttpService);

  constructor() {}
  getInventory(api: string) {
    return this.http
      .get<Inventory[]>(api)
      .pipe(
        catchError(
          this.http.handleError<Inventory[]>('could not get inventories', [])
        )
      );
  }

  editPrice(api: string, data: { unit: string; value: number }[]) {
    return this.http
      .patch<{ unit: string; value: number }[], PostResponse<Inventory>>(
        api,
        data
      )
      .pipe(
        catchError(
          this.http.handleError<PostResponse<Inventory>>(
            'couldnot update prices',
            { status: false }
          )
        )
      );
  }
  addBegginingInventory(api: string, data: { quantity: number }) {
    return this.http
      .patch<{ quantity: number }, PostResponse<Inventory>>(api, data)
      .pipe(
        catchError(
          this.http.handleError<PostResponse<Inventory>>(
            'could not update quantities',
            { status: false }
          )
        )
      );
  }
  addExpiry(api: string, data: { expiry: string }) {
    return this.http
      .patch<{ expiry: string }, PostResponse<Inventory>>(api, data)
      .pipe(
        catchError(
          this.http.handleError<PostResponse<Inventory>>(
            'could not update expiry',
            { status: false }
          )
        )
      );
  }
  // getProductFromInventories(productName: string, inventories: Inventory[]) {
  //   // inventory product
  //   return inventories.find(
  //     (inventory) => (inventory.product as Product).name == productName
  //   )?.product as Product;
  // }
  // getInventoryPrice(unit:string,inventories) {

  // }
}
