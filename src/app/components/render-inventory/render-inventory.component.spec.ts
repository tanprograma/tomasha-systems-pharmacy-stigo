import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderInventoryComponent } from './render-inventory.component';

describe('RenderInventoryComponent', () => {
  let component: RenderInventoryComponent;
  let fixture: ComponentFixture<RenderInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
