namespace Lookup {
  export interface RegionDTO {
    code: string;
    amDescription: string;
    Parent: number;
    Description: string;
  }

  export interface ZoneDTO {
    code: string;
    amDescription: string;
    parent: string;
  }

  export interface WoredaDTO {
    code: string;
    amDescription: string;
    parent: string;
  }

  export interface KebeleDTO {
    code: string;
    amDescription: string;
    parent: string;
  }
  export interface LicenceCategoryDTO{
    Id: number;
    code: string;
    displayName: string;
    Description: string;
  }

  export interface LicenceRegionDTO{
    Id: number;
    code: string;
    Description: string;
    amDescription: string;

  }

  export interface LicenceAreaDTO {
    Id: number;
    code: string;
    amDescription: string;
  }

  export interface LookupDTO {
    code: string;
    Parent: string;
    Description: string;
    amdescription: string;
  }

  export interface OffenceGradeDTO {
    id: number;
    code: string;
    amDescription: string;
    Description: string;
    FineAmount: number;
    OffenceGrade: string;
    OffencePoint: number;
  }

  export interface SiteDTO {
    Id: number;
    Code: string;
    SiteNameAmh: string;
    Description: string;
    ParentCode: number;
    SiteName: string;
  }

  export interface VehicleBodyTypeDTO{
    Code: string;
    VehicleTypeCode: string;
    DescriptionAmh: string;
  }

  export interface InjunctionTypeDTO {
    id: number;
    Description: string;
    descriptionAmh: string;
  }

  export interface KifleketemaDTO {
    Id: number;
    Description: string;
    AmDescription: string;
    Kebeles : number;
  }

  export interface OffenceNewDTO {
    OffenceId: number;
    code: string;
    Description: string;
    amDescription: string;
    Parent: number;
    FineAmount: number;
  }

  export interface Majors {
    codeId: string;
    majorCode: string;
    ServiceType: string;
    AmServiceType: string;
  }

  

}
export default Lookup;

