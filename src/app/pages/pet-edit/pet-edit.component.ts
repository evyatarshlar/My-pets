import { Component, DestroyRef, OnInit, effect, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, take, tap } from 'rxjs';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'pet-edit',
    templateUrl: './pet-edit.component.html',
    imports: [FormsModule, RouterLink, DatePipe, ClickOutsideDirective],
    styleUrls: ['./pet-edit.component.scss']
})
export class PetEditComponent implements OnInit {

    private petService = inject(PetService)
    private route = inject(ActivatedRoute)
    private router = inject(Router)
    x = effect(()=>{
        console.log('this.pet():', this.pet())
    })

    pet = signal(this.petService.getEmptyPet())
    petAge = linkedSignal(() => {
        return new Date().getFullYear() - new Date(this.pet().birthDate).getFullYear()
    })

    ngOnInit(): void {

        this.route.data
            .pipe(
                map(data => data['pet']),
                filter(pet => !!pet),
            )
            .subscribe(this.pet.set)
    }

    onSavePet() {
        this.pet.update(pet => ({ ...pet, age: this.petAge() }))
        this.petService.save(this.pet() as Pet)
            .subscribe(this.onBack)
    }

    onHandleBirthDate(date: string) {
        this.pet.update(pet => ({ ...pet, birthDate: new Date(date).getTime() }))
    }

    onBack = () => {
        this.router.navigateByUrl('/pets')
    }
}
