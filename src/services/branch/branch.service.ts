import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BranchService {
  allBranches$ = new BehaviorSubject<Branch[]>(Branches);
}
