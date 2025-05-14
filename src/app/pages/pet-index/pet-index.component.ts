import { DatePipe, AsyncPipe } from '@angular/common';
import { Component, Injector, inject } from '@angular/core';
import { PetListComponent } from '../../cmps/pet-list/pet-list.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EvStopDirective } from '../../directives/ev-stop.directive';
import { PetFilterComponent } from '../../cmps/pet-filter/pet-filter.component';
import { PetService } from '../../services/pet.service';
import { MsgService } from '../../services/msg.service';

@Component({
    selector: 'pet-index',
    templateUrl: './pet-index.component.html',
    styleUrls: ['./pet-index.component.scss'],
    imports: [PetFilterComponent, EvStopDirective, RouterLink, PetListComponent, RouterOutlet],
    providers: [DatePipe]
})
export class PetIndexComponent {

    injector = inject(Injector)
    msgService = inject(MsgService)
    petService = inject(PetService)
    pets_ = this.petService.pets_
    removeError_ = this.petService.removeError_
    datePipe = inject(DatePipe)

    onRemovePet(petId: string) {
        // const x = this.datePipe.transform(new Date(),'yyyy///MM///dd')
        this.petService.remove(petId).subscribe({
            next: petId => {
                this.msgService.setSuccessMsg('Pet removed successfully ' + this.datePipe.transform(Date.now(), 'shortTime'))
            },
            error: err => {
                console.log('error while removing pet:', err)
                this.msgService.setErrorMsg('Failed to remove pet')
            },
        })
    }


}
