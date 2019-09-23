import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestorPaymentHistoryComponent } from './admin-investor-payment-history.component';

describe('AdminInvestorPaymentHistoryComponent', () => {
  let component: AdminInvestorPaymentHistoryComponent;
  let fixture: ComponentFixture<AdminInvestorPaymentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvestorPaymentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvestorPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
