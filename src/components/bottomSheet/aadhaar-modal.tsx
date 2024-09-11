import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useModal } from './useModal';
import { LucideLoader, LucideLoader2, XCircle } from 'lucide-react';

interface OtpModalProps {
  onVerify: (otp: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isOpen: boolean;
}

export const AadhaarMOdal: React.FC<OtpModalProps> = ({ onVerify, isLoading, isOpen, isSuccess }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { closeModal } = useModal();

  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      onVerify(otp.join(''));
    }
  }, [otp, onVerify]);

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
              {isSuccess ? (
             <div className='relative flex flex-col min-h-[300px] justify-center items-center '>
             <Image src="/verified.svg" alt='verified logo' height={134} width={134} />
             <div>
             <XCircle className='absolute right-[-10px] top-[-4px] w-6 h-6 text-gray-400 cursor-pointer' onClick={closeModal} />
           </div>
             <div className="text-center text-lg font-semibold">Mobile Number Verified</div>
            </div>
          ) : (
        <div className='relative w-full min-h-[300px] flex flex-col justify-center items-center gap-2 pb-6'>
          <div>
            <XCircle className='absolute right-0 top-[-4px] w-6 h-6 text-gray-400 cursor-pointer' onClick={closeModal} />
          </div>

          <Image src="/aadhaar.svg" alt='aadhaar logo' height={60} width={80} />
          <div className='text-xl font-semibold'>Verify OTP</div>

    
            <div className="flex justify-between gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder='-'
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => {
                    if (el) {
                      inputRefs.current[index] = el;
                    }
                  }}
                  className="w-12 h-12 text-center border rounded-md text-lg font-semibold"
                  style={{ lineHeight: '3rem' }}
                  disabled={isLoading}
                />
              ))}
            </div>
       
          <div className='flex justify-between items-center w-full p-2'>
            <p className='text-base font-medium text-gray-500 cursor-pointer'>Resend</p>
            <p className='text-base font-medium text-gray-500 cursor-pointer' onClick={closeModal}>Edit Aaadhar</p>
          </div>
        </div>
          )}

      </div>
      {isLoading && <div className="loader"><LucideLoader2 size={40} className='animate-spin absolute top-10 right-[45%]  text-white z-50 '/></div>}
    </div>
  );
};


