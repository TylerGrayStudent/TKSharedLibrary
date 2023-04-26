import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'tk-selection-list',
  templateUrl: './tkselection-list.component.html',
  styleUrls: ['./tkselection-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatListModule, CommonModule],
})
export class TKSelectionListComponent {
  @Input() data: unknown[] = [];
  // Propety on objects passed in to be displayed
  @Input() displayProperty = '';
  // Unique property on the passed in data
  @Input() uniqueId = '';
  // Allow for multiple selections
  @Input() multiple = false;
  // Emits currently selected values
  @Output() dataSelectionChanged = new EventEmitter<unknown[]>();
  // Emites the last clicked on value and if it was selected or unselected
  @Output() dataSelectedChangedEvent =
    new EventEmitter<DataSelectedChangedEvent>();
  _selectedData: unknown[] = [];
  // TrackByFn
  identify(_: number, item: unknown) {
    if (this.displayProperty) {
      return item[this.displayProperty];
    }
    return item;
  }
  onSelectionChange(event: MatSelectionListChange) {
    this._selectedData = [
      ...this._selectedData,
      ...event.options.filter((x) => x.selected).map((x) => x.value),
    ];

    this.dataSelectionChanged.emit(this._selectedData);
    const selectedItems = event.options.filter((option) => option.selected);
    const deselectedItems = event.options.filter((option) => !option.selected);

    selectedItems.forEach((selected) => {
      this.dataSelectedChangedEvent.emit({
        data: selected.value,
        selected: true,
      });
    });

    deselectedItems.forEach((deselected) => {
      this.dataSelectedChangedEvent.emit({
        data: deselected.value,
        selected: false,
      });
    });
  }
  // TODO: Remove this and use pipe in real project
  isSelected(item: unknown): boolean {
    if (this.uniqueId)
      return (
        this._selectedData.findIndex(
          (x) => x[this.uniqueId] === item[this.uniqueId]
        ) !== -1
      );
    return this._selectedData.indexOf(item) !== -1;
  }
}

export interface DataSelectedChangedEvent {
  data: unknown;
  selected: boolean;
}
