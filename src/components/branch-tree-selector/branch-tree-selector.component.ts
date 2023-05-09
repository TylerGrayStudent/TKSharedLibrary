import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject } from 'rxjs';
import { Branch } from '../../models/Branch';

export interface BranchSelectionChangeEvent {
  selectedBranches: Branch[];
  unselectedBranches: Branch[];
}

@Component({
  selector: 'hq-branch-tree-selector',
  templateUrl: './branch-tree-selector.component.html',
  styleUrls: ['./branch-tree-selector.component.scss'],
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatCheckboxModule,
  ],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BranchTreeSelectorComponent),
      multi: true,
    },
  ],
})
export class BranchTreeSelectorComponent implements ControlValueAccessor {
  @ViewChild('branchSelector', { static: true }) branchSelector: MatSelect;
  @Input() set branches(branches: Branch[]) {
    if (!branches) return;
    const franchiseIds = [...new Set(branches.map((x) => x.franchiseId))];
    this.branchGroupings = franchiseIds.map((franchiseId) => {
      const franchise = branches.find(
        (x) => x.franchiseId === franchiseId
      ).franchise;
      franchise.branches = branches.filter(
        (x) => x.franchiseId === franchise.uniqueId
      );
      return franchise;
    });
    this.branchGroupings = this.branchGroupings.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });
    this.justBranches = branches;
    this.justBranches.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });
  }
  @Output() selectedBranchChange =
    new EventEmitter<BranchSelectionChangeEvent>();
  @Input() multiple = true;
  private ignoreThese = [];
  private _currSelectedItems = [];
  public currSelectedBranches = [];
  public currSelectedBranchNames = [];
  public branchGroupings = [];
  public tooltip = 'Select branches';
  public groupByFranchise$ = new BehaviorSubject<boolean>(true);
  public justBranches: Branch[] = [];
  // Used to prevent the onSelectionChange to do anything when the group by is toggling
  private _lock = false;

  constructor(private cd: ChangeDetectorRef) {}

  onGroupByFranchiseChange(): void {
    this.groupByFranchise$.next(!this.groupByFranchise$.value);
    this._lock = true;
    this.branchSelector.options.forEach((x) => x.deselect());
    this._lock = false;
    this.writeValue([]);
    this.onChange([]);
    this.onTouched();
    this.cd.detectChanges();
  }

  onSelectionChange(change: MatSelectChange): void {
    if (this._lock) return;
    if (!this.multiple) {
      console.log(change);
      this._currSelectedItems = [change.value];
      this._emitChanges();
      return;
    }
    // check if its a selection or deselection
    const selectedItem = change.value.filter(
      (b) => !this._currSelectedItems.includes(b)
    )[0];
    if (selectedItem) {
      this._currSelectedItems.push(selectedItem);
      // If its a franchise then add all its branches to the list
      if (selectedItem?.branches) {
        const branches = selectedItem.branches;
        change.source.options
          .filter((x) => branches.includes(x.value))
          .forEach((x) => {
            if (!x.selected && !x.disabled) x.select();
          });
      } else if (this.groupByFranchise$.value) {
        // if if its a branch then, ensure if all branches are selected, then ensure the franchise is selected
        const franchise = this.branchGroupings.find(
          (x) => x.uniqueId === selectedItem.franchiseId
        );
        const allBranchesSelected = franchise.branches.every((x) =>
          this._currSelectedItems.includes(x)
        );
        if (allBranchesSelected) {
          const franchiseOption = change.source.options.find(
            (x) => x.value.uniqueId === selectedItem.franchiseId
          );
          if (!franchiseOption.selected) franchiseOption.select();
        }
      }
      this._emitChanges();
      return;
    }

    const unselectedItem = this._currSelectedItems.filter(
      (b) => !change.value.includes(b)
    )[0];
    if (unselectedItem) {
      this._currSelectedItems.splice(
        this._currSelectedItems.indexOf(unselectedItem),
        1
      );

      // If its a franchise then remove all its branches from the list
      if (unselectedItem?.branches) {
        // dont remove all branches if the franchise was de selected programmatically (from our code, and not a user click)
        if (this.ignoreThese.includes(unselectedItem.uniqueId)) {
          this.ignoreThese = this.ignoreThese.filter(
            (x) => x !== unselectedItem.uniqueId
          );
          return;
        }
        const branches = unselectedItem.branches;
        change.source.options
          .filter((x) => branches.includes(x.value))
          .forEach((x) => {
            x.deselect();
          });
      } else {
        // if its a branch, lets make sure its franchise isnt selected
        const franchiseOption = change.source.options.find(
          (x) => x.value.uniqueId === unselectedItem.franchiseId
        );
        if (franchiseOption.selected) {
          this.ignoreThese.push(unselectedItem.franchiseId);
          franchiseOption.deselect();
        }
      }
      this._emitChanges();
      return;
    }
  }

  _emitChanges(): void {
    this.currSelectedBranches = this._currSelectedItems.filter(
      (x) => !!x.franchiseId
    );
    this.currSelectedBranchNames = this.currSelectedBranches.map((x) => x.name);
    if (this.currSelectedBranchNames.length) {
      this.tooltip = this.currSelectedBranchNames.join(', ');
    } else {
      this.tooltip = 'Select branches';
    }
    this.onChange(this.currSelectedBranches);
    this.selectedBranchChange.emit({
      selectedBranches: this.currSelectedBranches,
      unselectedBranches: [],
    });
  }

  writeValue(branches: Branch[] | Branch): void {
    setTimeout(() => {
      if (Array.isArray(branches)) {
        console.log('is array');
        this._currSelectedItems = branches;
        this.branchSelector.options.forEach((x) => {
          if (branches.map((x) => x.uniqueId).includes(x.value.uniqueId))
            x.select();
        });
      } else {
        console.log('notarray');
        this._currSelectedItems = [branches];
        if (!branches) return;
        this.branchSelector.options.forEach((x) => {
          if (x.value.uniqueId === branches.uniqueId) {
            x.select();
          }
        });
      }
    }, 0);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Form Control Methods
  onChange: any = () => {
    //
  };
  onTouched: any = () => {
    //
  };
  disabled = false;
}
