import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CustomerOrder } from 'src/app/models/CustomerOrder';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/services/orders.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { TokenStorageService } from 'src/app/security/_services/token-storage.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  customerOrders: CustomerOrder[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'orderDate', 'products', 'actions'];
  dataSource = new MatTableDataSource(this.customerOrders);

  constructor(private orderService: OrdersService, private appUserService: AppUserService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.getCurrentCustomerOrders();
  }


  getCurrentCustomerOrders() {
    let appUserid: number = this.tokenStorage.getUser().id;
    this.orderService.getCustomerOrdersByCustomerId(appUserid)
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
