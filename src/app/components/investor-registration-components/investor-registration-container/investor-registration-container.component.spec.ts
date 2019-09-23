import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorRegistrationContainerComponent } from './investor-registration-container.component';

describe('InvestorRegistrationContainerComponent', () => {
  let component: InvestorRegistrationContainerComponent;
  let fixture: ComponentFixture<InvestorRegistrationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorRegistrationContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorRegistrationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
