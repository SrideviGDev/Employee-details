import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee/components/employee-list/employee-list.component';
import { EmployeeDetailFormComponent } from './employee/components/employee-detail-form/employee-detail-form.component';

const routes: Routes = [
  {path: '', redirectTo: 'employee', pathMatch: 'full'},
  {path: 'employee', component: EmployeeListComponent },
  {path: 'employee-detail', component: EmployeeDetailFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
