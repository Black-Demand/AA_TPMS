import { Component, OnInit } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { DashborardSummaryService } from '../../services/dashborard-summary.service';
import { CommonModule } from '@angular/common';
import Dashboard from '../../Models/dashboard';
import Lookup from '../../Models/lookup';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { LookupService } from '../../services/lookup.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-menu',
  imports: [NgxChartsModule, CommonModule, MatSelectModule, FormsModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent implements OnInit{
 view: [number, number] = [700, 400];
  results: any[] = [];
  regionPenalties: any[] = [];
  penalityMoneyAmount : any[] =[];
  regions: Lookup.RegionDTO[] = [];
  selectedRegion: string = '';
  filteredRegionPenalties: any[] = [];



  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  xAxisLabel = 'Violation Grade';
  yAxisLabel = 'Count';
  colorScheme: Color = {
  name: 'customScheme',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#6495ED', '#90ee90']
};


  constructor(private dashboardService: DashborardSummaryService,
              private lookupservice: LookupService,
  ) {}

  ngOnInit(): void {
    this.dashboardService.getPenalitySummaryByViolationGradeAndSex().subscribe(data => {
      this.results = this.transformData(data);
    });

    this.dashboardService.getPenaltiesByRegion().subscribe(data => {
      this.regionPenalties = this.tranformDatas(data);
    })

    this.dashboardService.getPenaltyMoneyByRegionSummary(this.selectedRegion).subscribe(data => {
      this.penalityMoneyAmount = this.transformdatss(data)
    })
  }

  transformData(data: Dashboard.PenalitySexGradeSummaryDTO[]): any[] {
    return data.map(item => ({
      name: item.violationGrade,
      series: [
        { name: 'Male', value: item.maleCount },
        { name: 'Female', value: item.femaleCount }
      ]
    }));
  }

  tranformDatas(data : Dashboard.RegionPenalityCountDTO[]) :any {
    return data.map(item => ({
      name: item.region.toString(),
      value: item.penaltyCount
    }))
  }

  transformdatss(data : Dashboard.RegionPenalityMoneySummaryDTO[]): any {
    return data.map(item => ({
      name : item.region,
      value: item.totalPenaltyAmount
    }))
  }

  onRegionChange(event: any): void {
  const selected = this.selectedRegion;
  this.filteredRegionPenalties = selected
    ? this.regionPenalties.filter(p => p.name === selected)
    : this.regionPenalties;
}

  loadRegions() {
    this.lookupservice.getRegions().subscribe(data => {
      this.regions = data;
    });
  }
}
