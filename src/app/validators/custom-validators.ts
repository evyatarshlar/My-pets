import { AbstractControl } from "@angular/forms";

export class CustomValidators {

    static startWithNumber(control: AbstractControl) {
        if (control.value.charAt(0) !== '' && !isNaN(control.value.charAt(0))) {
            return { startWithNumber: true }
        }
        return null
    }

    static nameTaken(control: AbstractControl) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (control.value === 'bobby') {
                    resolve({ nameTaken: true })
                } else {
                    resolve(null)
                }
            }, 1000);
        })
    }

}


