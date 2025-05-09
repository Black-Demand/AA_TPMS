export interface Penality {
  penalityId: number;
  ticketNo?: string | null;
  violationDate?: string | null;  
  dateAccused?: string | null;
  violationGrade?: string | null;
  offenceId?: number | null;
  plateRegion?: number | null;
  vehicleType?: string | null;

}