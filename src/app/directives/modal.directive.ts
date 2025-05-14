import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[modal]',
    standalone: true
})
export class ModalDirective {


    constructor(private el: ElementRef) { }

    @Output() clickOutside = new EventEmitter()

    ngOnInit() {
        setTimeout(() => {
            this.onClick = (ev: MouseEvent) => {
                const isClickedInside = this.el.nativeElement.contains(ev.target)
                if (!isClickedInside) this.clickOutside.emit()
            }
        }, 0);
    }

    @HostListener('document:click', ['$event'])
    onClick: (ev: MouseEvent) => void = () => { }

    @HostBinding('style')
    style = {
        position: 'fixed',
        inset: '0',
        width: '100%',
        height: '100%',
        top: '-10%',
        margin: 'auto',
        'box-shadow': '0 0 0 100vmax rgba(0, 0, 0, 0.5),-3px 1px 28px #00000043',
    }

}
