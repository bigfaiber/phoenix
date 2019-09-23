import { TestBed, inject } from '@angular/core/testing';

import { AdminManagementService } from './admin-management.service';

describe('AdminManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminManagementService]
    });
  });

  it('should be created', inject([AdminManagementService], (service: AdminManagementService) => {
    expect(service).toBeTruthy();
  }));
});
