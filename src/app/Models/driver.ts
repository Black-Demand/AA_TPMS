export interface DriverDTO {
  firstNameAmh?: string | null;
  fatherNameAmh?: string | null;
  grandNameAmh?: string | null;

  firstName?: string | null;
  fatherName?: string | null;
  grandName?: string | null;

  nationality?: string | null;
  sex?: number | null;

  birthDate?: string | null; // Use string for DateTime, ISO format preferred
  tel1?: string | null;
  houseNo?: string | null;
  
  licenceRegion?: string | null;
  licenceArea?: string | null;
  licenceGrade?: string | null;
  licenceNo?: string | null;
  region?: string | null;
  zone?: string | null; // Uncomment if needed
  woreda?: string | null;
  kebele?: string | null;
  remark?: string | null;
  issuanceDate?: string | null;
  photo?: Uint8Array | null;


  // issuanceDate?: string | null; // Date string in ISO format
  // town?: string | null;
  // photo?: Uint8Array | null;   // Uncomment if you want to handle binary data
  //   firstNameSx?: string | null;
  //   fatherNameSx?: string | null;
  //   grandNameSx?: string | null;

  //   firstNameSort?: string | null;
  //   fatherNameSort?: string | null;
  //   grandNameSort?: string | null;

  //   licenseReturned?: boolean | null;

  //   eventDate?: string | null; // Date string in ISO format
  //   isTemp?: boolean | null;

  //   location?: number | null;
  //   userId?: string | null;
}
