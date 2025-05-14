import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fetchData',
    pure: false,
    standalone: true
})
export class FetchDataPipe implements PipeTransform {

    constructor(private http: HttpClient) { }

    fetchedData: any = null
    fetchUrl = ''

    transform(url: string): any {

        if (url !== this.fetchUrl) {
            this.fetchedData = null
            this.fetchUrl = url
            this.http.get(url).subscribe(data => {
                this.fetchedData = data
            })
        }

        return this.fetchedData
    }

}
