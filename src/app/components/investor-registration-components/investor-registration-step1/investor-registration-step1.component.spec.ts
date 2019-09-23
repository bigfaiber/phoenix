import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorRegistrationStep1Component } from './investor-registration-step1.component';

describe('InvestorRegistrationStep1Component', () => {
  let component: InvestorRegistrationStep1Component;
  let fixture: ComponentFixture<InvestorRegistrationStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorRegistrationStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorRegistrationStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
