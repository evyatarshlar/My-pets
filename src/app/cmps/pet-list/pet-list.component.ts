import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal, input, output } from '@angular/core';
import { PetPreviewComponent } from '../pet-preview/pet-preview.component';

import { Pet } from '../../models/pet.model';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'pet-list',
    templateUrl: './pet-list.component.html',
    styleUrls: ['./pet-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PetPreviewComponent]
})
export class PetListComponent {

    pets = input<Pet[] | null>()
    remove = output<string>()


    doNothing() {
    }

}
