import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorBalanceComponent } from './investor-balance.component';

describe('InvestorBalanceComponent', () => {
  let component: InvestorBalanceComponent;
  let fixture: ComponentFixture<InvestorBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
