import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitabilitiesChartComponent } from './profitabilities-chart.component';

describe('ProfitabilitiesChartComponent', () => {
  let component: ProfitabilitiesChartComponent;
  let fixture: ComponentFixture<ProfitabilitiesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfitabilitiesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitabilitiesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
