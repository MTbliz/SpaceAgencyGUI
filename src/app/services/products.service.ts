import { Injectable } from '@angular/core';
import { ProductDTO } from '../models/ProductDTO';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Product } from '../models/Product';
import { Observable } from 'rxjs';
import { Coordinate } from '../models/Coordinate';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  APP_PRODUCT_URL = 'http://localhost:8080/products';
  APP_PRODUCT_SEARCH_URL = 'http://localhost:8080/search/products';

  httpOptions = {
    headers: new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
  };

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.APP_PRODUCT_URL, this.httpOptions);
  }

  getUserProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.APP_PRODUCT_URL + "/all", this.httpOptions);
  }

  createProduct(productDTO: ProductDTO) {
    const fd = new FormData();
    fd.append('file', productDTO.file);
    fd.append('mission', JSON.stringify(productDTO.mission));
    fd.append('acquisitionDate', productDTO.acquisitionDate.toISOString());
    fd.append('footprint', JSON.stringify(productDTO.footprint));
    fd.append('price', productDTO.price + "");

    return this.http.post<Product>(this.APP_PRODUCT_URL, fd, this.httpOptions);
  }

  deleteProduct(id: Number): Observable<{}> {
    const url = `${'http://localhost:8080/products'}/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  downloadFile(id: number, urlString: string): Observable<HttpResponse<Blob>> {
    const url = `${'http://localhost:8080/downloadFile'}/${id}/${urlString}`;
    return this.http.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json' });
  }

  getUserProductsByMissionName(missionName: string): Observable<Product[]> {
    let params = new HttpParams().set("missionName", missionName)
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
    return this.http.get<Product[]>(this.APP_PRODUCT_SEARCH_URL + "/missionName", { headers: headers, params: params });
  }

  getUserProductsByMissionType(missionType: string): Observable<Product[]> {
    let params = new HttpParams().set("productType", missionType)
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
    return this.http.get<Product[]>(this.APP_PRODUCT_SEARCH_URL + "/type", { headers: headers, params: params });
  }

  getUserProductsByCoordinate(coordinate: Coordinate): Observable<Product[]> {
    let params = new HttpParams()
      .set("latitude", coordinate.latitude + "")
      .set("longitude", coordinate.longitude + "")
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
    return this.http.get<Product[]>(this.APP_PRODUCT_SEARCH_URL + "/footprint", { headers: headers, params: params });
  }

  getUserProductsAcquisitionDateGreaterThen(date: Date): Observable<Product[]> {
    let acquisitionDate: Date = new Date(date)
    let params = new HttpParams().set("date", acquisitionDate.toISOString())
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
    return this.http.get<Product[]>(this.APP_PRODUCT_SEARCH_URL + "/greaterThenDate", { headers: headers, params: params });
  }

  getUserProductsAcquisitionDateLessThen(date: Date): Observable<Product[]> {
    let acquisitionDate: Date = new Date(date)
    let params = new HttpParams().set("date", acquisitionDate.toISOString())
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
    return this.http.get<Product[]>(this.APP_PRODUCT_SEARCH_URL + "/lessThenDate", { headers: headers, params: params });
  }

  getUserProductsAcquisitionDateBeetwen(date1: Date, date2: Date): Observable<Product[]> {
    let date1Compare: Date = new Date(date1)
    let date2Compare: Date = new Date(date2)
    let lessDate: Date;
    let greaterDate: Date;
    if (date1Compare.getTime() < date2Compare.getTime()) {
      lessDate = new Date(date1Compare)
      greaterDate = new Date(date2Compare)
    } else {
      lessDate = new Date(date2Compare)
      greaterDate = new Date(date1Compare)
    }

    let params = new HttpParams()
      .set("startDate", lessDate.toISOString())
      .set("endDate", greaterDate.toISOString())
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
    return this.http.get<Product[]>(this.APP_PRODUCT_SEARCH_URL + "/betweenDates", { headers: headers, params: params });
  }

  getUserProductsByMostOrdered(): Observable<Product[]> {
    return this.http.get<Product[]>(this.APP_PRODUCT_SEARCH_URL + '/mostordered', this.httpOptions);
  }
}

