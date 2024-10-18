import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpiryComponent } from './add-expiry.component';

describe('AddExpiryComponent', () => {
  let component: AddExpiryComponent;
  let fixture: ComponentFixture<AddExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
