import { TestBed, inject } from '@angular/core/testing';

import { CustomerManagementService } from './customer-management.service';

describe('CustomerManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerManagementService]
    });
  });

  it('should be created', inject([CustomerManagementService], (service: CustomerManagementService) => {
    expect(service).toBeTruthy();
  }));
});
