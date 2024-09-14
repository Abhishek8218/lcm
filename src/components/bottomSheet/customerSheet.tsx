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
  'Adam', 'Bella', 'Charlie', 'David', 'Fiona', 'George','Samantha', 'Harry', 'Olivia', 'Isabella', 'Mason', 'Sophia', 'James', 
  'Ava', 'Liam', 'Ethan', 'Noah', 'Emma', 'Michael', 'Lucas', 'Amelia'
];
const customers = [
  'Adam', 'Bella', 'Charlie', 'David', 'Fiona', 'George', 'Kelly',
  'Samantha', 'Harry', 'Olivia', 'Isabella', 'Mason', 'Sophia', 'James', 
  'Ava', 'Liam', 'Ethan', 'Noah', 'Emma', 'Michael', 'Lucas', 'Amelia',
  'Alexander', 'Mia', 'Benjamin', 'Charlotte', 'Jack', 'Lily', 'Daniel',
  'Ella', 'Henry', 'Grace', 'Matthew', 'Zoe', 'Owen', 'Scarlett', 
  'Ryan', 'Hazel', 'Gabriel', 'Aria', 'William', 'Chloe', 'Sebastian'
];

export const CustomerModal: React.FC<OtpModalProps> = ({ isOpen, onSelect }) => {
  const { closeModal } = useModal();


  const handleSelect = (value: string) => {
    onSelect(value);
    closeModal();
  };

 const  snapPoints=[400,700]

  return (
    <BottomSheet
      open={isOpen}
     onDismiss={closeModal}
      initialFocusRef={false}
    

      // onSpringCancel={() => console.log('spring cancel')}
  
// Configuring the snap point to 50% of the viewport height
snapPoints={() => snapPoints}
      header={
        <div className="flex flex-col justify-between items-center px-4">
          <div className='flex flex-row justify-between items-center w-full'>
          <h2 className="text-lg font-bold">Select Customer</h2>
          <X className="w-6 h-6 text-gray-400 cursor-pointer" onClick={closeModal} />
          </div>
          <div className="w-full pt-2">

          <SearchBar
            suggestions={customers}
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
