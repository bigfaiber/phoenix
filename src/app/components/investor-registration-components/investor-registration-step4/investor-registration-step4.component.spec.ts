import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorRegistrationStep4Component } from './investor-registration-step4.component';

describe('InvestorRegistrationStep4Component', () => {
  let component: InvestorRegistrationStep4Component;
  let fixture: ComponentFixture<InvestorRegistrationStep4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorRegistrationStep4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorRegistrationStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
