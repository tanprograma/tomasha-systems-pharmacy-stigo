import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { Expired } from '../../interfaces/expired';
import { ExpiredService } from '../../services/expired.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-admin-expired',
  standalone: true,
  imports: [
    FontAwesomeModule,
    UpperCasePipe,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './admin-expired.component.html',
  styleUrl: './admin-expired.component.scss',
})
export class AdminExpiredComponent {
  plusIcon = faPlus;
  cross = faTimes;
  showform = false;
  message = 'submitting data...';
  formBuilder = inject(FormBuilder);
  expiryForm = this.formBuilder.group({
    product: ['', Validators.required],
    unit: ['', Validators.required],
    quantity: [0, Validators.required],
    expiry: ['', Validators.required],
    status: [false],
  });
  loading = false;
  productsService = inject(ProductService);
  expiredService = inject(ExpiredService);
  title = 'expired medicines list';
  selectedUnits: { name: string; value: number }[] = [];
  toggleForm() {
    this.showform = !this.showform;
  }
  selectUnits() {
    const productName = this.expiryForm.value.product ?? '';
    // console.log(productName);
    const product = this.findProduct(productName);
    if (!!product) {
      this.selectedUnits = product.units;
    }
  }
  findProduct(v: string): Product | undefined {
    return this.products.find((p) => p.name == v.toLowerCase());
  }
  findProductID(v: string): Product | undefined {
    return this.products.find((p) => p._id == v);
  }
  submit() {
    const data = this.parseData();

    this.loading = true;
    this.expiredService.postExpired(data).subscribe((res) => {
      if (res.status) {
        this.expired = [
          ...this.expired,
          this.reparseData(res.result as Expired),
        ];
        // console.log(res.result);
      }
      this.loading = false;
    });
  }
  reparseData(expired: Expired) {
    return {
      ...expired,
      name: this.findProductID(expired.product_id)?.name,
      expiry: this.renderDate(expired.expiry),
    };
  }
  parseData(): Expired {
    return {
      product_id: this.findProduct(this.expiryForm.value.product ?? '')
        ?._id as string,
      unit: this.expiryForm.value.unit ?? '',
      quantity: this.expiryForm.value.quantity ?? 0,
      expiry: this.expiryForm.value.expiry ?? '',
      status: this.expiryForm.value.status ?? false,
    };
  }
  renderDate(d: string | number) {
    const date = new Date(d);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }
  ngOnInit() {
    forkJoin([
      this.productsService.getProducts(this.productsService.api),
      this.expiredService.getExpired(),
    ]).subscribe(([products, expired]) => {
      this.products = products;
      this.expired = expired.map((exp) => this.reparseData(exp));
      console.log(expired);
    });
  }
  products: Product[] = [];
  expired: Expired[] = [];
}
