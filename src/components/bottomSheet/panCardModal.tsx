import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useModal } from './useModal';
import { LucideLoader2, X, XCircle } from 'lucide-react';

interface OtpModalProps {
  onVerify: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isOpen: boolean;
}

export const PanCardMOdal: React.FC<OtpModalProps> = ({ onVerify, isLoading, isOpen, isSuccess }) => {

 
  const { closeModal } = useModal();

  

 
  return (
    <div
      className={` inset-0 flex items-end justify-center bg-black bg-opacity-50 ${
        isOpen ? 'opacity-100 fixed ' : 'opacity-0 translate-y-full hidden '
      } transition-opacity duration-300`}
    >
      <div
        className={`w-full  bg-white rounded-t-3xl px-6 py-3 transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-y-0 ' : 'translate-y-full'
        }`}
      >
        
        <div className='relative w-full min-h-[300px] flex flex-col justify-center items-center gap-2 pb-6'>

{isSuccess ? (
      <div className='relative flex flex-col min-h-[300px] justify-center items-center w-full '>
      <Image src="/verified.svg" alt='verified logo' height={134} width={134} />
      <div>
      <X className='absolute right-[-10px] top-[-4px] w-6 h-6 text-gray-400 cursor-pointer' onClick={closeModal} />
    </div>
      <div className="text-center text-lg font-semibold">Mobile Number Verified</div>
     </div>
) : (
            <div className='w-full flex flex-col justify-center'>
          <div>
            <X className='absolute right-0 top-[-4px] w-6 h-6 text-gray-400 cursor-pointer' onClick={closeModal} />
          </div>




          {/* <Image src="/mobile.svg" alt='aadhaar logo' height={60} width={80} /> */}
          <div className='text-xl text-center font-semibold'>Verify Your PAN Details</div>

        
            <div className="flex flex-col w-full justify-start items-start gap-2 mb-6 px-2">
           <p className='text-left text-base text-medium text-gray-800'>Name: <span className='font-semibold'>John Doe</span></p>
              <p className='text-left text-base'>Father's Name: <span className='font-semibold'>Senior John Doe</span></p>
           <p>DOB: <span  className='font-semibold'> 01-01-2000</span></p>
            </div>
        
          <div className='flex justify-between items-center w-full p-2'>
            <p className='text-base font-medium text-gray-500 cursor-pointer' onClick={closeModal}>Cancle</p>
            <p className='text-base font-medium text-gray-500 cursor-pointer' onClick={onVerify}>Confirm</p>
          </div>

          </div>
)}
        </div>


        {isLoading && <div className="loader"><LucideLoader2 size={40} className='animate-spin absolute top-1/2 left-1/2  text-white '/></div>}
      </div>
    </div>
  );
};


