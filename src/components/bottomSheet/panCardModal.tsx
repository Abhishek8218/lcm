import Image from 'next/image';
import React from 'react';
import { useModal } from './useModal';
import { LucideLoader2, X } from 'lucide-react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

interface OtpModalProps {
  onVerify: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isOpen: boolean;
}

export const PanCardModal: React.FC<OtpModalProps> = ({ onVerify, isLoading, isOpen, isSuccess }) => {
  const { closeModal } = useModal();


  return (
    <>
      <BottomSheet
        open={isOpen}
        onDismiss={closeModal}
    
        header={
          <div className="flex flex-col justify-between items-center px-4">
            <div className="flex flex-row justify-end items-center w-full">
              <X className="w-6 h-6 text-gray-400 cursor-pointer" onClick={closeModal} />
            </div>
          </div>
        }
      >
        <div className="px-6 max-h-[80vh] overflow-y-auto">
          <div className='relative w-full min-h-[300px] flex flex-col justify-center items-center gap-2 pb-6'>
            {isSuccess ? (
              <div className='relative flex flex-col min-h-[300px] justify-center items-center w-full'>
                <Image src="/verified.svg" alt='verified logo' height={134} width={134} />
                <div className="text-center text-lg font-semibold">PAN Card Verified</div>
              </div>
            ) : (
              <div className='w-full flex flex-col justify-center'>
                <div className='text-xl text-center font-semibold mb-4 '>Verify Your PAN Details</div>
                <div className="flex flex-col w-full justify-start items-start gap-2 mb-6 px-2">
                  <p className='text-left text-base text-medium text-gray-800'>Name: <span className='font-semibold'>John Doe</span></p>
                  <p className='text-left text-base'>Father&apos;s Name: <span className='font-semibold'>Senior John Doe</span></p>
                  <p>DOB: <span className='font-semibold'> 01-01-2000</span></p>
                </div>
                <div className='flex justify-between items-center  w-full p-2'>
                  <button 
                    className='text-base font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200' 
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button 
                    className='text-base font-medium text-blue-500 hover:text-blue-700 transition-colors duration-200' 
                    onClick={onVerify}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </BottomSheet>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <LucideLoader2 size={40} className='animate-spin text-white' />
        </div>
      )}
    </>
  );
};
