import { Component, Input } from '@angular/core';
import { PropCardComponent } from '../prop-card/prop-card.component';
import { Inventory } from '../../interfaces/inventory';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'render-inventory',
  standalone: true,
  imports: [PropCardComponent],
  templateUrl: './render-inventory.component.html',
  styleUrl: './render-inventory.component.scss',
})
export class RenderInventoryComponent {
  @Input() inventory!: Inventory;
  parseProduct() {
    return this.inventory.product as Product;
  }
  parseDate() {
    return new Date(this.inventory.expiry as string).toLocaleDateString();
  }
}
