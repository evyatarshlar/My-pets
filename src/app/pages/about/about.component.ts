import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FetchDataPipe } from '../../pipes/fetch-data.pipe';
import { DateDescPipe } from '../../pipes/date-desc.pipe';
import { JsonPipe, SlicePipe, TitleCasePipe, CurrencyPipe, DatePipe } from '@angular/common';
import { EvStopDirective } from '../../directives/ev-stop.directive';
import { PetListComponent } from '../../cmps/pet-list/pet-list.component';
import { HighlightDirective } from '../../directives/highlight.directive';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { Pet } from '../../models/pet.model';
import { LoaderSvgComponent } from '../../cmps/loader-svg/loader-svg.component';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    imports: [
        HighlightDirective,
        PetListComponent,
        EvStopDirective,
        LoaderSvgComponent,
        SlicePipe,
        TitleCasePipe,
        CurrencyPipe,
        DatePipe,
        DateDescPipe,
    ]
})
export class AboutComponent {

 
    greet = 'Hello and welcome'
    birthDate = new Date(2000, 10, 1)
    currency = 1234
    date = Date.now() - 27 * 60 ** 2 * 1000
    url = 'https://jsonplaceholder.typicode.com/todos/1'


    lorem = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ipsum perspiciatis maxime possimus omnis quas,
    aliquam quos eaque quaerat culpa qui autem in natus vero provident tenetur neque voluptate libero!`

    pets = [
        { _id: 'p123', name: 'Penrose', age: 2, birthDate: new Date('2020-11-12').getTime() },
        { _id: 'p124', name: 'Bobo', age: 6, birthDate: new Date('2021-8-30').getTime() },
        { _id: 'p125', name: 'Gertrude', age: 1, birthDate: new Date('2021-11-1').getTime() },
    ];


    prm = new Promise(resolve => {
        setTimeout(() => {
            resolve('Resolved!')
        }, 1000);
    })

    obs$ = new Observable(subscriber => {
        let count = 0
        setInterval(() => {
            subscriber.next(count++)
        }, 1000)
    })

    // get randNum() {
    //     return Math.random()
    // }

    onChangePetName() {
        this.pets[0].name = 'Shakira'
    }

    onChangePetNameImmutable() {
        this.pets = [...this.pets]
        this.pets[0].name = 'Shakira'
    }

    onChangePetNameImmutableDeep() {
        this.pets = [...this.pets]
        this.pets[0] = { ...this.pets[0], name: 'Shakira' }
    }


    handleText(txt: string) {
        // console.log(txt)
    }

    onPrint() {
        console.log('HELOOO FROM PRINT')
    }
}
