import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestorFileManagementComponent } from './admin-investor-file-management.component';

describe('AdminInvestorFileManagementComponent', () => {
  let component: AdminInvestorFileManagementComponent;
  let fixture: ComponentFixture<AdminInvestorFileManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvestorFileManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvestorFileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
