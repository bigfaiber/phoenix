import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorRegistrationStep3Component } from './investor-registration-step3.component';

describe('InvestorRegistrationStep3Component', () => {
  let component: InvestorRegistrationStep3Component;
  let fixture: ComponentFixture<InvestorRegistrationStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorRegistrationStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorRegistrationStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
