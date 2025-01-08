import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterUniversalComponent } from './filter-universal.component';

describe('FilterUniversalComponent', () => {
  let component: FilterUniversalComponent;
  let fixture: ComponentFixture<FilterUniversalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterUniversalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterUniversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
