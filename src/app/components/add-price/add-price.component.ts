import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Inventory } from '../../interfaces/inventory';
import { Product } from '../../interfaces/product';
import { PropCardComponent } from '../prop-card/prop-card.component';
import { RenderInventoryComponent } from '../render-inventory/render-inventory.component';

@Component({
  selector: 'add-price',
  standalone: true,
  imports: [ReactiveFormsModule, PropCardComponent, RenderInventoryComponent],
  templateUrl: './add-price.component.html',
  styleUrl: './add-price.component.scss',
})
export class AddPriceComponent {
  @Input() inventory!: Inventory;
  @Output() onSubmit = new EventEmitter<{
    type: string;
    inventoryID: string;
    data: { unit: string; value: number }[];
  }>();
  // quantity = new FormControl(0);
  // unit = new FormControl('');
  add() {
    this.onSubmit.emit({
      type: 'prices',
      inventoryID: this.inventory._id as string,
      data: this.inventory.prices,
    });
  }
  changePrice(v: Event, unit: string) {
    const target = v.target as HTMLInputElement;
    this.inventory.prices = this.inventory.prices.map((item) => {
      return item.unit == unit
        ? { ...item, value: parseInt(target.value) }
        : item;
    });
  }
  getUnits() {
    return this.parseProduct().units;
  }
  parseProduct() {
    return this.inventory.product as Product;
  }
}
