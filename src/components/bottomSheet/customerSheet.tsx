import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useModal } from './useModal';
import { LucideLoader2, X, XCircle } from 'lucide-react';
import SearchBar from '../autoSuggest';

interface OtpModalProps {
onSelect: (value: string) => void;
  isOpen: boolean;
}

const customers = [
    'Adam',
    'Bella',
    'Charlie',
    'David',
    'Fiona',
    'George',
    'Kelly',
    'Adam',
    'Bella',
    'Charlie',
    'David',
    'Fiona',
    'George',
    'Kelly',
    'Adam',
    'Bella',
    'Charlie',
    'David',
    'Fiona',
    'George',
    'Kelly',
    'Adam',
    'Bella',
    'Charlie',
    'David',
    'Fiona',
    'George',
    'Samantha', // derived from "apple book"
    'Kelly',
    'Adam',
    'Bella',
    'Charlie',
    'David',
    'Fiona',
    'George',
    'Kelly',
  ];
  

export const CustomerModal: React.FC<OtpModalProps> = ({isOpen,onSelect }) => {

  const { closeModal } = useModal();
const handleSelect = (value: string) => {
    onSelect(value);
    closeModal();
    
  };

 
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
        <div className='relative w-full min-h-[300px] flex flex-col justify-start items-start gap-2'>
        <div>
            <X className='absolute right-[-10px] top-[-4px] w-6 h-6 text-gray-400 cursor-pointer' onClick={closeModal} />
          </div>
            <div className='pt-10'>
       <SearchBar suggestions={customers} onSelect={handleSelect}  />
       </div>
        </div>

        {/* {isLoading && <div className="loader"><LucideLoader2 size={40} className='animate-spin absolute top-1/2 left-1/2  text-white '/></div>} */}
     
      </div>
    </div>
  );
};


