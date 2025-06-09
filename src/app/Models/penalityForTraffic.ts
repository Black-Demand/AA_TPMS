export interface PenalityForTraffic {
  penalityId: number;

  violationDate?: Date;

  violationTime?: string;

  violationPlace?: string;

  dateAccused?: Date;

  ticketNo?: string;

  vehicleType?: string;

  plateRegion?: number;

  newPlateCode?: string;

  newPlateNo?: string;

  offenceId?: number;

  amount?: number;

  violationGrade?: number;

  paymentDate?: Date;

  actionTaken?: number;

  actionTakenBy?: string;

  mainGuid?: string;

  parentGuid?: string;

  isLightInjury?: boolean;

  isSevereInjury?: boolean;

  isPropertyDamage?: boolean;
}
