import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProjectLinkComponent } from './data-project-link.component';

describe('DataProjectLinkComponent', () => {
  let component: DataProjectLinkComponent;
  let fixture: ComponentFixture<DataProjectLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataProjectLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProjectLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
