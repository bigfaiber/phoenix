import { TestBed, inject } from '@angular/core/testing';

import { InvestorManagementService } from './investor-management.service';

describe('InvestorManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestorManagementService]
    });
  });

  it('should be created', inject([InvestorManagementService], (service: InvestorManagementService) => {
    expect(service).toBeTruthy();
  }));
});
