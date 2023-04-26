import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isSelected',
  standalone: true,
})
export class IsSelectedPipe implements PipeTransform {
  transform(item: unknown, selectedData: unknown[], uniqueId: string): boolean {
    if (uniqueId) {
      return (
        selectedData.findIndex((x) => x[uniqueId] === item[uniqueId]) !== -1
      );
    }
    return selectedData.indexOf(item) !== -1;
  }
}
