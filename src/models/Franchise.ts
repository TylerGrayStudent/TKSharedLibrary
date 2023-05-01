import { Branch } from './Branch';
import { HQBase } from './HQBase';

export interface Franchise extends HQBase {
  name: string;
  branches: Branch[];
  legalBusinessName: string;
  franchiseUrl: string;
  franchiseAccountNumber: string;
  franchiseAchPrefix: string;
  franchiseStartDate: Date | string;
  franchiseCloseDate: Date | string;
  franchiseEndDate: Date | string;
  federalTaxId: string;
  isArchived: boolean;
  businessModelId: string;
  legacyFranchiseId: number;
}
