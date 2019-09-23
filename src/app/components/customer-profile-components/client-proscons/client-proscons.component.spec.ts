import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProsconsComponent } from './client-proscons.component';

describe('ClientProsconsComponent', () => {
  let component: ClientProsconsComponent;
  let fixture: ComponentFixture<ClientProsconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProsconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProsconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
