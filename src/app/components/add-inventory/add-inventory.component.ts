import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Inventory } from '../../interfaces/inventory';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../interfaces/product';
import { PropCardComponent } from '../prop-card/prop-card.component';
import { RenderInventoryComponent } from '../render-inventory/render-inventory.component';

@Component({
  selector: 'add-inventory',
  standalone: true,
  imports: [ReactiveFormsModule, PropCardComponent, RenderInventoryComponent],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss',
})
export class AddInventoryComponent {
  @Input() inventory!: Inventory;
  @Output() onSubmit = new EventEmitter<{
    type: string;
    inventoryID: string;
    data: { quantity: number };
  }>();
  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    quantity: [0, Validators.required],
    unit: ['', Validators.required],
  });
  // quantity = new FormControl(0);
  // unit = new FormControl('');
  add() {
    this.onSubmit.emit({
      type: 'inventory',
      inventoryID: this.inventory._id as string,
      data: { quantity: this.calculateQuantity() },
    });
    this.form.patchValue({
      quantity: 0,
      unit: '',
    });
  }
  getUnits() {
    return this.parseProduct().units;
  }
  calculateQuantity() {
    return (
      (this.form.value.quantity ?? 0) *
      this.findUnitValue(this.form.value.unit ?? '')
    );
  }
  findUnitValue(unit: string) {
    return this.parseProduct().units.find((item) => {
      return item.name == unit;
    })?.value as number;
  }
  parseProduct() {
    return this.inventory.product as Product;
  }
}
