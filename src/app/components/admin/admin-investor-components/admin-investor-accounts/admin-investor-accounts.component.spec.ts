import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestorAccountsComponent } from './admin-investor-accounts.component';

describe('AdminInvestorAccountsComponent', () => {
  let component: AdminInvestorAccountsComponent;
  let fixture: ComponentFixture<AdminInvestorAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvestorAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvestorAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
