import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { InjunctionDTO } from '../Models/Injunction';
import { ApiResult } from '../Models/ApiResult';

@Injectable({
  providedIn: 'root',
})
export class InjunctionService {
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(): Observable<InjunctionDTO[]> {
    return this.http.get<InjunctionDTO[]>(`${this.baseUrl}/Injunction`);
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

  getPagedInjunctions(
  pageIndex: number,
  pageSize: number,
  sortColumn?: string,
  sortOrder?: string,
  filterColumn?: string,
  filterQuery?: string
): Observable<ApiResult<InjunctionDTO>> {
  let params = new HttpParams()
    .set('pageIndex', pageIndex.toString())
    .set('pageSize', pageSize.toString());

  if (sortColumn) params = params.set('sortColumn', sortColumn);
  if (sortOrder) params = params.set('sortOrder', sortOrder);
  if (filterColumn) params = params.set('filterColumn', filterColumn);
  if (filterQuery) params = params.set('filterQuery', filterQuery);

  return this.http.get<ApiResult<InjunctionDTO>>(
    `${this.baseUrl}/Injunction/paged`, 
    { params }
  );
}

}

