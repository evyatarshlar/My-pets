import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
    const user = inject(UserService).getLoggedInUser()
    if (user) return true
    else {
        // inject(Router).navigateByUrl('/')
        return inject(Router).createUrlTree(['/'])
    }
};
