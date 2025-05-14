import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { Pet } from '../../models/pet.model';
import { nameTaken, startWithNumber } from '../../custom-validators/pet-validators';
import { CommonModule } from '@angular/common';
import { LoaderSvgComponent } from '../../cmps/loader-svg/loader-svg.component';

@Component({
    selector: 'app-pet-edit-reactive-form',
    imports: [ReactiveFormsModule, CommonModule, LoaderSvgComponent],
    templateUrl: './pet-edit-reactive-form.component.html',
    styleUrl: './pet-edit-reactive-form.component.scss'
})
export class PetEditReactiveFormComponent {

    private petService = inject(PetService)
    private router = inject(Router)
    private route = inject(ActivatedRoute)
    private fb = inject(FormBuilder)

    destroySubject$ = new Subject<void>()
    form!: FormGroup
    pet!: Pet
    @ViewChild('elNameInput') elNameInput!: ElementRef<HTMLInputElement>

    constructor() {
        this.form = this.fb.group({
            name: ['', [Validators.required, startWithNumber], [nameTaken]],
            age: ['', [Validators.required, Validators.max(120)]],
            birthDate: [this.formatTime(Date.now())],
        })
    }


    ngOnInit(): void {

        this.route.data
            .pipe(
                map(data => data['pet']),
                filter(pet => !!pet)
            )
            .subscribe(pet => {
                pet.birthDate = this.formatTime(pet.birthDate)
                this.pet = pet
                this.form.patchValue(pet)
            })
    }

    ngAfterViewInit(): void {
        this.elNameInput.nativeElement.focus()
    }

    onHandleDate(dateStr: string) {
        this.pet.birthDate = new Date(dateStr).getTime()
    }

    onSavePet() {
        const petToSave = { ...this.pet, ...this.form.value } as Pet
        petToSave.birthDate = new Date(petToSave.birthDate).getTime()
        this.petService.save(petToSave)
            .pipe(takeUntil(this.destroySubject$),)
            .subscribe({
                next: this.onBack,
                error: err => console.log('err:', err)
            })
    }


    formatTime(date: Date | number | string) {
        return new Date(date).toISOString().slice(0, 10)
    }

    onBack = () => {
        this.router.navigateByUrl('/')
    }

    ngOnDestroy(): void {
        this.destroySubject$.next()
    }
}
