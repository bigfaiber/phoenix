import { TestBed, async, inject } from '@angular/core/testing';

import { InvestorProfileGuard } from './investor-profile.guard';

describe('InvestorProfileGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestorProfileGuard]
    });
  });

  it('should ...', inject([InvestorProfileGuard], (guard: InvestorProfileGuard) => {
    expect(guard).toBeTruthy();
  }));
});
