import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorProfileEditionComponent } from './investor-profile-edition.component';

describe('InvestorProfileEditionComponent', () => {
  let component: InvestorProfileEditionComponent;
  let fixture: ComponentFixture<InvestorProfileEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorProfileEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorProfileEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
