"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft } from "lucide-react";
import { AadhaarModal } from "../../components/bottomSheet/aadhaar-modal"; // Import the OTP modal
import { useModal } from "@/src/components/bottomSheet/useModal";
import { MobileModal } from "@/src/components/bottomSheet/mobileModal";
import { PanCardModal } from "@/src/components/bottomSheet/panCardModal";
import { useRouter } from "next/navigation";
import FileUploadComponent from "@/src/components/fileUpload";

// Validation schema using Yup
const schema = Yup.object().shape({
  aadhar: Yup.string()
    .matches(/^[0-9]{12}$/, "Aadhar number must be 12 digits")
    .required(),
  pan: Yup.string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number")
    .required(),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Mobile number must be 10 digits")
    .required(),
});

interface FormValues {
  aadhar: string;
  pan: string;
  mobile: string;
}

export const NewCustomerForm: React.FC = () => {
  const { openModal, modalStack } = useModal();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      aadhar: "",
      pan: "",
      mobile: "",
    },
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [isAadhaarVerfied, setIsAadharVerifed] = useState(false);
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const aadhar = watch("aadhar");
  const pan = watch("pan");
  const mobile = watch("mobile");

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maxLength: number,
    isPan?: boolean
  ) => {
    let value = e.target.value;
    if (isPan) {
      value = value.toUpperCase(); // Convert to uppercase for PAN
    } else {
      value = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    }
    e.target.value = value.slice(0, maxLength);
  };

  // Mutation functions for verifying Aadhar, Pan, and Mobile numbers
  const handleAadharVerify = () => {
    openModal("aadhaar-modal");
  };

  const handlePanVerify = () => {
    openModal("pan-modal");
  };

  const handleMobileVerify = () => {
    openModal("mobile-modal");
  };

  // Simulated OTP verification function
  const handleOtpVerification = (otp: string) => {
    setIsVerifying(true);
    console.log("Verifying OTP:", otp);
    // Simulate API call with a delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsAadharVerifed(true); // Change based on API response
    }, 2000);
  };

  const handleMobileOtpVerification = (otp: string) => {
    setIsVerifying(true);
    console.log("Verifying OTP:", otp);
    // Simulate API call with a delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsMobileVerified(true); // Change based on API response
    }, 2000);
  };

  const handlePenVerification = () => {
    setIsVerifying(true);

    // Simulate API call with a delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsPanVerified(true); // Change based on API response
    }, 2000);
  };


  


  return (
    <div className="relative bg-white">
      <header className="flex items-center justify-start gap-[25%] p-4 bg-main text-white">
        <ArrowLeft className="w-6 h-6" onClick={() => router.push("/")} />
        <div className="text-lg text-center font-semibold">New Customer</div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="pt-10 flex flex-col justify-between gap-10 min-h-[85vh]"
      >
        <div className="flex flex-col justify-center gap-10 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Aadhar Number
            </label>
            <div className="flex relative">
              <Controller
                name="aadhar"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    maxLength={12}
                    disabled={isAadhaarVerfied}
                    placeholder="Enter Aadhar Number"
                    className={`flex-1 pl-2 py-3 border rounded-lg ${
                      errors.aadhar ? "border-red-500" : ""
                    }`}
                    onInput={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        12
                      )
                    }
                  />
                )}
              />
              <button
                type="button"
                onClick={handleAadharVerify}
                disabled={
                  (schema.fields.aadhar instanceof Yup.Schema &&
                    !schema.fields.aadhar.isValidSync(aadhar)) ||
                  isAadhaarVerfied
                }
                className={`absolute py-[0.6rem] px-6 text-sm rounded-md top-[6px] right-1 ${
                  schema.fields.aadhar instanceof Yup.Schema &&
                  schema.fields.aadhar.isValidSync(aadhar)
                    ? "bg-main"
                    : isAadhaarVerfied
                    ? "bg-gray-400"
                    : "bg-gray-400"
                } text-white`}
              >
                {isAadhaarVerfied ? "Verified" : "Verify"}
              </button>
            </div>
            {errors.aadhar && (
              <p className="text-red-500 text-xs mt-1">
                {errors.aadhar.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pan Number
            </label>
            <div className="flex relative">
              <Controller
                name="pan"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    maxLength={10}
                    disabled={isPanVerified}
                    placeholder="Enter Pan Number"
                    className="flex-1 pl-2 py-3 border rounded-lg"
                    onInput={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        10,
                        true
                      )
                    }
                  />
                )}
              />
              <button
                type="button"
                onClick={handlePanVerify}
                disabled={
                  (schema.fields.pan instanceof Yup.Schema &&
                    !schema.fields.pan.isValidSync(pan)) ||
                  isPanVerified
                }
                className={`absolute py-[0.6rem] px-6 text-sm rounded-md top-[6px] right-1 ${
                  schema.fields.pan instanceof Yup.Schema &&
                  schema.fields.pan.isValidSync(pan)
                    ? "bg-main"
                    : isPanVerified
                    ? "bg-gray-400"
                    : "bg-gray-400"
                } text-white`}
              >
                {isPanVerified ? "Verified" : "Verify"}
              </button>
            </div>
            {errors.pan && (
              <p className="text-red-500 text-xs mt-1">{errors.pan.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="flex relative">
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    maxLength={10}
                    disabled={isMobileVerified}
                    placeholder="Enter Mobile Number"
                    className="flex-1 pl-2 py-3 border rounded-lg"
                    onInput={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        10
                      )
                    }
                  />
                )}
              />
              <button
                type="button"
                onClick={handleMobileVerify}
                disabled={
                  (schema.fields.mobile instanceof Yup.Schema &&
                    !schema.fields.mobile.isValidSync(mobile)) ||
                  isMobileVerified
                }
                className={`absolute py-[0.6rem] px-6 text-sm rounded-md top-[6px] right-1 ${
                  schema.fields.mobile instanceof Yup.Schema &&
                  schema.fields.mobile.isValidSync(mobile)
                    ? "bg-main"
                    : isMobileVerified
                    ? "bg-gray-400"
                    : "bg-gray-400"
                } text-white`}
              >
                {isMobileVerified ? "Verified" : "Verify"}
              </button>
            </div>
            {errors.mobile && (
            <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
          )}
          </div>
          <FileUploadComponent/>
        </div>



        



        <AadhaarModal
          isOpen={modalStack.includes("aadhaar-modal")}
          isLoading={isVerifying}
          onVerify={handleOtpVerification}
          isSuccess={isAadhaarVerfied}
        />
        <MobileModal
          isOpen={modalStack.includes("mobile-modal")}
          isLoading={isVerifying}
          onVerify={handleMobileOtpVerification}
          isSuccess={isMobileVerified}
        />
        <PanCardModal
          isOpen={modalStack.includes("pan-modal")}
          isLoading={isVerifying}
          onVerify={handlePenVerification}
          isSuccess={isPanVerified}
        />
        <div className="w-full border-t border-[#D1D9E3] p-4">
          <button
            type="submit"
            className="w-full self-end p-3 mt-6 text-white bg-green-600 rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
