import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Branch } from '../../models/Branch';
import { Branches } from '../../data/Branches';

@Injectable({ providedIn: 'root' })
export class BranchService {
  allBranches$ = new BehaviorSubject<Branch[]>(Branches);
}
