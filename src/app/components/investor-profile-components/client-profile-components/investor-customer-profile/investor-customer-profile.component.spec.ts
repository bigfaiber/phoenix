import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorCustomerProfileComponent } from './investor-customer-profile.component';

describe('InvestorCustomerProfileComponent', () => {
  let component: InvestorCustomerProfileComponent;
  let fixture: ComponentFixture<InvestorCustomerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorCustomerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorCustomerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
