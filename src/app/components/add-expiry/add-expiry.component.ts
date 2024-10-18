import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PropCardComponent } from '../prop-card/prop-card.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Inventory } from '../../interfaces/inventory';
import { Product } from '../../interfaces/product';
import { RenderInventoryComponent } from '../render-inventory/render-inventory.component';

@Component({
  selector: 'add-expiry',
  standalone: true,
  imports: [PropCardComponent, ReactiveFormsModule, RenderInventoryComponent],
  templateUrl: './add-expiry.component.html',
  styleUrl: './add-expiry.component.scss',
})
export class AddExpiryComponent {
  @Input() inventory!: Inventory;
  @Output() onSubmit = new EventEmitter<{
    type: string;
    inventoryID: string;
    data: { expiry: string };
  }>();
  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    expiry: ['', Validators.required],
  });
  // quantity = new FormControl(0);
  // unit = new FormControl('');
  add() {
    this.onSubmit.emit({
      type: 'expiry',
      inventoryID: this.inventory._id as string,
      data: { expiry: new Date(this.form.value.expiry ?? '').toISOString() },
    });
    this.form.patchValue({
      expiry: '',
    });
  }

  parseProduct() {
    return this.inventory.product as Product;
  }
}
