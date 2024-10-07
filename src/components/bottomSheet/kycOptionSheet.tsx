import React from "react";
import { useModal } from "./useModal"; // Custom hook for modal management
import { X } from "lucide-react"; // Icon library for closing icon
import { BottomSheet } from "react-spring-bottom-sheet";
import Link from "next/link";
// Import Bottom Sheet styles

interface KYCBottomSheetProps {
  isOpen: boolean;
 
}

export const KYCBottomSheet: React.FC<KYCBottomSheetProps> = ({
  isOpen,

}) => {
  const { closeModal } = useModal();

//   const handleSelect = () => {

//     closeModal();
//   };

  const snapPoints = [300];

  return (
    <BottomSheet
      open={isOpen}
      onDismiss={closeModal}
      initialFocusRef={false}
      snapPoints={() => snapPoints}
      header={
        <div className="flex flex-col justify-between items-center px-4">
          <div className="flex flex-row justify-between items-center w-full">
            <h2 className="text-lg font-bold">Select KYC Method</h2>
            <X
              className="w-6 h-6 text-gray-400 cursor-pointer"
              onClick={closeModal}
            />
          </div>
        </div>
      }
    >
      <div className="p-4 h-full " >
        <div className="flex flex-col justify-center space-y-4 min-h-[220px] ">
          <Link
            href="/manual-kyc"
            className="px-6 py-4 bg-green-500 text-white text-lg text-center font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all"
            onClick={closeModal}
          >
            Manual KYC
          </Link>
          <Link
          href="/e-kyc"
            className="px-6 py-4 bg-main text-white text-lg text-center font-semibold rounded-lg shadow-md hover:bg-main transition-all"
            onClick={closeModal}
          >
            Digital KYC
          </Link>
        </div>
      </div>
    </BottomSheet>
  );
};
