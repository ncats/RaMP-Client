import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceToNewline'
})
export class SpaceToNewlinePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/ /g, '<br>');
  }

}
