import {
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
} from '@angular/core';
import { Inventory } from '../../interfaces/inventory';
import { Product } from '../../interfaces/product';
import { PropCardComponent } from '../prop-card/prop-card.component';
import { PropCardActionComponent } from '../prop-card-action/prop-card-action.component';
import { InventoryFilterComponent } from '../inventory-filter/inventory-filter.component';
import { InventoryFilter } from '../../interfaces/inventory-filter';

@Component({
  selector: 'inventory-list',
  standalone: true,
  imports: [
    PropCardComponent,
    PropCardActionComponent,
    InventoryFilterComponent,
  ],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss',
})
export class InventoryListComponent {
  @Input() inventories!: Signal<Inventory[]>;
  @Output() onFilter = new EventEmitter<InventoryFilter>();
  inventory?: Inventory;
  filterInventories(item: InventoryFilter) {
    this.onFilter.emit(item);
  }
  renderProductName(product: Product | string) {
    return (product as Product).name;
  }
  renderProductCategory(product: Product | string) {
    return (product as Product).category;
  }
  view(item: Inventory) {
    this.inventory = item;
  }
  back() {
    this.inventory = undefined;
  }
  renderQuantity(item: Inventory) {
    const unit = this.getLargestUnit(item.product);
    return item.quantity / unit.value;
  }
  parseDate(item: Inventory) {
    if (item.expiry == undefined) {
      return 'not set';
    } else {
      return new Date(item.expiry).toLocaleDateString();
    }
  }
  getLargestUnit(product: Product | string) {
    return (product as Product).units.sort((a, b) => {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    })[0];
  }
  getUnitValue(unit: string, product: Product | string) {
    return (product as Product).units.find((u) => {
      return u.name == unit;
    })?.value as number;
  }
}
