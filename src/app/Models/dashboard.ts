namespace Dashboard {
  export interface RegionPenalityCountDTO {
    region: string;
    penaltyCount: number;
  }

  export interface RegionPenalityMoneySummaryDTO {
    region: string;
    totalPenaltyAmount: number;
  }

  export interface PenalitySexGradeSummaryDTO {
    violationGrade: string;
    maleCount: number;
    femaleCount: number;
    penaltyCount: number;
  }
}
export default Dashboard;