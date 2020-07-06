import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/models/Product';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  providers: [ProductsService],
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  products: Product[] = [];
  
  displayedColumns: string[] = ['select','missionName', 'image', 'acquisitionDate', 'coordinates', 'productPrice', 'actions'];
  dataSource = new MatTableDataSource(this.products);
  selection = new SelectionModel<Product>(true, []);

  constructor( private productsService: ProductsService, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.getUserProducts();
  }

  OrderSelected(){
  console.log(this.selection.selected)
  this.selection.clear();
  }

  getUserProducts() {
    this.productsService.getUserProducts()
      .subscribe(response => {
        console.log(response)
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  transform(bytecode: string){
    var newUrl= 'data:image/png;base64,' + bytecode;
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
}


