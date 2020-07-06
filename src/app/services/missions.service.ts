import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mission } from '../models/Mission';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissionsService {

  APP_MISSION_URL_GET = 'http://localhost:8080/missions';

  httpOptions = {
    headers: new HttpHeaders({ 'Access-Control-Allow-Origin': 'http://localhost:4200' })
  };

  constructor(private http: HttpClient) { }


  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.APP_MISSION_URL_GET, this.httpOptions);
  }

  createMission(mission: Mission) {
    const fd = new FormData();
    fd.append('file', mission.fileDb);
    fd.append('name', mission.name);
    fd.append('type', mission.type);
    fd.append('startDate', mission.startDate.toISOString());
    fd.append('finishDate', mission.finishDate.toISOString());
    return this.http.post<Mission>(this.APP_MISSION_URL_GET, fd, this.httpOptions);
  }

  deleteMission(id: Number): Observable<{}> {
    const url = `${'http://localhost:8080/missions'}/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  updateMission(mission: Mission): Observable<{}> {
    const url = `${'http://localhost:8080/missions'}/${mission.id}`;
    return this.http.put(url, mission, this.httpOptions);
  }
}
