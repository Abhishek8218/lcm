import React, { useEffect } from 'react';
import { useModal } from './useModal';
import { X } from 'lucide-react';
import SearchBar from '../autoSuggest';

interface OtpModalProps {
  onSelect: (value: string) => void;
  isOpen: boolean;
}

const customers = [
  'Adam', 'Bella', 'Charlie', 'David', 'Fiona', 'George', 'Kelly',
  'Adam', 'Bella', 'Charlie', 'David', 'Fiona', 'George', 'Kelly',
  'Adam', 'Bella', 'Charlie', 'David', 'Fiona', 'George', 'Kelly',
  'Adam', 'Bella', 'Charlie', 'David', 'Fiona', 'George', 'Samantha',
  'Kelly', 'Adam', 'Bella', 'Charlie', 'David', 'Fiona', 'George', 'Kelly',
];

export const CustomerModal: React.FC<OtpModalProps> = ({ isOpen, onSelect }) => {
  const { closeModal } = useModal();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onSelect(value);
    closeModal();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeModal}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className='relative w-full min-h-[300px] flex flex-col justify-start items-start gap-2'>
            <div>
              <X className='absolute right-0 top-0 w-6 h-6 text-gray-400 cursor-pointer' onClick={closeModal} />
            </div>
            <div className='pt-10 w-full'>
              <SearchBar suggestions={customers} onSelect={handleSelect} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};