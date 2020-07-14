import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CustomerOrder } from '../models/CustomerOrder';
import { Observable } from 'rxjs';

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

  getCustomerOrders(): Observable<CustomerOrder[]> {
    return this.http.get<CustomerOrder[]>(this.APP_ORDER_URL, this.httpOptions);
  }

  getCustomerOrdersByFirstNameLastName(firstName: string, lastName: string): Observable<CustomerOrder[]> {
    let params = new HttpParams()
      .set("firstName", firstName)
      .set("lastName", lastName)
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
    return this.http.get<CustomerOrder[]>(this.APP_ORDER_URL + "/search/customer", { headers: headers, params: params });
  }

  getCustomerOrdersByCustomerId(id: number): Observable<CustomerOrder[]> {
    const url = `${'http://localhost:8080/orders/myorders'}/${id}`;
    return this.http.get<CustomerOrder[]>(url, this.httpOptions);
  }

}
