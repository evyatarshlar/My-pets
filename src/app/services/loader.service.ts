import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, finalize, pipe, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {

    constructor() { }
    public isLoading = signal(false)
    setIsLoading(isLoading: boolean) {
        this.isLoading.set(isLoading)
    }
}



export function setLoader<T>() {
    const loaderService = inject(LoaderService)
    loaderService.setIsLoading(true)
    return (source: Observable<T>) => source.pipe(
        finalize(() => loaderService.setIsLoading(false))
    )
}