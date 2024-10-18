import { Injectable } from '@angular/core';
import { Inventory } from '../interfaces/inventory';

@Injectable({
  providedIn: 'root',
})
export class ManageInventoryService {
  view: string = 'all';
  inventory?: Inventory;
  viewReducer(action: { type: string; inventory?: Inventory }) {
    switch (action.type) {
      case 'all': {
        this.view = 'all';
        this.inventory = undefined;
        break;
      }
      case 'edit': {
        this.view = 'inventory';
        this.inventory = action.inventory;
        break;
      }
      case 'inventory': {
        this.view = 'inventory';
        break;
      }
      case 'prices': {
        this.view = 'prices';
        break;
      }
      case 'expiry': {
        this.view = 'expiry';
        break;
      }

      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
  constructor() {}
}
