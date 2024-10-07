"use client"

import EventCalendar from '@/src/components/eventCalendar/eventCalendar';
import { ArrowLeft, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'






export const Repayment = () => {
 
    
    const router = useRouter();

  return (
    <div>
            <header className="fixed w-full  flex items-center justify-start gap-[25%] p-4 bg-main text-white ">
        <ArrowLeft className="w-6 h-6" onClick={() => { router.push("/") }} />
        <div className="text-lg text-center font-semibold">Reayment List</div>
      </header>
      <EventCalendar  />



      <div className="fixed bottom-4 w-full flex justify-center">
                <button className="bg-green-500 text-white p-2 px-6 rounded-[30px] shadow-lg flex items-center" >
                    <Plus size={24} className="mr-2" />
                    New
                </button>
            </div>
    </div>
  )
}
