import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minAgeValidator(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const dob = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    const isBirthdayPassed = (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0));
    const actualAge = isBirthdayPassed ? age : age - 1;

    return actualAge >= minAge ? null : { minAge: true };
  };
}

export function dateCannotBeTheFuture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => { 
      const selectedDate = new Date(control.value);
      const today = new Date();
  
      if (selectedDate > today) {
        return {
          dateCannotBeTheFuture: {
            message: 'The date cannot be in the future'
          }
        };
      }
  
      return null;
    };
  }
