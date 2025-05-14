import { Injectable, inject } from '@angular/core';
import { storageService } from './async-storage.service';
import { FilterBy, Pet } from '../models/pet.model';
import { catchError, from, map, retry, share, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const PETS = 'pets'


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    http = inject(HttpClient)
    constructor() { }

    getPets(filterBy: FilterBy) {
        // console.log('api getPets filterBy:', filterBy)
        return from(storageService.query<Pet>(PETS)).pipe(
            map(pets => this._filterPets(pets, filterBy)),
            retry(1)
        )
    }

    removePet(petId: string) {
        // const isError = Math.random() > 0.7
        // if (isError) return throwError(() => new Error('Oh no... cant remove'))

        // return throwError(() => new Error('Oh no... cant remove'))
        return from(storageService.remove<Pet>(PETS, petId)).pipe(retry(1))
    }

    addPet(pet: Pet) {
        return from(storageService.post<Pet>(PETS, pet)).pipe(retry(1))
    }

    updatePet(pet: Pet) {
        return from(storageService.put<Pet>(PETS, pet)).pipe(retry(1))
    }

    savePet(pet: Pet) {
        return (pet._id ? this.updatePet(pet) : this.addPet(pet))
            .pipe(map(savedPet => ({ pet: savedPet, isAdded: !pet._id })), retry(1))
    }

    private _filterPets(pets: Pet[], filterBy: FilterBy): Pet[] {
        return pets.filter(pet => pet.name.toLowerCase().includes(filterBy.term.toLowerCase()));
    }
}
