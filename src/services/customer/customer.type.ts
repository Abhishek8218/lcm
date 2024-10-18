


export interface IAddCustomer {
    profile: string;
    full_name: string;
    gender: 'Male' | 'Female' | 'Other'; // Enum for gender
    father_name: string;
    occupation: string;
    salary: number;
    address: string;
    phone: string;
    aadhaar_card: string;
    pan_card: string;
     voterCard?: string; // Optional property
  }









  // types/userProfile.ts
export interface UserProfile {
    _id: string;
    profile: string;
    full_name: string;
    gender: 'Male' | 'Female' | 'Other';
    father_name: string;
    occupation: string;
    salary: number;
    address: string;
    phone: string;
    aadhaar_card: string;
    pan_card: string;
    createdAt: string;
  }
  
  // types/extra.ts
  export interface Extra {
    page: number;
    limit: number;
    total: number;
  }

  export interface IGetCustomersApiResponse {
    success: boolean;
    message: string;
    data: UserProfile[];
    code: number;
    extra: Extra;
  }
  