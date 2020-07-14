import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { CustomerOrder } from 'src/app/models/CustomerOrder';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  @ViewChild('orderForm') orderForm: NgForm;
  @ViewChild('fileInput') fileInput;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  customerOrders: CustomerOrder[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'orderDate', 'products', 'actions'];
  dataSource = new MatTableDataSource(this.customerOrders);


  constructor(private orderService: OrdersService) { }

  ngOnInit(): void {
    this.getCustomerOrders();
  }

  applyFilterProducts(filterValue: string) {
    const dataPipe: DatePipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      const formattedOrderDate = dataPipe.transform(data.orderDate, 'MM/dd/yyyy');

      return data.customer.firstName.toLowerCase().includes(filter) ||
        data.customer.lastName.toLowerCase().includes(filter) ||
        data.productList.map(product => product.id).join("").toLowerCase().includes(filter) ||
        defaultPredicate(data, filter) ||
        formattedOrderDate.indexOf(filter) >= 0
        ;

    };
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getCustomerOrders() {
    this.orderService.getCustomerOrders()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'firstName': return item.customer.firstName;
            case 'lastName': return item.customer.lastName;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(response)
      });
  }

  getUserOrdersByFirstLastName() {
    let firstName: string = this.orderForm.value.firstName;
    let lastName: string = this.orderForm.value.lastName;
    this.orderService.getCustomerOrdersByFirstNameLastName(firstName, lastName)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'firstName': return item.customer.firstName;
            case 'lastName': return item.customer.lastName;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
}
