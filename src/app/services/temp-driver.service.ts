import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverDTO } from '../Models/driver';
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class TempDriverService {
  
  private driverData: any;
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
 
  setDriverData(data: any) {
    this.driverData = data;
  }
   
  getDriverData() {
    return this.driverData;
  }
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

  searchByLicense(licenceRegion: number, licenseCategory: number, licenseNumber: string): Observable<DriverDTO> {
    if (!licenseNumber || !licenseNumber.trim()) {
      throw new Error('License number is required.');
    }
  
    const params = new HttpParams()
    .set('licenseRegion', licenceRegion.toString())  
    .set('licenseCategory', licenseCategory.toString())
    .set('licenseNumber', licenseNumber.trim());
  
    return this.http.get<DriverDTO>(`${this.baseUrl}/Driver/search-by-license`, { params });
  }
  
  searchByName(firstName: string, middleName?: string, lastName?: string): Observable<DriverDTO> {
    let params = new HttpParams().set('firstName', firstName.trim());

    if (middleName) params = params.set('middleName', middleName.trim());
    if (lastName) params = params.set('lastName', lastName.trim());

    return this.http.get<DriverDTO>(`${this.baseUrl}/Driver/search-by-name`, { params });
  }
}
