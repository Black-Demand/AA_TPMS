export interface Penality {
  penalityId: number;
  ticketNo?: string | null;
  violationDate?: string | null;  // ISO format (e.g., 2025-05-08T14:30:00Z)
  dateAccused?: string | null;
  violationGrade?: string | null;
  offenceId?: number | null;
  plateRegion?: number | null;
  vehicleType?: string | null;

}