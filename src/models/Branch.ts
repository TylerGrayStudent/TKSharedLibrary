import { Address } from './Address';
import { Franchise } from './Franchise';
import { HQBase } from './HQBase';

export interface Branch extends HQBase {
  name: string;
  classCode?: string;
  address?: Address;
  openDate?: Date;
  closeDate?: Date;
  legacyBranchId?: number;
  timeSystemEnabled?: boolean;
  franchise?: Franchise;
  contacts?: unknown[];
  franchiseId?: string;
}
