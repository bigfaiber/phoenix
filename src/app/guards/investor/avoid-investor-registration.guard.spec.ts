import { TestBed, async, inject } from '@angular/core/testing';

import { AvoidInvestorRegistrationGuard } from './avoid-investor-registration.guard';

describe('AvoidInvestorRegistrationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AvoidInvestorRegistrationGuard]
    });
  });

  it('should ...', inject([AvoidInvestorRegistrationGuard], (guard: AvoidInvestorRegistrationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
