export enum Gender {
  Male = 0,
  Female = 1,
}

export const GenderDescriptions: Record<Gender, string> = {
  [Gender.Male]: 'ወንድ',
  [Gender.Female]: 'ሴት',
};
