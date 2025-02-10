import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopReportsComponent } from './shop-reports.component';

describe('ShopReportsComponent', () => {
  let component: ShopReportsComponent;
  let fixture: ComponentFixture<ShopReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
