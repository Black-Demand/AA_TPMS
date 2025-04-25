
export interface TemporaryDriverRegistration {
    // Issuer Information
    issuerRegion: string;
    issuerStation: string;
    licenseLevel: string;
    
    // License Information
    licenseNumber: string;
    issueDate: Date;
    
    // Personal Information (Amharic)
    nameAmharic: string;
    fatherNameAmharic: string;
    grandfatherNameAmharic: string;
    
    // Personal Information (English)
    firstName: string;
    fatherName: string;
    grandfatherName: string;
    
    // Personal Details
    nationality: string;
    gender: string;
    dateOfBirth: Date;
    
    // Address Information
    region: string;
    zone: string;
    district: string;
    kebele: string;
    houseNumber?: string;  // Optional
    remark?: string;       // Optional
    
    // Photo
    photo?: File | string; // Can be either File for upload or string (URL/path) after upload
  }