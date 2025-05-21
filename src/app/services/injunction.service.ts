import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { InjunctionDTO } from '../Models/Injunction';

@Injectable({
  providedIn: 'root'
})
export class InjunctionService {

  private baseUrl = environment.baseUrl;
  constructor(private http : HttpClient) { }

  getAll(): Observable<InjunctionDTO[]> {
    return this.http.get<InjunctionDTO[]>(`${this.baseUrl}/LicenceLookUp/customoffences`);
  }

  getById(id: number): Observable<InjunctionDTO> {
    return this.http.get<InjunctionDTO>(`${this.baseUrl}/${id}`);
  }


create(dto: any, licenseNo: string): Observable<any> {
  if (!licenseNo) {
    throw new Error('Missing required driver information (licenseNumber).');
  }

  const params = new HttpParams().set('licenseNo', licenseNo); 

  return this.http.post(`${this.baseUrl}/Injunction`, dto, { params });
}


  update(id: number, dto: InjunctionDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

