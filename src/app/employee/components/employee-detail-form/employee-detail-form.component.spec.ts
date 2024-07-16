import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailFormComponent } from './employee-detail-form.component';

describe('EmployeeDetailFormComponent', () => {
  let component: EmployeeDetailFormComponent;
  let fixture: ComponentFixture<EmployeeDetailFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDetailFormComponent]
    });
    fixture = TestBed.createComponent(EmployeeDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
