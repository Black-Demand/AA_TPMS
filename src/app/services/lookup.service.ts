import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Lookup from '../Models/lookup';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LookupService {


  private baseUrl = environment.baseUrl;


  constructor(private http:HttpClient) { }


  //address lookup

  getRegions(): Observable<Lookup.RegionDTO[]> {
    // console.log('Calling getRegions()');
    return this.http.get<Lookup.RegionDTO[]>(`${this.baseUrl}/regions`);
  }

  getZonesByRegion(regionCode: number): Observable<Lookup.ZoneDTO[]> {
    return this.http.get<Lookup.ZoneDTO[]>(`${this.baseUrl}/AddressLookUp/by-region/${regionCode}`);
  }
  

  getWoredasByZone(zoneCode: number): Observable<Lookup.WoredaDTO[]> {
    return this.http.get<Lookup.WoredaDTO[]>(`${this.baseUrl}/AddressLookUp/by-zone/${zoneCode}`);
  }

  getKebelesByWoreda(woredaCode: number): Observable<Lookup.KebeleDTO[]> {
    return this.http.get<Lookup.KebeleDTO[]>(`${this.baseUrl}/AddressLookUp/by-woreda/${woredaCode}`);
  }

  // licence lookup
  getByCatCode(code: number): Observable<Lookup.LicenceCategoryDTO> {
    return this.http.get<Lookup.LicenceCategoryDTO>(`${this.baseUrl}/LicenceLookUp/category/${code}`);
  }

  getByRegCode(code: number): Observable<Lookup.LicenceRegionDTO> {
    return this.http.get<Lookup.LicenceRegionDTO>(`${this.baseUrl}/region/${code}`);
  }
  getAllAreas(regionParentCode: number): Observable<Lookup.LicenceAreaDTO[]> {
    const params = new HttpParams().set('regionParentCode', regionParentCode);
    return this.http.get<Lookup.LicenceAreaDTO[]>(`${this.baseUrl}/LicenceLookUp/areas`, { params });
  }
  
  
   // other lookups for dropdown 
  getAllCategories(): Observable<Lookup.LicenceCategoryDTO[]> {
    return this.http.get<Lookup.LicenceCategoryDTO[]>(`${this.baseUrl}/LicenceLookUp/categories`);
  }

  getAllRegions(): Observable<Lookup.LicenceRegionDTO[]> {
    return this.http.get<Lookup.LicenceRegionDTO[]>(`${this.baseUrl}/LicenceLookUp/regions`);
  }

  getAllLookups(): Observable<Lookup.LookupDTO[]> {
    return this.http.get<Lookup.LookupDTO[]>(`${this.baseUrl}/LicenceLookUp/lookups`);
  }

  getAllMajors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/LicenceLookUp/majors`);
  }

  getAllOffences(): Observable<Lookup.OffenceGradeDTO[]> {
    return this.http.get<Lookup.OffenceGradeDTO[]>(`${this.baseUrl}/LicenceLookUp/offences`);
  }

  getAllSites(): Observable<Lookup.SiteDTO[]> {
    return this.http.get<Lookup.SiteDTO[]>(`${this.baseUrl}/LicenceLookUp/sites`);
  }

  getAllVehicles(): Observable<Lookup.VehicleBodyTypeDTO[]> {
    return this.http.get<Lookup.VehicleBodyTypeDTO[]>(`${this.baseUrl}/LicenceLookUp/vichelbodytypes`);
  }

  getAllOffencePoints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/LicenceLookUp/offencepoints`);
  }

  getAllInjunctionTypes(): Observable<Lookup.InjunctionTypeDTO[]> {
    return this.http.get<Lookup.InjunctionTypeDTO[]>(`${this.baseUrl}/LicenceLookUp/injunctiontypes`);
  }

  getAllKifleKetema(): Observable<Lookup.KifleketemaDTO[]> {
    return this.http.get<Lookup.KifleketemaDTO[]>(`${this.baseUrl}/LicenceLookUp/kifleketema`);
  }
  getAllNationality(): Observable<Lookup.LookupDTO[]> {
    return this.http.get<Lookup.LookupDTO[]>(`${this.baseUrl}/LicenceLookUp/nationalities`);
  }
  getAllOffenceNew(offenceGradeCodes: string[]): Observable<Lookup.OffenceNewDTO[]> {
    const params = new HttpParams({ fromObject: { offenceGradeCodes } });
    return this.http.get<Lookup.OffenceNewDTO[]>(`${this.baseUrl}/LicenceLookUp/offencenew`, { params });
  }
   getCustomOffenceGrades(): Observable<Lookup.OffenceGradeDTO[]> {
    return this.http.get<Lookup.OffenceGradeDTO[]>(`${this.baseUrl}/LicenceLookUp/customoffences`);
  }
} 
