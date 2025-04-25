import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function dateNotTheFuture(): ValidatorFn {
    return (control:AbstractControl): ValidationErrors | null =>{
        const date = new Date(control.value);
        const today = new Date();

        if(date > today){
            return {
                dateNotTheFuture:{
                    message: 'The date cannot be in the future'
                }
            };
        }
        return null;
    }
}

export function dateNotTheFutures(): ValidatorFn {
    return (control:AbstractControl): ValidationErrors | null =>{
        const date = new Date(control.value);
        const today = new Date();

        if(date > today){
            return {
                dateNotTheFuture:{
                    message: 'The date cannot be in the future'
                }
            };
        }
        return null;
    }
}
