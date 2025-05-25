import { Component, effect, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { TextColorPipe } from '../../pipes/text-color.pipe';
import { ColorPickerOldComponent } from '../color-picker-old/color-picker-old.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss'],
    imports: [
        RouterLink,
        RouterLinkActive,
        CommonModule,
        ColorPickerComponent,
        ClickOutsideDirective,
        TextColorPipe
    ]
})
export class AppHeaderComponent {


    isShowColorPicker = false
    headerColor = '#ffb74d' //* for old demo
    
    headerColorSignal = signal('#ffb74d')
}
