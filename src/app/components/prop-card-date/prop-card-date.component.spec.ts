import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropCardDateComponent } from './prop-card-date.component';

describe('PropCardDateComponent', () => {
  let component: PropCardDateComponent;
  let fixture: ComponentFixture<PropCardDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropCardDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropCardDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
