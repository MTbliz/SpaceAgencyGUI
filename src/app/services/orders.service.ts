import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerOrder } from '../models/CustomerOrder';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  APP_ORDER_URL = 'http://localhost:8080/orders';

  httpOptions = {
    headers: new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
  };

  constructor(private http: HttpClient) { }

  createCustomerOrder(customerorder: CustomerOrder) {
    
    return this.http.post<CustomerOrder>(this.APP_ORDER_URL, customerorder, this.httpOptions);
  }
}
