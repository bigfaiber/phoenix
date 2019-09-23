import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorProfileWrapperComponent } from './investor-profile-wrapper.component';

describe('InvestorProfileWrapperComponent', () => {
  let component: InvestorProfileWrapperComponent;
  let fixture: ComponentFixture<InvestorProfileWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorProfileWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorProfileWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
