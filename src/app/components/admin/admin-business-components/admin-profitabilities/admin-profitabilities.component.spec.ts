import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfitabilitiesComponent } from './admin-profitabilities.component';

describe('AdminProfitabilitiesComponent', () => {
  let component: AdminProfitabilitiesComponent;
  let fixture: ComponentFixture<AdminProfitabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProfitabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProfitabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
