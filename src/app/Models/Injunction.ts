export interface InjunctionDTO {
    id: number;
  mainGuid: string; // Guid is usually a string in TypeScript
  parentGuid: string;

  injunctionType: string;
  injunctionBody?: string;

  injunctionDate: string; // Dates are represented as ISO strings
  injunctionRegisteredDate: string;
  injunctionEndDate?: string;

  injunctionLetterNo: string;

  injunctionLiftedDate?: string;
  injunctionRegisteredLiftedDate?: string;
  injunctionLiftedLetterNo?: string;

  injunctionStatus: number;

  reason?: string;
  injLifitingBody?: string;
  injunctionReason?: string;
  // actionTaken?: string;

  
}