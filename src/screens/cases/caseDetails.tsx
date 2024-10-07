'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQueryParams, StringParam } from 'use-query-params';
import customerCases from '../../../public/dummyJSON/customers.json';
import { SingleCaseCard } from './singleCaseCard';
import { ArrowLeft } from 'lucide-react';

const CaseDetail: React.FC = () => {
  const router = useRouter();
  const [query] = useQueryParams({ caseID: StringParam }); // Get the caseID from the query
  const caseId = query.caseID;

  // Flatten case data from all customers
  const caseData = customerCases.flatMap(customer => customer.casesList);

  // Find the selected case based on the caseID
  const selectedCase = caseData.find(caseInfo => caseInfo.caseID === caseId);

  if (!selectedCase) {
    return <div>Case not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen ">
     <header className="fixed w-full  flex items-center justify-start gap-[25%] p-4 bg-main text-white ">
        <ArrowLeft className="w-6 h-6" onClick={() => { router.push("/cases") }} />
        <div className="text-lg text-center font-semibold">Case Details</div>
      </header>

      {/* Use SingleCaseCard to display details */}
      <div className='pt-24 px-4'>
      <SingleCaseCard caseInfo={selectedCase} />



      <div className="border border-[#D9D9D9] rounded-lg p-4 bg-white mb-4 shadow-sm ">
     

      <div className="mt-2">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="font-medium text-[12px] text-[#4B5563]">Tenure</h3>
            <p className="text-[13px] font-semibold text-black">
              {selectedCase.tenure} months
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[12px] text-[#4B5563] text-right">
              Frequency
            </h3>
            <p className="text-[13px] font-semibold text-black text-right">
              {selectedCase.frequency}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="font-medium text-[12px] text-[#4B5563]">Tenure</h3>
            <p className="text-[13px] font-semibold text-black">
              {selectedCase.tenure} months
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[12px] text-[#4B5563] text-right">
              Frequency
            </h3>
            <p className="text-[13px] font-semibold text-black text-right">
              {selectedCase.frequency}
            </p>
          </div>
        </div>

      </div>
    </div>

      </div>
    </div>
  );
};

export default CaseDetail;
