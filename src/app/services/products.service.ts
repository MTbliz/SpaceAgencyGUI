import { Injectable } from '@angular/core';
import { ProductDTO } from '../models/ProductDTO';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Product } from '../models/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  APP_PRODUCT_URL = 'http://localhost:8080/products';

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

  downloadFile(id: number, urlString: string): Observable<HttpResponse<Blob>> {
    const url = `${'http://localhost:8080/downloadFile'}/${id}/${urlString}`;
    return this.http.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json' });
  }

  downloadFile2(urlString: string): Observable<HttpResponse<Blob>> {
    const url = `${urlString}`;
    return this.http.get<Blob>(url, { observe: 'response', responseType: 'blob' as 'json' });
  }
}

