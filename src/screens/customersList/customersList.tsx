/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, SlidersHorizontal } from 'lucide-react'; // Lucide icons
import { SingleCustomerCard } from './singleCustomerCard';
import { useRouter } from 'next/navigation';
import SearchBar from '@/src/components/autoSuggest';
import { useModal } from '@/src/components/bottomSheet/useModal';
import { KYCBottomSheet } from '@/src/components/bottomSheet/kycOptionSheet';
import { useSetRecoilState } from 'recoil';
import { customerState } from '@/src/recoil/atoms/customerAtom';

export const CustomerList: React.FC = () => {
  const { openModal, modalStack } = useModal();
  const router = useRouter();
  const setCustomer = useSetRecoilState(customerState);
  const [customers, setCustomers] = useState<any[]>([]); // State to store customer data
  const [customersList, setCustomersList] = useState<string[]>([]); // State for customer names list

  // Fetch customer data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/dummyJSON/customers.json'); // Adjust path if needed
      const data = await res.json();
      setCustomers(data);

      // Extract customer names for the search bar
      const names = data.map((customer: any) => customer.name);
      setCustomersList(names);
    };
    fetchData();
  }, []);

  const handleCustomerClick = (customer: any) => {
    setCustomer(customer); // Set selected customer in Recoil state
    router.push('/customer-details');
  };

  console.log("in list",customers);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className=" fixed w-full flex flex-col items-center justify-start gap-y-7 p-4 bg-main text-white">
        <div className='w-full flex justify-start gap-[25%]'>
          <ArrowLeft className="w-6 h-6" onClick={() => router.push("/")} />
          <div className="text-lg text-center font-semibold">New Customer</div>
        </div>
        <div className='w-full flex justify-start items-center gap-x-1'>
          <SearchBar
            suggestions={customersList}
            onSelect={(value) => console.log(value)}
            wrapperClassName='w-[95%] mx-0'
            inputClassName='w-full'
          />
          <SlidersHorizontal size={20} className='text-center h-5 w-5' />
        </div>
      </header>

      {/* Customer Cards */}
      <div className="pt-36 px-4">
        {customers.map((customer, index) => (
            console.log("in list",customer),
          <div
            key={customer.id}
            onClick={() => handleCustomerClick(customer)}
          >
            <SingleCustomerCard key={index} customer={customer}/>
          </div>
        ))}
      </div>

      {/* New Button */}
      <div className="fixed bottom-4 w-full flex justify-center">
        <button className="bg-green-500 text-white p-2 px-6 rounded-[30px] shadow-lg flex items-center" onClick={() => openModal("kyc-modal")}>
          <Plus size={24} className="mr-2" />
          New
        </button>
      </div>

      {/* KYC Modal */}
      <KYCBottomSheet isOpen={modalStack.includes("kyc-modal")} />
    </div>
  );
};
