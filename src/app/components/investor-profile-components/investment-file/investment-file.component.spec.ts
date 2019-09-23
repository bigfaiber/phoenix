import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentFileComponent } from './investment-file.component';

describe('InvestmentFileComponent', () => {
  let component: InvestmentFileComponent;
  let fixture: ComponentFixture<InvestmentFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
