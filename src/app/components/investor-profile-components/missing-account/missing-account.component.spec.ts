import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingAccountComponent } from './missing-account.component';

describe('MissingAccountComponent', () => {
  let component: MissingAccountComponent;
  let fixture: ComponentFixture<MissingAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
