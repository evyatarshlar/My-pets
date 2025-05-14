import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PetService } from '../services/pet.service';
import { Pet } from '../models/pet.model';
import { delay, finalize, noop, tap } from 'rxjs';
import { LoaderService, setLoader } from '../services/loader.service';

export const petResolver: ResolveFn<Pet> = (route, state) => {
    const loaderService = inject(LoaderService)

    const id = route.params['id']
    return inject(PetService).getById(id).pipe(
        setLoader(),
    )
};
