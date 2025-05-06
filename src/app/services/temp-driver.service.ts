import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverDTO } from '../Models/driver';
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class TempDriverService {

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getAllDrivers(): Observable<DriverDTO[]> {
    return this.http.get<DriverDTO[]>(`${this.baseUrl}`);
  }

  getDriverByLicense(licenseNo: string): Observable<DriverDTO> {
    return this.http.get<DriverDTO>(`${this.baseUrl}/byLicence${licenseNo}`);
  }

  createDriver(driver: DriverDTO): Observable<DriverDTO> {
    return this.http.post<DriverDTO>(`${this.baseUrl}/Driver`, driver);
  }

  updateDriver(licenseNo: string, driver: DriverDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${licenseNo}`, driver);
  }

  deleteDriver(licenseNo: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${licenseNo}`);
  }

  searchByLicense(licenseCategory: number, licenseNumber: string): Observable<DriverDTO> {
    const params = new HttpParams()
      .set('licenseCategory', licenseCategory)
      .set('licenseNumber', licenseNumber.trim());

    return this.http.get<DriverDTO>(`${this.baseUrl}/search-by-license`, { params });
  }

  searchByName(firstName: string, middleName?: string, lastName?: string): Observable<DriverDTO> {
    let params = new HttpParams().set('firstName', firstName.trim());

    if (middleName) params = params.set('middleName', middleName.trim());
    if (lastName) params = params.set('lastName', lastName.trim());

    return this.http.get<DriverDTO>(`${this.baseUrl}/search-by-name`, { params });
  }
}
