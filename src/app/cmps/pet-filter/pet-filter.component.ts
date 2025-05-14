import { Component, ElementRef, OnInit, Signal, effect, inject, linkedSignal, resource, viewChild } from '@angular/core';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputColorDirective } from '../../directives/input-color.directive';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { FilterBy } from '../../models/pet.model';
import { StructuredClonePipe } from '../../pipes/sturctuerd-clone.pipe';

@Component({
    selector: 'pet-filter',
    templateUrl: './pet-filter.component.html',
    styleUrls: ['./pet-filter.component.scss'],
    imports: [FormsModule, StructuredClonePipe]
})
export class PetFilterComponent implements OnInit {


    x = effect(() => {
        // console.log('this.filterBy_():', this.filterBy_())
    })

    private petService = inject(PetService)
    filterBy_: Signal<FilterBy> = this.petService.filterBy_
    elInput_ = viewChild<ElementRef>('input')
    // filterByTerm_ = linkedSignal({
    //     source: this.petService.filterBy_,
    //     computation(source, previous) {
    //         console.log('source:', source)
    //         // return source().term
    //     },
    // })




    ngOnInit(): void {
        // this.a.set('')
        this.elInput_()?.nativeElement.focus()
    }


    onSetFilterBy() {
        this.petService.setFilterBy(this.filterBy_())
    }



}
