import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RelativeTimePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchpost'
})
export class SearchPostPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
searchText = searchText.toLowerCase();
return items.filter( it => {
      return it.toLowerCase().includes(searchText);
        });
    }
}
