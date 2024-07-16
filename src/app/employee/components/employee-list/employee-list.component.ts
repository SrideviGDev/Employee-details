import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Employee } from '../../employee-model';
import { EmployeeService } from '../../employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit{

  employees = []
  employeeList = signal(this.employees);
  @Input() title: string;
  @Input() content: string;
  startX!: number;
  currentItem!: HTMLElement;
  currentId: number;
  removedEmployee:any;

  constructor(private router: Router,private dbService: NgxIndexedDBService,
          private employeeService: EmployeeService, private _snackBar: MatSnackBar){}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.dbService.getAll('employees').subscribe((result: any) => {
      this.employees = result;
      this.employeeList.set(this.employees)
    });
    
  }

  previousEmployees = computed(() => {
    return this.employeeList().filter((emp) => emp['toDate']!=null)
  })

  currentEmployees = computed(() => {
   return this.employeeList().filter((emp) => !emp['toDate'])
  })

    

  onMouseDown(event: MouseEvent, employee: Employee) {
    this.startX = event?.clientX;
    this.currentItem = event?.target as HTMLElement;
    this.currentId = employee.id;
    this.addMouseEvents();
  }

  onTouchStart(event: TouchEvent, employee: Employee) {
    this.startX = event?.touches[0].clientX;
    this.currentItem = event?.target as HTMLElement;
    this.currentId = employee['id'];
    this.addTouchEvents();
  }

  addMouseEvents() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  addTouchEvents() {
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
  }

  onMouseMove = (event: MouseEvent) => {
    const deltaX = event?.clientX - this.startX;
    this.handleSwipe(deltaX);
  };

  onTouchMove = (event: TouchEvent) => {
    const deltaX = event?.touches[0].clientX - this.startX;
    this.handleSwipe(deltaX);
  };

  handleSwipe(deltaX: number) {
    if (this.currentItem) {
      this.currentItem.style.transform = `translateX(${deltaX}px)`;
      this.showButtons(deltaX);
    }
  }

  showButtons(deltaX: number) {
    
    const deleteButton = document.getElementById(''+this.currentId) as HTMLElement;
    if(deleteButton) {
    if (deltaX > 50) {
      deleteButton.style.opacity = '0';
      deleteButton.style.pointerEvents = 'none';
    } else if (deltaX < -50) {
      deleteButton.style.opacity = '1';
      deleteButton.style.pointerEvents = 'auto';
      setTimeout(() => {
        this.deleteEmployee(this.currentId)
      }, 700)
    } else {
      deleteButton.style.opacity = '0';
      deleteButton.style.pointerEvents = 'none';
    }
  }
  }

  onMouseUp = () => {
    this.resetItem();
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  onTouchEnd = () => {
    this.resetItem();
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  };

  resetItem() {
    if (this.currentItem) {
      this.currentItem.style.transform = 'translateX(0)';
      this.showButtons(0);
    }
  }

  deleteEmployee(employeeId: number) {
    this.dbService.getByID('employees', employeeId).subscribe((employee) => {
        if (employee) {
          this.removedEmployee = employee;
          this.dbService.deleteByKey('employees', employeeId).subscribe(() => {
            this.openSnackBar('Employee data has been deleted', 'Undo');
            this.loadEmployees();
          })
        }
      })
  }

  editEmployee(employee: Employee) {
    this.employeeService.editEmployee(employee)
    this.router.navigate(['/employee-detail'])
  }
  
  toAddNewEmployee() {
    this.router.navigate(['/employee-detail'])
  }

  openSnackBar(message: string, action: any) {
    let snackBarRef = this._snackBar.open(message, action, {
      duration: 2000
    });
    snackBarRef.onAction().subscribe(() => {
      if(this.removedEmployee) {
      this.dbService.add('employees', this.removedEmployee).subscribe((res) => {
        this.loadEmployees();
      })
      }
    });
  }

}
