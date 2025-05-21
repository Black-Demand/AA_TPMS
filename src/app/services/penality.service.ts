import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { Penality } from '../Models/penality';

@Injectable({
  providedIn: 'root'
})
export class PenalityService {
  
  private baseUrl = environment.baseUrl;


  constructor(private http : HttpClient) { }

  getAllPenalties(): Observable<Penality[]> {
    return this.http.get<Penality[]>(this.baseUrl);
  }

  getPenalityById(id: number): Observable<Penality> {
    return this.http.get<Penality>(`${this.baseUrl}/${id}`);
  }
createPenality(dto: any, licenseNumber: string): Observable<any> {
  if (!licenseNumber) {
    throw new Error('Missing required driver information (licenseNumber).');
  }

  const params = new HttpParams()
    .set('licenseNumber', licenseNumber); 

  return this.http.post(`${this.baseUrl}/Penality`, dto, { params });
}


  updatePenality(penality: Penality): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${penality.penalityId}`, penality);
  }

  deletePenality(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
