import { TestBed } from '@angular/core/testing';

import { ManageInventoryService } from './manage-inventory.service';

describe('ManageInventoryService', () => {
  let service: ManageInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
