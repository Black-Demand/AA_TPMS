import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { Penality } from '../Models/penality';
import { PenalityViewDTO } from '../Models/PenalityViewDTO';
import { ApiResult } from '../Models/ApiResult';

@Injectable({
  providedIn: 'root'
})
export class PenalityService {
  
  private baseUrl = environment.baseUrl;


  constructor(private http : HttpClient) { }

  getAllPenalties(): Observable<Penality[]> {
    return this.http.get<Penality[]>(`${this.baseUrl}/Penality`);
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

  //  getPenaltiesWithDriverInfo(): Observable<PenalityViewDTO[]> {
  //   return this.http.get<PenalityViewDTO[]>(`${this.baseUrl}/Penal/with-driver-info`);
  // }

   getPenaltiesWithDriverInfo(
    pageIndex: number,
    pageSize: number,
    sortColumn?: string,
    sortOrder?: string,
    filterColumn?: string,
    filterQuery?: string
  ): Observable<ApiResult<PenalityViewDTO>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (sortColumn) params = params.set('sortColumn', sortColumn);
    if (sortOrder) params = params.set('sortOrder', sortOrder);
    if (filterColumn) params = params.set('filterColumn', filterColumn);
    if (filterQuery) params = params.set('filterQuery', filterQuery);

    return this.http.get<ApiResult<PenalityViewDTO>>(
      `${this.baseUrl}/Penal/with-driver-info`,
      { params }
    );
  }
}

