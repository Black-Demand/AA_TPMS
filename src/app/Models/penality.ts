export interface Penality {
  penalityId: number;
  ticketNo?: string | null;
  violationDate?: string | null;  
  dateAccused?: string | null;
  violationGrade?: string | null;
  offenceId?: number | null;
  plateRegion?: number | null;
  NewPlateCode?: string;
  NewPlateNo?: string;
  parentGuid?: string | null;


  // PenalityPoints?: number;
  // DelayPoints?: number;
  // Amount?: number;
  // DelayAmount?: number;
  // TotalAmount?: number;


  // InvoiceNo?: string;
  // PaymentDate?: string;
  // PaidAmount?: number;
  // PointPenaltyAmount?: number;
  // PayStatus?: boolean;
}