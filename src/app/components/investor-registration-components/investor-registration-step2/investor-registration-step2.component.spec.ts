import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorRegistrationStep2Component } from './investor-registration-step2.component';

describe('InvestorRegistrationStep2Component', () => {
  let component: InvestorRegistrationStep2Component;
  let fixture: ComponentFixture<InvestorRegistrationStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorRegistrationStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorRegistrationStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
