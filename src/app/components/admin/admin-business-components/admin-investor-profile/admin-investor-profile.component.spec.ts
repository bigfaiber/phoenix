import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestorProfileComponent } from './admin-investor-profile.component';

describe('AdminInvestorProfileComponent', () => {
  let component: AdminInvestorProfileComponent;
  let fixture: ComponentFixture<AdminInvestorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvestorProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvestorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
