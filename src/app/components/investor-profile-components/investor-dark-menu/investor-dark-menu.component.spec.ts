import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorDarkMenuComponent } from './investor-dark-menu.component';

describe('InvestorDarkMenuComponent', () => {
  let component: InvestorDarkMenuComponent;
  let fixture: ComponentFixture<InvestorDarkMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorDarkMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorDarkMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
