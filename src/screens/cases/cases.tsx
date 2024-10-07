// Update the CaseList component to navigate to CaseDetail
'use client'

import React from 'react';
import { ArrowLeft, Plus, SlidersHorizontal } from 'lucide-react'; // Lucide icons
import { useRouter } from 'next/navigation';
import SearchBar from '@/src/components/autoSuggest';
import { SingleCaseCard } from './singleCaseCard';
import customerCases from '../../../public/dummyJSON/customers.json';

// Flattening caseData from all customers
const caseData = customerCases.flatMap(customer => customer.casesList);
const casesList = customerCases.map(customer => customer.name);

export const CaseList: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="fixed w-full flex flex-col items-center justify-start gap-y-7 p-4 bg-main text-white">
        <div className='w-full flex justify-start gap-[25%] pl-2'>
          <ArrowLeft className="w-6 h-6" onClick={() => router.push("/")} />
          <div className="text-lg text-center font-semibold">New case</div>
        </div>
        <div className='w-full flex justify-start items-center gap-x-1'>
          <SearchBar
            suggestions={casesList}
            onSelect={(value) => console.log(value)}
            wrapperClassName='w-[95%] mx-0'
            inputClassName='w-full'
          />
          <SlidersHorizontal size={20} className='text-center h-5 w-5' />
        </div>
      </header>

      {/* Case Cards */}
      <div className="px-4 pt-36">
        {caseData.map((caseInfo, index) => (
          <div
            key={index}
            onClick={() => router.push(`/case-detail/${caseInfo.caseID}`)} // Navigate to case detail page
            className="cursor-pointer"
          >
            <SingleCaseCard caseInfo={caseInfo} />
          </div>
        ))}
      </div>

      {/* New Button */}
      <div className="fixed bottom-4 w-full flex justify-center">
        <button className="bg-green-500 text-white p-2 px-6 rounded-[30px] shadow-lg flex items-center" onClick={() => { router.push("/new-case") }}>
          <Plus size={24} className="mr-2" />
          New
        </button>
      </div>
    </div>
  );
};
