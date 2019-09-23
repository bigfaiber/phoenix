import { TestBed, inject } from '@angular/core/testing';

import { InvestorRegistrationService } from './investor-registration.service';

describe('InvestorRegistrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestorRegistrationService]
    });
  });

  it('should be created', inject([InvestorRegistrationService], (service: InvestorRegistrationService) => {
    expect(service).toBeTruthy();
  }));
});
