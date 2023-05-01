import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Branch } from 'src/models/Branch';
import { Branches } from 'src/data/Branches';
@Injectable({ providedIn: 'root' })
export class BranchService {
  allBranches$ = new BehaviorSubject<Branch[]>(Branches);
}
