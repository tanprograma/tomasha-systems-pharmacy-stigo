import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExpiredComponent } from './admin-expired.component';

describe('AdminExpiredComponent', () => {
  let component: AdminExpiredComponent;
  let fixture: ComponentFixture<AdminExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminExpiredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
