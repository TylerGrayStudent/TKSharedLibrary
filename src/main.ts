import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { TKSelectionListComponent } from './components/tk-selection-list/tk-selection-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchService } from './services/branch/branch.service';
import { BranchTreeSelectorComponent } from './components/branch-tree-selector/branch-tree-selector.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [
    CommonModule,
    TKSelectionListComponent,
    MatCardModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    BranchTreeSelectorComponent,
  ],
  templateUrl: './main.html',
})
export class App {
  branches$ = this.service.allBranches$;
  constructor(private service: BranchService) {}
  search = '';
  somethingChanged(event) {
    this.filter$.next(event);
  }
  log(event) {
    //console.log(event);
  }
  filter$ = new BehaviorSubject<string>('');

  data$ = new BehaviorSubject<any[]>([
    {
      name: 'Tyler',
      id: 1,
    },
    {
      name: 'Desi',
      id: 2,
    },
    {
      name: 'Evan',
      id: 3,
    },
    {
      name: 'Gary',
      id: 4,
    },
  ]);
  shownData$ = combineLatest([this.filter$, this.data$]).pipe(
    map(([filter, data]) => {
      console.log(filter);
      return data.filter((x) =>
        x.name.toLowerCase().includes(filter.toLowerCase())
      );
    })
  );
  name = 'Angular';

  fake() {
    const data = this.data$.value;
    if (data.find((x) => x.id === 1)) {
      this.data$.next([
        {
          name: 'Tyler2',
          id: 5,
        },
        {
          name: 'Desi2',
          id: 6,
        },
        {
          name: 'Evan2',
          id: 7,
        },
        {
          name: 'Gary2',
          id: 8,
        },
      ]);
    } else {
      this.data$.next([
        {
          name: 'Tyler',
          id: 1,
        },
        {
          name: 'Desi',
          id: 2,
        },
        {
          name: 'Evan',
          id: 3,
        },
        {
          name: 'Gary',
          id: 4,
        },
      ]);
    }
  }
}

bootstrapApplication(App);
