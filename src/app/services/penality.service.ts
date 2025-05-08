import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
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

  createPenality(penality: Penality): Observable<Penality> {
    return this.http.post<Penality>(this.baseUrl, penality);
  }

  updatePenality(penality: Penality): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${penality.penalityId}`, penality);
  }

  deletePenality(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
