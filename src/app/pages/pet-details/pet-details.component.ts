import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, effect, inject, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, delay, lastValueFrom, map, throwError } from 'rxjs';
import { PetService } from '../../services/pet.service';
import { LoaderService } from '../../services/loader.service';
import { Pet } from '../../models/pet.model';
import { GreetComponent } from '../../cmps/greet/greet.component';


@Component({
    selector: 'pet-details',
    templateUrl: './pet-details.component.html',
    styleUrls: ['./pet-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, GreetComponent]
})
export class PetDetailsComponent implements OnInit, OnDestroy {

    constructor(
        // DI
        private petService: PetService,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef
    ) { }

    x = effect(() => {
        console.log('this.ans:', this.ans_)
    })

    // DI
    private router = inject(Router)
    subscription!: Subscription
    isShowImg = false
    // ans_ = signal('')
    ans_ = resource({
        loader: () => this.getAnswer(),
    });


    msg_ = signal('')
    pet_ = toSignal<Pet>(this.route.data.pipe(map(data => data['pet'])), { requireSync: true })


    ngOnInit() {
        setTimeout(() => {
            this.msg_.set('HELLOOOOOOOO')
        }, 1500);
    }

    doThing() {
        this.isShowImg = !this.isShowImg
        console.log('this.isShowImg:', this.isShowImg)
    }

    // onShouldAdoptPet() {
    //     this.petService.shouldAdoptPet().subscribe(ans => {
    //         this.ans_.set(ans)
    //         setTimeout(() => {
    //             this.ans_.set('')
    //         }, 1500);
    //     })

    // }

    onShouldAdoptPet() {
        this.ans_.set('')
        this.ans_.reload()
    }

    onBack() {
        this.router.navigateByUrl('/pets')
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe()
    }

    getAnswer() {
        return lastValueFrom(this.petService.shouldAdoptPet().pipe(delay(1500)))
    }



}
