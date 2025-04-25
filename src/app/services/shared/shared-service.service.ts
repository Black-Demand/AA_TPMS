import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  private driverData: any;
  
  setDriverData(data: any) {
    this.driverData = data;
  }
   
  getDriverData() {
    return this.driverData;
  }
  constructor() { }
}
