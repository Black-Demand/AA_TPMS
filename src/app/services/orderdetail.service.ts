import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { OrderDetailDTO, OrderWithPenalityRequest } from '../Models/OrderDetail';

@Injectable({
  providedIn: 'root'
})
export class OrderdetailService {

  private baseURL = environment.baseUrl;

  constructor(private http : HttpClient) { }
  
  getAll(): Observable<OrderDetailDTO[]> {
    return this.http.get<OrderDetailDTO[]>(`${this.baseURL}`);
  }

  getById(id: number): Observable<OrderDetailDTO> {
    return this.http.get<OrderDetailDTO>(`${this.baseURL}/${id}`);
  }

  create(orderWithPenality: OrderWithPenalityRequest): Observable<OrderDetailDTO> {
    return this.http.post<OrderDetailDTO>(`${this.baseURL}/OrderDetail` , orderWithPenality);
  }

  update(id: number, dto: OrderDetailDTO): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }
}
