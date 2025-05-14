import { Directive, ElementRef, HostBinding, HostListener, OnInit, input } from '@angular/core';

@Directive({
    selector: '[inputColor]',
    standalone: true
})
export class InputColorDirective implements OnInit {

    constructor(private el: ElementRef) { }

    readonly defaultColor = input('', { alias: "inputColor" });

    ngOnInit(): void {
        const el = this.el.nativeElement
    }

    @HostListener('keydown')
    onKeyDown() {
        // this.el.nativeElement.style.backgroundColor = this._getRandomColor()
        this.bgColor = this.defaultColor() || this._getRandomColor()
    }

    @HostBinding('style.backgroundColor')
    bgColor = ''



    private _getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

}
