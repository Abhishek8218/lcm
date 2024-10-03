'use client'

import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { customerState } from '@/src/recoil/atoms/customerAtom';
import { SingleCaseCard } from '../cases/singleCaseCard';
import { SingleCustomerCard } from './singleCustomerCard';

const CustomerDetails: React.FC = () => {
  const router = useRouter();
  const customer = useRecoilValue(customerState);
  console.log(customer) // Get the selected customer from Recoil

   // Use useEffect to handle redirection
   useEffect(() => {
    if (!customer) {
      router.push('/customers');
    }
  }, [customer, router]);

  // If customer is not available yet, return null
  if (!customer) {
    return null; // or return a loading spinner/message if needed
  }


  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="flex flex-col items-center justify-start gap-y-7 p-4 bg-main text-white">
        <div className='w-full flex justify-start gap-[25%]'>
          <ArrowLeft className="w-6 h-6" onClick={() => router.push("/customers")} />
          <div className="text-lg text-center font-semibold">New Customer</div>
        </div>
     
      </header>

      {/* Customer Summary */}
      <div className="mt-6 px-4">
      
      <SingleCustomerCard customer={customer} showKYCDetailButton={true} />
      </div>

      {/* Cases List */}
      <div className="mt-6 px-4">
        <h3 className="text-lg font-semibold mb-4">Cases</h3>

        {customer.casesList && customer.casesList.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          customer.casesList.map((caseItem: any, index: number) => (
            // <div key={index} className="bg-white shadow-md p-4 rounded-lg mb-4 border">
            //   <div className="flex justify-between items-center">
            //     <p className="font-medium">Case ID</p>
            //     <p className="font-semibold">{caseItem.caseId || "N/A"}</p>
            //   </div>
            //   <div className="flex justify-between items-center mt-2">
            //     <p className="font-medium">Case Amount</p>
            //     <p className="font-semibold">{caseItem.amount || "N/A"}</p>
            //   </div>
            //   <div className="mt-4">
            //     <p className="text-sm text-gray-500">Tenure: {caseItem.tenure || "N/A"}</p>
            //     <p className={`text-sm ${caseItem.paymentHealth === 'Good' ? 'text-green-500' : 'text-red-500'}`}>
            //       Payment Health: {caseItem.paymentHealth || "N/A"}
            //     </p>
            //     <p className="text-sm text-gray-500">Frequency: {caseItem.frequency || "N/A"}</p>
            //     <p className={`text-sm ${caseItem.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
            //       Status: {caseItem.status || "N/A"}
            //     </p>
            //   </div>
            // </div>
<SingleCaseCard key={index} caseInfo={caseItem} useID={true} />

          ))
        ) : (
          <p className="text-sm text-gray-500">No cases available for this customer.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
