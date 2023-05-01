export interface HQBase {
  friendlyId?: number;
  uniqueId?: string;
  createdDate?: Date | string;
  createdById?: string;
  createdBy?: string;
  lastModifiedDate?: Date | string;
  lastModifiedById?: string;
  lastModifiedBy?: string;
  deleted?: boolean;
  rowVersion?: string;
}
