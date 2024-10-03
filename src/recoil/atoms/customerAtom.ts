// recoil/atoms/customerAtom.ts
import { atom } from 'recoil';
export interface CaseDetails {
    caseId: string;
    caseAmount: string;
    tenure: string;
    paymentHealth: string;
    frequency: string;
    status: string;
  }
  
  export interface Customer {
    id: string;
    name: string;
    cases: number;
    pendingPayments: number;
    status: string;
    casesList: CaseDetails[];
  }
export const customerState = atom<Customer | null>({
  key: 'customerState', // Unique ID (with respect to other atoms/selectors)
  default: null, // Default value (aka initial value)
});
