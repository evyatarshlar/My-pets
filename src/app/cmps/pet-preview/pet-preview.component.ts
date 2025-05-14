import { ChangeDetectionStrategy, Component, EventEmitter, Output, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pet } from '../../models/pet.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'pet-preview',
    templateUrl: './pet-preview.component.html',
    styleUrls: ['./pet-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, CommonModule]
})
export class PetPreviewComponent {
    pet = input.required<Pet>()
    remove = output<string>()
    // @Output() remove = new EventEmitter()

}
