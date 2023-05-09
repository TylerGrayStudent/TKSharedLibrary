import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Branch } from '../../models/branch';

@Injectable({ providedIn: 'root' })
export class BranchService {
  allBranches$ = new BehaviorSubject<Branch[]>(Branches);
}
