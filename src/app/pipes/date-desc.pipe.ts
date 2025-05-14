import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateDesc',
    standalone: true
})
export class DateDescPipe implements PipeTransform {

    transform(value: Date | number | string): string {
        var past = new Date(value).getTime();
        var diff = Date.now() - past;
        if (diff < 1000 * 60 * 60) return 'Just now';
        if (diff < 1000 * 60 * 60 * 24 + 1000) return 'Today';
        if (diff < 1000 * 60 * 60 * 24 * 7) return 'This week';
        return 'At: ' + value;
    }

}
