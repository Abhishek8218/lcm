// AgendaCard.tsx
import { format } from 'date-fns';
import React from 'react';
import { RepaymentBottomSheet } from '../bottomSheet/repaymentSheet';
import { useModal } from '../bottomSheet/useModal';

interface CaseInfo {
  caseID: string;
  customer: string;
  tenure: number;
  amount: number;
  paymentHealth: string;
  frequency: string;
  status: string;
}

interface AgendaCardProps {
  caseInfo: CaseInfo[];
  selectedDate: Date;
}

const AgendaCard: React.FC<AgendaCardProps> = ({ caseInfo, selectedDate }) => {

console.log("caseinfos",caseInfo);

const { openModal, modalStack } = useModal();

    
    
const handleCustomerClick = () => {
    openModal("repayment-modal");
}

  return (
    <div className="inset-0 flex flex-col items-center justify-center z-50 mt-2 w-full">
    
            {/*  Display the selected date */}
        <h3 className="font-medium text-base mb-2 bg-gray-100 p-2 w-full border-y border-gray-400 text-center">
          {format(selectedDate, 'MMMM dd, yyyy')}
    
        </h3>


      {/* Iterate through caseInfo and display each case as a card */}
      <div className="w-full p-2">
        {caseInfo.map((caseInfo) => (
           <div key={caseInfo.caseID} className="border border-[#D9D9D9] rounded-lg p-4 bg-white mb-4" onClick={handleCustomerClick}>
           <div className="flex justify-between items-center">
             <div>
               <h3 className="font-medium text-[13px] text-[#4B5563]">
               {"Customer Name "}
               </h3>
               <p className="text-[15px] font-semibold text-black">
                 {caseInfo.customer}
               </p>
             </div>
             <div>
               <h3 className="font-medium text-[13px] text-[#4B5563] text-right">
                 Case Amount
               </h3>
               <p className="text-[15px] font-semibold text-black text-right">
                 Rs.{caseInfo.amount}
               </p>
             </div>
           </div>
     
           <div className=" mt-2 py-2">

     
             <div className="flex justify-between items-center">
               <div>
                 <h3 className="font-medium text-[12px] text-[#4B5563]">
                Customer Name
                 </h3>
                 <p className="text-[15px] font-semibold text-black">
                 {caseInfo.customer}
               </p>
               </div>
               <div>
                 <h3 className="font-medium text-[12px] text-[#4B5563] text-right">
                   Status
                 </h3>
                 <p
                   className={`text-[13px] font-semibold  text-right ${
                     caseInfo.status === "Active"
                       ? "text-[#008B27]"
                       : "text-[#1310A5]"
                   }`}
                 >
                   {caseInfo.status}
                 </p>
               </div>
             </div>
           </div>
         </div>
        ))}
      </div>
      <RepaymentBottomSheet isOpen={modalStack.includes("repayment-modal")} />
    </div>
  );
};

export default AgendaCard;
