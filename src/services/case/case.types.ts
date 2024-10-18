export interface INewCase {
    customerId: string;        // The unique identifier for the customer
    loan_amount: number;       // The total amount of the loan
    loan_tenure: number;       // The tenure of the loan in years (or months, based on your context)
    payment_cycle: string;       // The payment cycle, restricted to specific options
    emi_amount: number;        // The equated monthly installment amount
    final_amount: number;      // The total amount to be paid after interest, including the principal
  }
  
  