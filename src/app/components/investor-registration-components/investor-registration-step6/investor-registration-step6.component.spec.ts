import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorRegistrationStep6Component } from './investor-registration-step6.component';

describe('InvestorRegistrationStep6Component', () => {
  let component: InvestorRegistrationStep6Component;
  let fixture: ComponentFixture<InvestorRegistrationStep6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorRegistrationStep6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorRegistrationStep6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
