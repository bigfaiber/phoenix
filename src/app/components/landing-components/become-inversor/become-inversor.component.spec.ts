import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeInversorComponent } from './become-inversor.component';

describe('BecomeInversorComponent', () => {
  let component: BecomeInversorComponent;
  let fixture: ComponentFixture<BecomeInversorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeInversorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeInversorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
