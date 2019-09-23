import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectLinkComponent } from './new-project-link.component';

describe('NewProjectLinkComponent', () => {
  let component: NewProjectLinkComponent;
  let fixture: ComponentFixture<NewProjectLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProjectLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProjectLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
