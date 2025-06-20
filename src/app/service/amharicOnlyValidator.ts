import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function amharicOnlyValidator(): ValidatorFn {
  const regex = /^[\u1200-\u137F\s]*$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && !regex.test(value)) {
      return { amharicOnly: true };
    }
    return null;
  };
}


export function englishOnlyValidator(): ValidatorFn {
const regex = /^[A-Za-z\s]*$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && !regex.test(value)) {
      return { englishonly: true };
    }
    return null;
  };
}