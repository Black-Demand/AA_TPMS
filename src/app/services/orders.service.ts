import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { OrdersDTO } from '../Models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<OrdersDTO[]> {
    return this.http.get<OrdersDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<OrdersDTO> {
    return this.http.get<OrdersDTO>(`${this.baseUrl}/${id}`);
  }

  create(orderDto: OrdersDTO, licenseNo: string): Observable<any> {
    const params = new HttpParams().set('licenseNo', licenseNo);
    return this.http.post(`${this.baseUrl}/Orders`, orderDto, { params });
  }

  update(id: number, orderDto: OrdersDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, orderDto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
