import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInvestorFilesComponent } from './update-investor-files.component';

describe('UpdateInvestorFilesComponent', () => {
  let component: UpdateInvestorFilesComponent;
  let fixture: ComponentFixture<UpdateInvestorFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateInvestorFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInvestorFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
