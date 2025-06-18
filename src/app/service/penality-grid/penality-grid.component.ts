import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MatCellDef,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PenalityService } from '../../services/penality.service';
import { Penality } from '../../Models/penality';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-penality-grid',
  imports: [
    MatCardModule,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatTableModule,
    TranslateModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './penality-grid.component.html',
  styleUrl: './penality-grid.component.css',
})
export class PenalityGridComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>();
  pageSize = 10;
  pageIndex = 0;
  totalCount = 0;
  sortColumn: string = 'fullname';
  sortOrder: string = 'asc';

  constructor(
    private translate: TranslateService,
    private penalityService: PenalityService
  ) {}

  displayedColumns: string[] = [
    'sr_no',
    'fullname',
    'licenseNo',
    'ticketNo',
    'violationDate',
    'accusedDate',
    'violationGrade',
    'pointPayment',
    'totalAmount',
    'orderNo',
    'payStatus',
    'suspened',
  ];

  loadPenalties(): void {
    this.penalityService
      .getPenaltiesWithDriverInfo(
        this.pageIndex,
        this.pageSize,
        this.sortColumn,
        this.sortOrder
      )
      .subscribe({
        next: (result) => {
          this.dataSource.data = result.data.map((p, index) => ({
            sr_no: (this.pageIndex * this.pageSize + index + 1).toString(),
            fullname: p.fullName,
            licenseNo: p.licenceNo,
            ticketNo: p.ticketNo,
            violationDate: p.violationDate
              ? new Date(p.violationDate).toISOString().split('T')[0]
              : '',
            accusedDate: p.dateAccused
              ? new Date(p.dateAccused).toISOString().split('T')[0]
              : '',
            violationGrade: p.violationGrade,
            pointPayment: p.amount,
            totalAmount: p.totalAmount,
            orderNo: p.invoiceNo,
            payStatus: p.payStatus,
            suspened: p.suspened,
          }));

          this.totalCount = result.totalCount;
        },
        error: (err) => {
          console.error('Error loading penalties:', err);
        },
      });
  }

  ngOnInit(): void {
    this.loadPenalties();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.sortColumn = sort.active;
      this.sortOrder = sort.direction;
      this.pageIndex = 0;
      this.loadPenalties();
    });  
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPenalties();
  }
}
