import { Component, OnInit, effect } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: []
})
export class LoaderComponent implements OnInit {
    constructor(private loaderService: LoaderService) {
        effect(() => {
            // console.log('this.isLoading():', this.isLoading())
        })
    }

    isLoading = this.loaderService.isLoading
    ngOnInit(): void {

    }

}
