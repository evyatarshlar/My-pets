import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[clickOutside]',
    standalone: true
})
export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<void>()

    constructor(private el: ElementRef) { }
    isMounting = true
    ngOnInit() {
        setTimeout(() => this.isMounting = false)
    }

    @HostListener('document:click', ['$event'])
    onClick(ev: MouseEvent) {
        if (this.isMounting) return
        const isClickedInside = this.el.nativeElement.contains(ev.target)
        if (!isClickedInside) this.clickOutside.emit()
    }

    @HostBinding('class')
    className = 'click-outside'

}
