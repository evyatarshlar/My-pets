import { Component, OnInit, inject } from '@angular/core';
import { PetService } from '../services/pet.service';
import { take } from 'rxjs';
import { LoaderComponent } from '../cmps/loader/loader.component';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../cmps/app-header/app-header.component';
import { LoaderService } from '../services/loader.service';
import { MsgComponent } from "../cmps/msg/msg.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [AppHeaderComponent, RouterOutlet, LoaderComponent, MsgComponent]
})

export class AppComponent {

    title = 'pets-inclass'
    router = inject(Router)
    loaderService = inject(LoaderService)
    ngOnInit() {
        this.router.events.subscribe(event => {
            // if ((event as any).route.path === 'pets') return
            if (event instanceof RouteConfigLoadStart) {
                this.loaderService.setIsLoading(true)
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loaderService.setIsLoading(false)
            }
        })
    }



}
