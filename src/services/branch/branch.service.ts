import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Branches } from 'src/data/Branches';
import { Branch } from 'src/models/Branch';

@Injectable({ providedIn: 'root' })
export class BranchService {
  allBranches$ = new BehaviorSubject<Branch[]>(Branches);
}
