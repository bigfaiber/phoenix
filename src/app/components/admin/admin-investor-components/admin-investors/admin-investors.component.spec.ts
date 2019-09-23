import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestorsComponent } from './admin-investors.component';

describe('AdminInvestorsComponent', () => {
  let component: AdminInvestorsComponent;
  let fixture: ComponentFixture<AdminInvestorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvestorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvestorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
