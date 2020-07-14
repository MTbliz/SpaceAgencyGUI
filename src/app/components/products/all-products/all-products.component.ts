import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/models/Product';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectionModel } from '@angular/cdk/collections';
import { BasketService } from 'src/app/services/basket.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { Subscription } from 'rxjs';
import { Coordinate } from 'src/app/models/Coordinate';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  providers: [ProductsService, BasketService],
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  subscription: Subscription;
  products: Product[] = [];
  displayedColumns: string[] = ['select', 'missionName', 'image', 'acquisitionDate', 'coordinates', 'productPrice', 'actions'];
  dataSource = new MatTableDataSource(this.products);
  selection = new SelectionModel<Product>(true, []);

  constructor(private productsService: ProductsService, private basketService: BasketService, private sanitizer: DomSanitizer, private communicationService: CommunicationService) {
    this.subscription = this.communicationService.getMessage().subscribe(message => {
      let content: string = message;
      let condition = content.split(':')[0]
      this.chooseSearchMethod(condition, content);
    });
  }

  ngOnInit(): void {
    this.getUserProducts();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  OrderSelected() {
    const products: Product[] = this.selection.selected;
    this.basketService.addProducts(products)
    this.selection.clear();
  }

  loadProductsFromCart() {
    this.basketService.loadProducts();
  }

  getUserProducts() {
    this.productsService.getUserProducts()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
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
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
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

  chooseSearchMethod(condition: string, content: string) {
    if (condition == 'missionName') {
      let missionName: string = content.split(/:(.+)/)[1];
      this.searchByMissionName(missionName);
    } else if (condition == 'missionType') {
      let missionType: string = content.split(/:(.+)/)[1];
      this.searchByMissionType(missionType);
    } else if (condition == 'coordinate') {
      let coordinateString: string = content.split(/:(.+)/)[1];
      let coordinate: Coordinate = JSON.parse(coordinateString)
      this.searchByCoordinate(coordinate);
    } else if (condition == 'greaterThenDate') {
      let greaterDateString: string = content.split(/:(.+)/)[1];
      let date: Date = JSON.parse(greaterDateString)
      this.searchByAcquisitionDateGreaterThen(date);
    } else if (condition == 'lessThenDate') {
      let greaterDateString: string = content.split(/:(.+)/)[1];
      let date: Date = JSON.parse(greaterDateString)
      this.searchByAcquisitionDateLessThen(date);
    } else if (condition == 'startEndDate') {
      let greaterDateString: string = content.split(/:(.+)/)[1];
      let date: Date[] = JSON.parse(greaterDateString)
      this.searchByAcquisitionDateBetweenDates(date[0], date[1]);
    } else if (condition == 'mostOrdered') {
      this.searchByMostOrdered();
    }
  }

  //Searching methods

  searchByMissionName(missionName: string) {
    let missionNameToSearch: string = JSON.parse(missionName)
    this.productsService.getUserProductsByMissionName(missionNameToSearch)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  searchByMissionType(missionType: string) {
    let missionTypeToSearch: string = JSON.parse(missionType)
    this.productsService.getUserProductsByMissionType(missionTypeToSearch)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  searchByCoordinate(coordinate: Coordinate) {
    this.productsService.getUserProductsByCoordinate(coordinate)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });

  }

  searchByAcquisitionDateGreaterThen(date: Date) {
    this.productsService.getUserProductsAcquisitionDateGreaterThen(date)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  searchByAcquisitionDateLessThen(date: Date) {
    this.productsService.getUserProductsAcquisitionDateLessThen(date)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  searchByAcquisitionDateBetweenDates(date1: Date, date2: Date) {
    this.productsService.getUserProductsAcquisitionDateBeetwen(date1, date2)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  searchByMostOrdered() {
    this.productsService.getUserProductsByMostOrdered()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

}


