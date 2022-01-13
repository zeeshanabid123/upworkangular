import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import {
  getAllEmployees,
  getEmployeesError,
  isDeleted,
} from '../store/employees.reducers';
import { Observable } from 'rxjs';
import { GetAllEmployees } from '../store/employees.actions';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  pageTitle = 'Employee List';
  // filteredEmployees: Observable<Employee[]>;
  filteredEmployees: Employee[]=[];

  //employees: Observable<Employee[]>;
  employees: Employee[]=[];

  errorMessage = '';
  modalReference: NgbModalRef;
  closeResult: string;
  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
     this.filteredEmployees = this.listFilter ? this.performFilter(this.listFilter) : this.employees;
  }

  constructor(
    private employeeService: EmployeeService,
    private store: Store<AppState>,
    private modalService: NgbModal
  ) {}

   performFilter(filterBy: string): Employee[] {
     filterBy = filterBy.toLocaleLowerCase();
     return this.employees.filter((employee: Employee) =>
       employee.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
   }

  ngOnInit(): void {
    debugger;
    this.getemployeedata();
    // this.store.dispatch(new GetAllEmployees());
    // this.filteredEmployees = this.store.select(getAllEmployees);

    // this.store
    //   .select(getEmployeesError)
    //   .subscribe((error) => this.loadingError(error));
    // this.store.select(isDeleted).subscribe((done) => {});
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.baseUrl + 'notify')
      .build();

    connection
      .start()
      .then(function () {
        console.log('SignalR Connected!');
      })
      .catch(function (err) {
        return console.error(err.toString());
      });

    // connection.on("BroadcastMessage", () => {
    //   this.getEmployeeData();
    // });
  }
  loadingError(error) {
    debugger;
    if (error) {
      alert('Error while loading the list of games');
    }
  }

  OpenaddEmployeeModel() {
    const modalRef = this.modalService.open(EmployeeEditComponent, { size: 'xl' });
    modalRef.componentInstance.name = 'World';
    
  }

  OpeneditEmployeeModel(id) {
    const modalRef = this.modalService.open(EmployeeEditComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    
  }
  private getDismissReason(reason: any): string {
    return `with: ${reason}`;
  }
  
   getemployeedata() {
     this.employeeService.getEmployees().subscribe(
       employees => {
         this.employees = employees;
         this.filteredEmployees = this.employees;
       },
       error => this.errorMessage = <any>error
    );
   }

  // deleteEmployee(id: string, name: string): void {
  //   if (id === '') {
  //     this.onSaveComplete();
  //   } else {
  //     if (confirm(`Are you sure want to delete this Employee: ${name}?`)) {
  //       this.employeeService.deleteEmployee(id)
  //         .subscribe(
  //           () => this.onSaveComplete(),
  //           (error: any) => this.errorMessage = <any>error
  //         );
  //     }
  //   }
  // }

  // onSaveComplete(): void {
  //   this.employeeService.getEmployees().subscribe(
  //     employees => {
  //       this.employees = employees;
  //       this.filteredEmployees = this.employees;
  //     },
  //     error => this.errorMessage = <any>error
  //   );
  // }
}
