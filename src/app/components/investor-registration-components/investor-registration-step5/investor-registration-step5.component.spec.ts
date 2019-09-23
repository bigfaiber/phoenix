import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorRegistrationStep5Component } from './investor-registration-step5.component';

describe('InvestorRegistrationStep5Component', () => {
  let component: InvestorRegistrationStep5Component;
  let fixture: ComponentFixture<InvestorRegistrationStep5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorRegistrationStep5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorRegistrationStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
