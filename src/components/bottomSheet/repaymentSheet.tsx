import React, { useEffect, useState } from "react";
import { useModal } from "./useModal"; // Custom hook for modal management
import { Info, X } from "lucide-react"; // Icon library for closing icon
import { BottomSheet } from "react-spring-bottom-sheet";
import { UnpaidRepaymentBottomSheet } from "./unpaidRepaymentSheet";

// Import Bottom Sheet styles

interface RepaymentBottomSheetProps {
  isOpen: boolean;
 
}

export const RepaymentBottomSheet: React.FC<RepaymentBottomSheetProps> = ({
  isOpen,

}) => {
  const { closeModal } = useModal();
const [repaymentSheetClose, setRepaymentSheetClose] = useState(false);
//   const handleSelect = () => {

//     closeModal();
//   };


const handleUnpaidClick = () => {


    openModal("UnpaidRepayment-modal");
   

}





const { openModal, modalStack } = useModal();

const handleUnpaidReasonSubmitClick = () => {
    setRepaymentSheetClose(true)
    closeModal();

}
 
useEffect( () => {
    if(repaymentSheetClose){
        closeModal()
    }

},[repaymentSheetClose])

  const snapPoints = [220];

  return (
    <BottomSheet

      open={isOpen}
    onDismiss={handleUnpaidClick}
      initialFocusRef={false}
      snapPoints={() => snapPoints}
      header={
        <div className="flex flex-col justify-between items-center px-4">
          <div className="flex flex-row justify-between items-center w-full">
            <h2 className="text-lg font-bold">Update Payment Status</h2>
            <X
              className="w-6 h-6 text-gray-400 cursor-pointer"
              onClick={closeModal}
            />
          </div>
        </div>
      }
    >
      <div className="p-4 pb-0 h-[150px] flex flex-col justify-between" >
      <div>
      <div className="flex flex-row w-full justify-between"> 
<p className="text-[13px] font-semibold">EMI Amount

</p>
<p  className="text-[13px] font-semibold">₹ 5000</p>
            </div>
<div className="flex justify-start items-center text-base font-semibold">
    Customer Info <span className="m-1"><Info size={20} className="text-gray-700"/></span>
</div>

      </div>
        <div className="flex flex-row justify-center space-x-16 ">
          <button
            
            className="px-6 py-2 min-w-[150px] bg-green-500 text-white text-lg text-center font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all"
            onClick={closeModal}
          >
        Paid
          </button>
          <button
            className="px-6 py-1  min-w-[150px] bg-main text-white text-lg font-semibold rounded-lg shadow-md hover:bg-main transition-all"
            onClick={handleUnpaidClick}
          >
        UnPaid
          </button>
        </div>
      </div>
      <UnpaidRepaymentBottomSheet isOpen={modalStack.includes("UnpaidRepayment-modal")} handleUnpaidReasonSubmitClick = { handleUnpaidReasonSubmitClick} />
    </BottomSheet>
  );
};
