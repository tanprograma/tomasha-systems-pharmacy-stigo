import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopRequestsInfoDetailedComponent } from './shop-requests-info-detailed.component';

describe('ShopRequestsInfoDetailedComponent', () => {
  let component: ShopRequestsInfoDetailedComponent;
  let fixture: ComponentFixture<ShopRequestsInfoDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopRequestsInfoDetailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopRequestsInfoDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
