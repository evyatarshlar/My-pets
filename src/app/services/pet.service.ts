import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, from, Observable, of, pipe, Subject, throwError, timer } from 'rxjs';
import { catchError, retry, map, take, switchMap, debounceTime, distinctUntilChanged, share, concatMap, filter, delay, startWith, skip, tap, debounce, pairwise, distinctUntilKeyChanged } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { storageService } from './async-storage.service';
import { FilterBy, Pet } from '../models/pet.model';
import { ApiService } from './api.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Errors } from '../models/errors';
import { Router } from '@angular/router';
const ENTITY = 'pets'

@Injectable({
    providedIn: 'root'
})
export class PetService {

    apiService = inject(ApiService)
    router = inject(Router)

    // sources
    private _filterBy$ = new BehaviorSubject<FilterBy>({ term: '' })
    private _removePet$ = new Subject<string>()
    private _savePet$ = new Subject<Pet>()


    // signals
    filterBy_ = toSignal(this._filterBy$, { requireSync: true })
    pets_ = signal<Pet[] | null>(null)

    private errors_ = signal<Errors>({
        fetch: null,
        save: null,
        remove: null,
    })

    fetchError_ = computed(() => this.errors_().fetch)
    saveError_ = computed(() => this.errors_().save)
    removeError_ = computed(() => this.errors_().remove)


    //* actions
    filteredPets$ = this._filterBy$.pipe(
        // delay(1500), // ! for testing
        debounceTime(500),
        distinctUntilChanged((prev, curr) => prev === curr, filterBy => filterBy.term),
        // tap(() => console.log('fetching pets...')),
        switchMap(filterBy => this.apiService.getPets(filterBy)),
        catchError(err => this._handleError(err, 'fetch')),
        share()
    )


    removedPetId$ = this._removePet$.pipe(
        concatMap(petId => this.apiService.removePet(petId).pipe(map(() => petId))),
        catchError(err => this._handleError(err, 'remove')),
        share()
    )

    savedPet$ = this._savePet$.pipe(
        concatMap(pet => this.apiService.savePet(pet)),
        catchError(err => this._handleError(err, 'save')),
        share()
    )

    constructor(private http: HttpClient) {
        const pets = JSON.parse(localStorage.getItem(ENTITY) || 'null');
        if (!pets || pets.length === 0) {
            localStorage.setItem(ENTITY, JSON.stringify(this._createPets()))
        }

        //* reducers
        this.filteredPets$.pipe(takeUntilDestroyed())
            .subscribe({
                next: (pets) => {
                    this.pets_.set(pets)
                },
                error: (err) => {
                    console.log({ err })
                }
            })

        this.removedPetId$.pipe(takeUntilDestroyed())
            .subscribe({
                next: (petId) => {
                    this.pets_.update(pets => pets!.filter(pet => pet._id !== petId))
                },
                error: (err) => {
                    console.log({ err })
                    return throwError(() => err)
                }
            })

        this.savedPet$.pipe(takeUntilDestroyed())
            .subscribe({
                next: ({ pet, isAdded }) => {
                    this.pets_.update(pets => {
                        return isAdded
                            ? [...pets!, pet]
                            : pets!.map(p => p._id === pet._id ? pet : p);
                    })
                },
                error: (err) => {
                    console.log({ err })
                }
            })

    }

    public shouldAdoptPet(): Observable<string> {
        return this.http.get<{ answer: string }>('https://yesno.wtf/api')
            .pipe(
                map(res => res.answer),
                retry(1),
                catchError((err: HttpErrorResponse) => {
                    return throwError(() => err)
                })
            )
    }

    public getEmptyPet(): Omit<Pet, '_id'> {
        return { name: '', age: 0, birthDate: Date.now() }
    }


    public remove(petId: string) {
        this._removePet$.next(petId)
        return this.removedPetId$.pipe(take(1))
    }

    public save(pet: Pet) {
        this._savePet$.next(pet)
        return this.savedPet$.pipe(take(1))
    }



    public setFilterBy(filterBy: FilterBy) {
        this._filterBy$.next({ ...filterBy })
    }

    public getById(petId: string): Observable<Pet> {
        return from(storageService.get<Pet>(ENTITY, petId))
            .pipe(
                retry(1),
                catchError((err) => this._handleError(err)),
            )
    }


    public cleanErrors(errorType?: keyof Errors) {
        this.errors_.update(errors => {
            if (errorType) return ({ ...errors, [errorType]: null })
            for (const key in errors) {
                errors[key] = null
            }
            return errors
        })
    }

    private _createPets() {
        const pets: Pet[] = [
            { _id: 'p123', name: 'Penrose', age: 2, birthDate: new Date('2020-11-12').getTime() },
            { _id: 'p124', name: 'Bobo', age: 6, birthDate: new Date('2021-8-30').getTime() },
            { _id: 'p125', name: 'Gertrude', age: 1, birthDate: new Date('2021-11-1').getTime() },
            { _id: 'p126', name: 'Popovich', age: 62, birthDate: new Date('1950-3-30').getTime() },
        ];
        return pets
    }

    private _handleError(err: HttpErrorResponse | string, type?: keyof Errors) {
        console.log({ err, type })
        if (type) this.errors_.update(errors => {
            return ({ ...errors, [type]: this._isString(err) ? err : err.message });
        })
        return throwError(() => err)
    }


    private _isString(val: any): val is string {
        return typeof val === 'string' || val instanceof String;
    }


}



function distinctByKeys<T, K extends keyof T>(keys: K[]) {
    return pipe(
        startWith<T | null>(null),
        pairwise<T | null>(),
        filter(([prev, curr]) => {
            if (prev === null) return true
            console.log(prev, curr);

            return keys.some(key => prev?.[key] !== curr?.[key]);
        }),
        map(([, curr]) => curr!)
    )
}


function objectDistinctUntilChanged<T extends {}>() {
    return (source$: Observable<T>): Observable<T> => {
        return new Observable<T>(subscriber => {
            let prevValue: T = {} as T
            return source$
                .pipe(
                    tap((value) => {
                        const props = Object.keys(value) as (keyof T)[]
                        const isAllDistinct = Array.isArray(props)
                            ? props.every(prop => value[prop] !== prevValue[prop])
                            : value[props] !== prevValue[props]
                        if (isAllDistinct) {
                            subscriber.next(value);
                            prevValue = structuredClone(value)
                        }
                    }),
                )
                .subscribe();
        });
    };
}
