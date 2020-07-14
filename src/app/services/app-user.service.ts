import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser } from '../models/AppUser';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  APP_USER_URL_GET = 'http://localhost:8080/missions';

  httpOptions = {
    headers: new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
  };

  constructor(private http: HttpClient) { }

  getAppUser(id: number): Observable<AppUser> {
    const url = `${'http://localhost:8080/appUser/search'}/${id}`;
    return this.http.get<AppUser>(url, this.httpOptions);
  }
}
