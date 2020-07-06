import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMissionsComponent } from './admin-missions.component';

describe('AdminMissionsComponent', () => {
  let component: AdminMissionsComponent;
  let fixture: ComponentFixture<AdminMissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
