import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[evStop]',
    standalone: true
})
export class EvStopDirective {

    constructor() { }

    @HostListener('click', ['$event'])
    onClick(ev: MouseEvent) {
        ev.stopPropagation()
    }

}
