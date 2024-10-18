import React from 'react';
import { useModal } from './useModal';
import { X } from 'lucide-react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'; // Import the library's styles
import SearchBar from '../autoSuggest';

interface OtpModalProps {
  onSelect: (id: string) => void; // Change to ID type
  isOpen: boolean;
}

// Update suggestions to be an array of objects with id and name
const defaultSuggestions = [
  { id: '1', name: 'Adam' }, 
  { id: '2', name: 'Bella' }, 
  { id: '3', name: 'Charlie' }, 
  { id: '4', name: 'David' }, 
  { id: '5', name: 'Fiona' }, 
  { id: '6', name: 'George' },
  { id: '7', name: 'Samantha' }, 
  { id: '8', name: 'Harry' }, 
  { id: '9', name: 'Olivia' }, 
  { id: '10', name: 'Isabella' }, 
  { id: '11', name: 'Mason' }, 
  { id: '12', name: 'Sophia' }, 
  { id: '13', name: 'James' }, 
  { id: '14', name: 'Ava' }, 
  { id: '15', name: 'Liam' }, 
  { id: '16', name: 'Ethan' }, 
  { id: '17', name: 'Noah' }, 
  { id: '18', name: 'Emma' }, 
  { id: '19', name: 'Michael' }, 
  { id: '20', name: 'Lucas' }, 
  { id: '21', name: 'Amelia' }
];

const customers = [
  { id: '1', name: 'Adam' }, 
  { id: '2', name: 'Bella' }, 
  { id: '3', name: 'Charlie' }, 
  { id: '4', name: 'David' }, 
  { id: '5', name: 'Fiona' }, 
  { id: '6', name: 'George' }, 
  { id: '7', name: 'Kelly' },
  { id: '8', name: 'Samantha' }, 
  { id: '9', name: 'Harry' }, 
  { id: '10', name: 'Olivia' }, 
  { id: '11', name: 'Isabella' }, 
  { id: '12', name: 'Mason' }, 
  { id: '13', name: 'Sophia' }, 
  { id: '14', name: 'James' }, 
  { id: '15', name: 'Ava' }, 
  { id: '16', name: 'Liam' }, 
  { id: '17', name: 'Ethan' }, 
  { id: '18', name: 'Noah' }, 
  { id: '19', name: 'Emma' }, 
  { id: '20', name: 'Michael' }, 
  { id: '21', name: 'Lucas' }, 
  { id: '22', name: 'Amelia' },
  { id: '23', name: 'Alexander' }, 
  { id: '24', name: 'Mia' }, 
  { id: '25', name: 'Benjamin' }, 
  { id: '26', name: 'Charlotte' }, 
  { id: '27', name: 'Jack' }, 
  { id: '28', name: 'Lily' }, 
  { id: '29', name: 'Daniel' },
  { id: '30', name: 'Ella' }, 
  { id: '31', name: 'Henry' }, 
  { id: '32', name: 'Grace' }, 
  { id: '33', name: 'Matthew' }, 
  { id: '34', name: 'Zoe' }, 
  { id: '35', name: 'Owen' }, 
  { id: '36', name: 'Scarlett' }, 
  { id: '37', name: 'Ryan' }, 
  { id: '38', name: 'Hazel' }, 
  { id: '39', name: 'Gabriel' }, 
  { id: '40', name: 'Aria' }, 
  { id: '41', name: 'William' }, 
  { id: '42', name: 'Chloe' }, 
  { id: '43', name: 'Sebastian' }
];

export const CustomerModal: React.FC<OtpModalProps> = ({ isOpen, onSelect }) => {
  const { closeModal } = useModal();

  const handleSelect = (customerId: string) => {
    onSelect(customerId); // Send the ID to the parent
    closeModal();
  };

  const snapPoints = [400, 700];

  return (
    <BottomSheet
      open={isOpen}
      onDismiss={closeModal}
      initialFocusRef={false}
      snapPoints={() => snapPoints}
      header={
        <div className="flex flex-col justify-between items-center px-4">
          <div className='flex flex-row justify-between items-center w-full'>
            <h2 className="text-lg font-bold">Select Customer</h2>
            <X className="w-6 h-6 text-gray-400 cursor-pointer" onClick={closeModal} />
          </div>
          <div className="w-full pt-2">
            <SearchBar
              suggestions={customers.map(customer => customer.name)} // Pass only names to SearchBar
              onSelect={(value) => {
                const selectedCustomer = customers.find(customer => customer.name === value);
                if (selectedCustomer) {
                  handleSelect(selectedCustomer.id); // Use ID for selection
                }
              }}
            />
          </div>
        </div>
      }
    >
      <div className="w-full">
        <ul className="bg-white rounded-lg">
          {defaultSuggestions.map((suggestion) => (
            <li
              key={suggestion.id} // Use ID as key
              className="px-8 py-3 cursor-pointer hover:bg-gray-100 border-b-2 border-gray-200 text-lg font-semibold text-gray-700"
              onClick={() => handleSelect(suggestion.id)} // Pass ID on select
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      </div>
    </BottomSheet>
  );
};
