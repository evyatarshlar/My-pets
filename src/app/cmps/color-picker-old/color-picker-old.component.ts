import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';

@Component({
    selector: 'color-picker-old',
    imports: [CommonModule],
    templateUrl: './color-picker-old.component.html',
    styleUrl: './color-picker-old.component.scss'
})
export class ColorPickerOldComponent {
    readonly color = input.required<string>();
    @Output() colorChange = new EventEmitter()

    colors = [
        '#F44236',
        '#E91D63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#009688',
        '#4caf50',
        '#8BC34A',
        '#FDEB3B',
        '#FF9800',
        '#FF5722',
        '#795547',
        '#9E9E9E',
        '#607D8B'
    ]
}
