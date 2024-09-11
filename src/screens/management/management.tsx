// components/Dashboard.tsx
'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users,  Search, User, ClipboardPlus, IndianRupee, ChartArea, Loader2 } from 'lucide-react'; // Import Lucide icons
import { useRouter } from 'next/navigation';

const fetchManagementData = async () => {
  const response = await fetch('/dummyJSON/management.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const Management: React.FC = () => {

const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['managementData'],
    queryFn: fetchManagementData,
  });

  if (isLoading) return <div><Loader2 className=' absolute top-1/2 right-1/2 animate-spin'/></div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className=" bg-white">
     <nav className='bg-main px-4'>
      <header className="flex items-center justify-between py-4  text-white">
        <div className="text-lg font-semibold">Logo</div>
        <User className="w-7 h-7"  strokeWidth={1} />
      </header>

        <div className="relative mb-4">
            <Search className="absolute right-3 top-2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Case ID"
            className="w-full max-w-[400px] p-2 border rounded-lg shadow-sm"
          />
        </div>

        <div className="flex justify-between pb-6 pt-4">
          <button className="text-center flex flex-col items-center text-white" >
            <ClipboardPlus className="w-9 h-9 pb-1" strokeWidth={1}  onClick={() => {router.push("/new-case")}}/>
            <span className='text-xs'>New Case</span>
          </button>
          <button className="text-center flex flex-col items-center text-white">
            <IndianRupee className="w-9 h-9 pb-1"  strokeWidth={1} />
            <span className='text-xs'>Repayment</span>
          </button>
          <button className="text-center flex flex-col items-center text-white" onClick={() => {router.push("/new-customer")}}>
            <Users className="w-9 h-9 pb-1"  strokeWidth={1}/>
            <span className='text-xs'>Customers</span>
          </button>
          <button className="text-center flex flex-col items-center text-white">
            <ChartArea className="w-9 h-9 pb-1"  strokeWidth={1}/>
            <span className='text-xs'>Reports</span>
          </button>
        </div>
        </nav>
{/* 
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 rounded-md">Total Case: {data.totalCases}</div>
          <div className="p-4 bg-red-100 rounded-md">Total Dispute Case: {data.totalDisputeCases}</div>
          <div className="p-4 bg-blue-100 rounded-md">Previous Day Amount: {data.previousDayAmount}</div>
          <div className="p-4 bg-blue-100 rounded-md">Today Amount: {data.todayAmount}</div>
          <div className="p-4 bg-blue-100 rounded-md">Next Day Amount: {data.nextDayAmount}</div>
          <div className="p-4 bg-blue-100 rounded-md">Total Customer: {data.totalCustomers}</div>
          <div className="p-4 bg-blue-100 rounded-md">Total Employee: {data.totalEmployees}</div>
        </div> */}

<div className='p-4 flex flex-col gap-5'>
    <div className='flex flex-row w-full justify-center items-center gap-4 '>
        <div className='flex-1 items-center text-left  bg-light   border-light w-[11.8rem] h-[5.7rem]  rounded-[10px]' >

        <p className='p-3'>Total Case <br/> <span className='text-xl font-bold'>{data.totalCases}</span></p>
        </div>
        <div className='flex-1 items-center text-left bg-light-secondary border-light-secondary  w-[11.8rem] h-[5.7rem]  rounded-[10px]'>
   
        <p className='p-3'>Total Dispute Case <br/> <span className='text-xl font-bold'>{data.totalDisputeCases}</span></p>
        </div>

    </div>
    <div className='bg-light  border-light w-full rounded-[10px]'>

        <p className='p-3'>Previous Day Amount <br/> <span className='text-xl font-bold'> {data.previousDayAmount}</span></p>
    
    </div>
    <div className='bg-light border-light w-full rounded-[10px]'>

<p className='p-3'>Today Amount <br/> <span className='text-xl font-bold'> {data.todayAmount}</span></p>

</div>
<div className='bg-light border-light w-full rounded-[10px]'>

<p className='p-3'>Next Day Amount <br/> <span className='text-xl font-bold'> {data.nextDayAmount}</span></p>

</div>
<div className='flex flex-row w-full justify-center items-center gap-4 '>
        <div className='flex-1 items-center text-left  bg-light border-light w-[11.8rem] h-[5.7rem]  rounded-[10px]' >

        <p className='p-3'>Total Customers <br/> <span className='text-xl font-bold'>{data.totalCustomers}</span></p>
        </div>
        <div className='flex-1 items-center text-left bg-light border-light  w-[11.8rem] h-[5.7rem]  rounded-[10px]'>
   
        <p className='p-3'>Total Employee<br/> <span className='text-xl font-bold'>{data.totalEmployees}</span></p>
        </div>

    </div>
</div>





      </div>
  
  );
};

;
