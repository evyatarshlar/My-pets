import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LoaderService } from '../services/loader.service';

export const loaderResolver: ResolveFn<boolean> = (route, state) => {
    inject(LoaderService).setIsLoading(true)
    return true;
};
