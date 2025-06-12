export interface PenalityViewDTO {
  penalityId: number;
  ticketNo: string;
  violationDate: string; // or Date
  dateAccused: string; // or Date
  violationGrade: string;
  penalityPoints: number;
  totalAmount: number;
  amount: string;
  invoiceNo: string;
  fullName: string;
  licenceNo: string;
  suspened: string;
  payStatus: number;
}
