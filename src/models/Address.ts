export interface Address {
  streetAddress: string;
  streetAddressExtended?: string;
  city: string;
  county?: string;
  state: string;
  zipCode: string;
  isPoBox?: boolean;
}
