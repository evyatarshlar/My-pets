import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor() { }


    user = {
        _id: 'u101',
        name: 'Bobovich',
        username: 'Bobo',
        isAdmin: true
    }


    private _loggedInUser$ = new BehaviorSubject(this.user)
    // private _loggedInUser$ = new BehaviorSubject(null)
    public loggedInUser$ = this._loggedInUser$.asObservable()


    getLoggedInUser() {
        return this._loggedInUser$.value
    }
}
