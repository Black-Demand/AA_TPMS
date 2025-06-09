import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { PenalityForTraffic } from '../Models/penalityForTraffic';

@Injectable({
  providedIn: 'root'
})
export class PenalityfortrafficService {


  private baseUrl = environment.baseUrl;
  constructor(private http : HttpClient) { }

    getAll(): Observable<PenalityForTraffic[]> {
    return this.http.get<PenalityForTraffic[]>(`${this.baseUrl}`);
  }

  getById(id: number): Observable<PenalityForTraffic> {
    return this.http.get<PenalityForTraffic>(`${this.baseUrl}/${id}`);
  }

 createPenalityForTraffic(dto: any, licenseNumber: string): Observable<PenalityForTraffic> {
  if (!licenseNumber) {
    throw new Error('Missing required driver information (licenseNumber).');
  }

  const params = new HttpParams().set('licenseNumber', licenseNumber);

  return this.http.post<PenalityForTraffic>(
    `${this.baseUrl}/PenalityForTraffic`,
    dto,
    { params }
  );
}




  update(id: number, dto: PenalityForTraffic): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
