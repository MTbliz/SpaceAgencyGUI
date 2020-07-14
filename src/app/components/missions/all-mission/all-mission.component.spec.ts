import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMissionComponent } from './all-mission.component';

describe('AllMissionComponent', () => {
  let component: AllMissionComponent;
  let fixture: ComponentFixture<AllMissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
