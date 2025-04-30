import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TemporaryDriverRegistration } from '../../Models/TemporaryDriverRegistration';

@Injectable({
  providedIn: 'root'
})
export class TemporaryDriverRegistrationService {
  private apiUrl = '';
 
  // Sample data for dropdowns (would typically come from backend)
  private regions = [
    'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 
    'Dire Dawa', 'Gambela', 'Harari', 'Oromia', 
    'Sidama', 'Somali', 'Southern Nations, Nationalities, and Peoples', 
    'South West Ethiopia Peoples', 'Tigray'
  ];

  private licenseLevels = ['Level 1', 'Level 2', 'Level 3', 'Level 4'];
  private genders = ['Male', 'Female'];
  private nationalities = ['Ethiopian', 'Kenya', 'Sudan','South Africa'];

  // Mock data for issuer stations (would come from backend based on region)
  private issuerStationsMap: {[key: string]: string[]} = {
    'Addis Ababa': ['Main Office', 'Kirkos', 'Kolfe', 'Nifas Silk'],
    'Afar': ['Semera'],
    'Oromia': ['Adama', 'Ambo', 'Bishoftu', 'Jimma'],
    'Amhara': ['Bahir Dar', 'Debre Markos', 'Dessie', 'Gondar'],
    'Tigray': ['Mekelle','Adigrat', 'Axum', 'Shire', 'Adwa'],
    'Dire Dawa': ['Dire Dawa'],
    'Gambela': ['Gambela'],
    'Harari': ['Harari'],
    'Somali': ['Jijiga'],
    'Benishangul-Gumuz': ['Asosa'],
    'Southern Nations, Nationalities, and Peoples': ['Hawassa','Gurage', 'Wolayita'],
    // ... other regions
  };

  // Mock data for address hierarchy (would come from backend)
  private zonesMap: {[key: string]: string[]} = {
    'Addis Ababa': ['Central', 'Eastern', 'Western', 'Northern', 'Southern'],
    'Oromia': ['East Shewa', 'West Shewa', 'North Shewa', 'Arsi', 'Bale'],
    // ... other regions
  };

  private districtsMap: {[key: string]: string[]} = {
    'Central': ['Arada', 'Addis Ketema', 'Kirkos', 'Lideta'],
    'Eastern': ['Akaki Kaliti', 'Bole', 'Nifas Silk-Lafto', 'Yeka'],
    // ... other zones
  };

  private kebelesMap: {[key: string]: string[]} = {
    'Arada': ['01', '02', '03', '04', '05'],
    'Addis Ketema': ['01', '02', '03', '04', '05'],
    // ... other districts
  };

  constructor(private http: HttpClient) { }

  // Get dropdown options
  getRegions(): Observable<string[]> {
    return of(this.regions);
  }

  getIssuerStations(region: string): Observable<string[]> {
    const stations = this.issuerStationsMap[region] || [];
    return of(stations);
  }

  getLicenseLevels(): Observable<string[]> {
    return of(this.licenseLevels);
  }

  getGenders(): Observable<string[]> {
    return of(this.genders);
  }

  getNationalities(): Observable<string[]> {
    return of(this.nationalities);
  }

  getZones(region: string): Observable<string[]> {
    const zones = this.zonesMap[region] || [];
    return of(zones);
  }

  getDistricts(zone: string): Observable<string[]> {
    const districts = this.districtsMap[zone] || [];
    return of(districts);
  }

  getKebeles(district: string): Observable<string[]> {
    const kebeles = this.kebelesMap[district] || [];
    return of(kebeles);
  }

  // CRUD Operations
  registerDriver(tdr: TemporaryDriverRegistration): Observable<TemporaryDriverRegistration> {
    return this.http.post<TemporaryDriverRegistration>(this.apiUrl, tdr);
  }

  getDriverById(id: string): Observable<TemporaryDriverRegistration> {
    return this.http.get<TemporaryDriverRegistration>(`${this.apiUrl}/${id}`);
  }

  updateDriver(id: string, tdr: TemporaryDriverRegistration): Observable<TemporaryDriverRegistration> {
    return this.http.put<TemporaryDriverRegistration>(`${this.apiUrl}/${id}`, tdr);
  }

  deleteDriver(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Helper method to validate license number (example)
  validateLicenseNumber(number: string): Observable<{ valid: boolean, message?: string }> {
    // Simple validation - in real app would check with backend
    const isValid = /^[A-Za-z0-9]{8,15}$/.test(number);
    return of({
      valid: isValid,
      message: isValid ? undefined : 'License number must be 8-15 alphanumeric characters'
    });
  }
}