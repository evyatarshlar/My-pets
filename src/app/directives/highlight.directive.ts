import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[highlight]',
    standalone: true
})
export class HighlightDirective {

    constructor(private el: ElementRef) { }
    @Output() onContentChange = new EventEmitter()

    @HostListener('mouseover')
    onMouseOver() {
        this.bgColor = 'lightyellow'
        this.isEditing = true
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.bgColor = ''
    }

    @HostListener('focus')
    onFocus() {
        this.cursor = ''
    }

    @HostListener('blur')
    onBlur() {
        this.cursor = 'pointer'
        this.isEditing = false
        const text = this.el.nativeElement.innerText
        this.onContentChange.emit(text)
    }

    @HostBinding('contentEditable')
    isEditing = false

    @HostBinding('style.backgroundColor')
    bgColor = ''

    @HostBinding('style.cursor')
    cursor = 'pointer'

}
