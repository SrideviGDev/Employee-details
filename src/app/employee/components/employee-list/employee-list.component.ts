import { Component, computed, ElementRef, Input, OnInit, Renderer2, signal } from '@angular/core';
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
  private isSwiping: boolean = false
  startX!: number;
  currentItem!: HTMLElement;
  currentId: number;
  removedEmployee:any;
  private currentX: number = 0;
  private threshold: number = 100; // Threshold for detecting swipe completion
  private swipeDistance: number = 0;
  deletedBtnWidth = 0;

  constructor(private router: Router,private dbService: NgxIndexedDBService,
          private employeeService: EmployeeService, private _snackBar: MatSnackBar,
          private renderer: Renderer2, private el: ElementRef){}

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
    return this.employeeList().filter((emp) => (emp['toDate']!='No Date' && emp['toDate']!=null))
  })

  currentEmployees = computed(() => {
   return this.employeeList().filter((emp) => (emp['toDate']=='No Date' || !emp['toDate']))
  })

   // Handle Mouse Events
   onMouseDown(event: MouseEvent, employee: Employee) {
    this.currentId = employee.id;
    this.currentItem = event?.target as HTMLElement;
    this.startSwipe(event.clientX);
  }

  onMouseMove(event: MouseEvent) {
    if (this.isSwiping) {
      this.updateSwipe(event.clientX);
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.isSwiping) {
      this.endSwipe(event.clientX);
    }
  }

  // Handle Touch Events
  onTouchStart(event: TouchEvent, employee: Employee) {
    this.currentId = employee.id;
    this.currentItem = event?.target as HTMLElement;
    this.startSwipe(event.touches[0].clientX);
  }

  onTouchMove(event: TouchEvent) {
    if (this.isSwiping) {
      this.updateSwipe(event.touches[0].clientX);
    }
  }

  onTouchEnd(event: TouchEvent) {
    if (this.isSwiping) {
      this.endSwipe(this.currentX);
    }
  }

  // Initialize swipe
  private startSwipe(startX: number) {
    this.isSwiping = true;
    this.startX = startX;
  }

  // Update the position during swipe
  private updateSwipe(currentX: number) {
    this.currentX = currentX;
    this.swipeDistance = this.currentX - this.startX;
    const deleteButton = document.getElementById(''+this.currentId) as HTMLElement;
    if(this.swipeDistance > 0) {
      deleteButton.style.opacity = '0';
      deleteButton.style.pointerEvents = 'none';
    } else {
      deleteButton.style.opacity = '1';
      deleteButton.style.pointerEvents = 'auto';
      this.currentItem.style.transform = `translateX(${this.swipeDistance}px)`
    }
    // this.renderer.setStyle(this.el.nativeElement, 'transform', `translateX(${this.swipeDistance}px)`);
  }


  // End swipe and check if the swipe is complete
  private endSwipe(endX: number) {
    this.isSwiping = false;
    this.swipeDistance = endX - this.startX;
    if(this.swipeDistance < 0) {
    // Check if swipe distance exceeds the threshold
    if (Math.abs(this.swipeDistance) > this.threshold) {
      this.handleSwipeComplete();
    } else {
      this.resetSwipe();
    }
  }
  }

  // Reset swipe back to original position
  private resetSwipe() {
    const deleteButton = document.getElementById(''+this.currentId) as HTMLElement;
    deleteButton.style.opacity = '0';
    deleteButton.style.pointerEvents = 'none';
    this.currentItem.style.transform = 'translateX(0px)';
  }

  // Trigger when swipe completes
  private handleSwipeComplete() {
    this.deleteEmployee(this.currentId)
    this.resetSwipe();  
  }


  // resetItem() {
  //   if (this.currentItem) {
  //     this.currentItem.style.transform = 'translateX(0)';
  //     this.showButtons(0);
  //   }
  // }

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
    this.router.navigate(['/employee-detail', this.currentId])
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
