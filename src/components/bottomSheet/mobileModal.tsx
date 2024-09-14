import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { LucideLoader2, X } from 'lucide-react';
import { useModal } from './useModal';


interface OtpModalProps {
  onVerify: (otp: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isOpen: boolean;
}

export const MobileModal: React.FC<OtpModalProps> = ({ onVerify, isLoading, isOpen, isSuccess }) => {
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
    <>
      {/* Spring Bottom Sheet Modal */}
      <BottomSheet
        open={isOpen}
        onDismiss={closeModal}
        initialFocusRef={false}
        header={
          <div className="flex flex-col justify-between items-center px-4">
            <div className="flex flex-row justify-end items-center w-full">
              <X className="w-6 h-6 text-gray-400 cursor-pointer" onClick={closeModal} />
            </div>
          </div>
        }
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="relative flex flex-col min-h-[300px] justify-center items-center">
              <Image src="/verified.svg" alt="verified logo" height={134} width={134} />
              <div className="text-center text-lg font-semibold">Mobile Number Verified</div>
            </div>
          ) : (
            <div className="relative w-full flex flex-col justify-center items-center gap-2 pb-6 min-h-[300px]">
              <Image src="/mobile.svg" alt="mobile logo" height={80} width={120} />
              <div className="text-xl font-semibold">Verify OTP</div>

              <div className="flex justify-between gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder="-"
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

              <div className="flex justify-between items-center w-full p-2">
                <p className="text-base font-medium text-gray-500 cursor-pointer">Resend</p>
                <p className="text-base font-medium text-gray-500 cursor-pointer" onClick={closeModal}>
                  Edit Mobile No.
                </p>
              </div>
            </div>
          )}
        </div>
      </BottomSheet>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <LucideLoader2 size={40} className="animate-spin text-white" />
        </div>
      )}
    </>
  );
};
