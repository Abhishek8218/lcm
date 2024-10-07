import React, { useState } from "react";
import { useModal } from "./useModal"; // Custom hook for modal management
import { X } from "lucide-react"; // Icon library for closing icon
import { BottomSheet } from "react-spring-bottom-sheet";

interface UnpaidRepaymentBottomSheetProps {
  isOpen: boolean;
  handleUnpaidReasonSubmitClick: () => void;
}

export const UnpaidRepaymentBottomSheet: React.FC<UnpaidRepaymentBottomSheetProps> = ({
  isOpen,handleUnpaidReasonSubmitClick
}) => {
  const { closeModal } = useModal();
  const [reason, setReason] = useState(""); // State to track textarea content

  // Function to handle textarea changes
  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  // Disable the submit button if the reason is empty
  const isSubmitDisabled = reason.trim().length === 0;

  const snapPoints = [300];

  return (
    <BottomSheet
      open={isOpen}
      onDismiss={closeModal}
      initialFocusRef={false}
      snapPoints={() => snapPoints}
      header={
        <div className="flex flex-col justify-between items-center pl-0 px-4">
          <div className="flex flex-row justify-between items-center w-full">
            <h2 className="text-base font-bold">No Payment Reason</h2>
            <X
              className="w-6 h-6 text-gray-400 cursor-pointer"
              onClick={closeModal}
            />
          </div>
        </div>
      }
    >
      <div className="p-4 pb-0 h-[230px] flex flex-col justify-between">
        <div className="space-y-3">
          <label htmlFor="reasonBox" className="text-base font-semibold">
            Specify the Reason:
          </label>
          <textarea
            name="reasonBox"
            placeholder="Specify the reason for no payment..."
            className="block px-2.5 pb-16 pt-4 w-full text-sm bg-slate-100 text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            value={reason} // bind the textarea value to the state
            onChange={handleReasonChange} // handle textarea changes
          />
        </div>
        <div className="flex flex-row justify-center space-x-16">
          <button
            className={`px-6 py-2 min-w-full text-lg text-center font-semibold rounded-lg shadow-md transition-all ${
              isSubmitDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            onClick={handleUnpaidReasonSubmitClick}
            disabled={isSubmitDisabled} // disable the button if there is no text
          >
            Submit
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
