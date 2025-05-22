import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import Dashboard from '../Models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashborardSummaryService {


  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

   getPenaltiesByRegion(): Observable<Dashboard.RegionPenalityCountDTO[]> {
    return this.http.get<Dashboard.RegionPenalityCountDTO[]>(`${this.baseUrl}/DashboardSummary/penalties-by-region`);
  }

  getPenaltyMoneyByRegionSummary(region: string): Observable<Dashboard.RegionPenalityMoneySummaryDTO[]> {
    const params = new HttpParams().set('region', region);
    return this.http.get<Dashboard.RegionPenalityMoneySummaryDTO[]>(`${this.baseUrl}/DashboardSummary/penalty-money-by-region-summary`, { params });
  }

  getPenalitySummaryByViolationGradeAndSex(): Observable<Dashboard.PenalitySexGradeSummaryDTO[]> {
    return this.http.get<Dashboard.PenalitySexGradeSummaryDTO[]>(`${this.baseUrl}/DashboardSummary/summary-by-violation-grade-and-sex`);
  }
}
