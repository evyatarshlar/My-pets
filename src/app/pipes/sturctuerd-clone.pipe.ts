import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'structuredClone'
})
export class StructuredClonePipe implements PipeTransform {

    transform<T>(value: T): T {
        return structuredClone(value);
    }

}
