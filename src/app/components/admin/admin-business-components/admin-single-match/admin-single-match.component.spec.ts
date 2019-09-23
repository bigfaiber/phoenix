import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSingleMatchComponent } from './admin-single-match.component';

describe('AdminSingleMatchComponent', () => {
  let component: AdminSingleMatchComponent;
  let fixture: ComponentFixture<AdminSingleMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSingleMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSingleMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
