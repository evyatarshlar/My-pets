import { AbstractControl } from "@angular/forms"
import { map, timer } from "rxjs"

export function startWithNumber(control: AbstractControl) {
    const firstChar = control.value.charAt(0)
    if (firstChar !== '' && !isNaN(firstChar)) {
        return { startWithNumber: true }
    }
    return null
}

export function nameTaken(control: AbstractControl) {
    return timer(1000).pipe(
        map(() => {
            if (control.value === 'bobo') return { nameTaken: true }
            return null
        })
    )
}

export function _nameTaken(control: AbstractControl) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (control.value === 'bobo') {
                resolve({ nameTaken: true })
            } else {
                resolve(null)
            }
        }, 1000)
    })
}