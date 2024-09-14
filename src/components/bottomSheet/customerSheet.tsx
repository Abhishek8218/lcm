import React from 'react';
import { useModal } from './useModal';
import { X } from 'lucide-react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'; // Import the library's styles
import SearchBar from '../autoSuggest';

interface OtpModalProps {
  onSelect: (value: string) => void;
  isOpen: boolean;
}

const defaultSuggestions = [
  'Adam', 'Bella', 'Charlie', 'David', 'Fiona', 'George'
];

export const CustomerModal: React.FC<OtpModalProps> = ({ isOpen, onSelect }) => {
  const { closeModal } = useModal();


  const handleSelect = (value: string) => {
    onSelect(value);
    closeModal();
  };

  

  return (
    <BottomSheet
      open={isOpen}
      onDismiss={closeModal}
// Configuring the snap point to 50% of the viewport height
      header={
        <div className="flex flex-col justify-between items-center px-4">
          <div className='flex flex-row justify-between items-center w-full'>
          <h2 className="text-lg font-bold">Select Customer</h2>
          <X className="w-6 h-6 text-gray-400 cursor-pointer" onClick={closeModal} />
          </div>
          <div className="w-full pt-2">

          <SearchBar
            suggestions={defaultSuggestions}
            onSelect={(value) => handleSelect(value)}
          />
        </div>
        </div>
        
      }
    >
      <div className="">
       
        <div className="w-full">
          <ul className="bg-white rounded-lg">
            {defaultSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-8 py-3 cursor-pointer hover:bg-gray-100 border-b-2 border-gray-200 text-lg font-semibold text-gray-700"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BottomSheet>
  );
};
