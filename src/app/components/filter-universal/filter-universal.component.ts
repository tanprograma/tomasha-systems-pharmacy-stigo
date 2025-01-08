import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { TransactionFilter } from '../../interfaces/transaction-filter';
export type FilterType =
  | 'product'
  | 'source'
  | 'destination'
  | 'date'
  | 'category';
@Component({
  selector: 'filter-universal',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './filter-universal.component.html',
  styleUrl: './filter-universal.component.scss',
})
export class FilterUniversalComponent {
  @Output() onFilter = new EventEmitter<any>();

  filterIcon = faSearch;
  resetIcon = faRefresh;
  formBuilder = inject(FormBuilder);
  filterForm = this.formBuilder.group({
    product: [''],
    src: [''],
    destination: [''],
    date: [''],
  });
  filter() {
    this.onFilter.emit({
      date: this.filterForm.value.date ?? '',
      product: this.filterForm.value.product ?? '',
      store: this.filterForm.value.src ?? '',
      destination: this.filterForm.value.src ?? '',
    });
  }
  clearFilter() {
    this.filterForm.patchValue({
      product: '',
      date: '',
      src: '',
      destination: '',
    });
    this.filter();
  }
}
