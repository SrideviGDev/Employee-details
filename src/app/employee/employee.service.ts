import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from './employee-model';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }
  
  private employeeData = new BehaviorSubject(null);
  employeeDetails$ = this.employeeData.asObservable();

  editEmployee(data: any) {
    this.employeeData.next(data);
  }
}
