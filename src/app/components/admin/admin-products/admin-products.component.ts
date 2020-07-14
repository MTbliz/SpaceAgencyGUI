import { Component, OnInit, ViewChild } from '@angular/core';
import { MissionsService } from 'src/app/services/missions.service';
import { Mission } from 'src/app/models/Mission';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductsService } from 'src/app/services/products.service';
import { ProductDTO } from 'src/app/models/ProductDTO';
import { FootprintDTO } from 'src/app/models/FootprintDTO';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/models/Product';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  providers: [MissionsService, ProductsService],
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  @ViewChild('productForm') productForm: NgForm;
  @ViewChild('fileInput') fileInput;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  missions: Mission[] = null;
  products: Product[] = [];
  fileToUpload: File = null;
  displayedColumns: string[] = ['missionName', 'acquisitionDate', 'coordinates', 'image', 'productPrice', 'actions'];
  dataSource = new MatTableDataSource(this.products);

  constructor(private missionsService: MissionsService, private productsService: ProductsService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getMissions();
    this.getProducts();
  }

  private getMissions() {
    this.missionsService.getMissions()
      .subscribe(response => {
        this.missions = response;
      });
  }

  getProducts() {
    this.productsService.getProducts()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.paginator = this.paginator;
      });
  }

  onUpload() {
    const mission: Mission = new Mission(
      this.productForm.value.mission.id,
      this.productForm.value.mission.name,
      null,
      null,
      null,
      null);
    const foorPrintDTO: FootprintDTO = new FootprintDTO(
      null,
      { id: null, latitude: this.productForm.value.coordinate1Latitude, longitude: this.productForm.value.coordinate1Longitude },
      { id: null, latitude: this.productForm.value.coordinate2Latitude, longitude: this.productForm.value.coordinate2Longitude },
      { id: null, latitude: this.productForm.value.coordinate3Latitude, longitude: this.productForm.value.coordinate3Longitude },
      { id: null, latitude: this.productForm.value.coordinate4Latitude, longitude: this.productForm.value.coordinate4Longitude },
    )

    const productDTO: ProductDTO = new ProductDTO(
      mission,
      this.productForm.value.acquisitionDate,
      foorPrintDTO,
      this.productForm.value.price,
      this.fileToUpload
    )
    this.productsService.createProduct(productDTO)
      .subscribe(response => {
        console.log(response);
        this.dataSource.data.push(response);
        this.dataSource = new MatTableDataSource(this.dataSource.data);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'productPrice': return item.price;
            case 'missionName': return item.mission.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    this.clearForm();
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
        (data.price + '').toLowerCase().includes(filter) ||
        data.mission.name.toLowerCase().includes(filter) ||
        defaultPredicate(data, filter) ||
        formattedacquisitionDate.indexOf(filter) >= 0
        ;
    };
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onFileSelected(event) {
    this.fileToUpload = <File>event.target.files.item(0);
    this.fileInput.nativeElement.value = '';
  }

  clearForm() {
    this.productForm.reset();
    this.fileToUpload = null;
  }

  downloadFile(row) {
    this.productsService.downloadFile(row.fileDb.id, row.fileDb.fileName).subscribe(res => {
      var contentDisposition = res.headers.get('content-disposition');
      console.log(contentDisposition)
      var fileName = contentDisposition.split('attachment; filename=')[1].replace(/"/g, '').trim();
      var data = res.body;
      var blob = new Blob([data], { type: 'application/octet-stream' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();
    });
  }

  deleteRecord(row, index) {
    this.productsService.deleteProduct(row.id).subscribe();
    this.dataSource.data.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}

