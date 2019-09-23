import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorRegistrationComponent } from './investor-registration.component';

describe('InvestorRegistrationComponent', () => {
  let component: InvestorRegistrationComponent;
  let fixture: ComponentFixture<InvestorRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
