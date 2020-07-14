import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/models/Product';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { BasketService } from 'src/app/services/basket.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { AppUserService } from 'src/app/services/app-user.service';
import { AppUser } from 'src/app/models/AppUser';
import { TokenStorageService } from 'src/app/security/_services/token-storage.service';
import { OrdersService } from 'src/app/services/orders.service';
import { CustomerOrder } from 'src/app/models/CustomerOrder';

@Component({
  selector: 'app-basket-products',
  templateUrl: './basket-products.component.html',
  styleUrls: ['./basket-products.component.css']
})
export class BasketProductsComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  currentUser: AppUser;
  products: Product[] = [];
  displayedColumns: string[] = ['select', 'missionName', 'image', 'acquisitionDate', 'coordinates', 'productPrice', 'actions'];
  dataSource = new MatTableDataSource(this.products);
  selection = new SelectionModel<Product>(true, []);

  constructor(private basketService: BasketService, private appUserService: AppUserService, private tokenStorage: TokenStorageService,
    private orderService: OrdersService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getBasketProducts();
    this.getCurrentUser();
  }

  getCurrentUser() {
    let appUserid: number = this.tokenStorage.getUser().id;
    this.appUserService.getAppUser(appUserid).subscribe(response => {
      this.currentUser = response;
    });
  }

  OrderSelected() {
    const products: Product[] = this.selection.selected;
    this.basketService.addProducts(products)
    this.selection.clear();
  }

  loadProductsFromCart() {
    this.basketService.loadProducts();
  }

  removeProductFromCart() {
    const products: Product[] = this.selection.selected;
    this.basketService.removeProducts(products)
    this.selection.clear();
  }


  getBasketProducts() {
    let loadedProducts: Product[] = this.basketService.loadProducts()
    if (loadedProducts != null) {
      this.dataSource = new MatTableDataSource(loadedProducts);
      this.products = loadedProducts;
    } else {
      loadedProducts = [];
      this.dataSource = new MatTableDataSource(loadedProducts);
      this.products = loadedProducts;
    }
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  orderProducts() {
    let customerOrder: CustomerOrder = new CustomerOrder(null, this.currentUser, this.products, new Date())
    this.orderService.createCustomerOrder(customerOrder).subscribe();
    this.basketService.clearCart();
  }

  transform(bytecode: string) {
    var newUrl = 'data:image/png;base64,' + bytecode;
    return this.sanitizer.bypassSecurityTrustResourceUrl(newUrl);
  }

  applyFilterProducts(filterValue: string) {
    const dataPipe: DatePipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      const formattedacquisitionDate = dataPipe.transform(data.acquisitionDate, 'MM/dd/yyyy');


      return data.footprint.coordinates.map(coordinate => coordinate.latitude).join("").toLowerCase().includes(filter) ||
        data.footprint.coordinates.map(coordinate => coordinate.longitude).join("").toLowerCase().includes(filter) ||
        data.mission.name.toLowerCase().includes(filter) ||
        defaultPredicate(data, filter) ||
        formattedacquisitionDate.indexOf(filter) >= 0
        ;
    };
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    var numSelected: number;
    var numRows: number;

    if (this.dataSource.data != null) {
      numSelected = this.selection.selected.length;
      numRows = this.dataSource.data.length;
    } else {
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(index?: number, row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${index + 1}`;
  }

}

