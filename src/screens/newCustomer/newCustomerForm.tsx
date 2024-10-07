"use client";

import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, CheckCircle, Upload, XCircle, CreditCard, Smartphone, FileText, User } from "lucide-react";
import { AadhaarModal } from "../../components/bottomSheet/aadhaar-modal";
import { useModal } from "@/src/components/bottomSheet/useModal";
import { MobileModal } from "@/src/components/bottomSheet/mobileModal";
import { PanCardModal } from "@/src/components/bottomSheet/panCardModal";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

type FormValues = Yup.InferType<typeof schema>;

type FileState = {
  file: File | null;
  error: string;
  uploaded: boolean;
};

export const NewCustomerForm: React.FC = () => {
  const { openModal, modalStack } = useModal();
  const router = useRouter();

  const [fileStates, setFileStates] = useState<Record<string, FileState>>({
    aadharFile: { file: null, error: "", uploaded: false },
    panFile: { file: null, error: "", uploaded: false },
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const aadhar = watch("aadhar");
  const pan = watch("pan");
  const mobile = watch("mobile");

  const onSubmit = (data: FormValues) => {
    const isAadharValid = validateFile(fileStates.aadharFile.file!, "aadharFile");
    const isPanValid = validateFile(fileStates.panFile.file!, "panFile");

    if (isAadharValid && isPanValid && profileImage) {
      console.log(data);
      console.log(fileStates);
      console.log("aadhar:", aadhar);
      console.log("pan:", pan); 
      console.log("mobile:", mobile);
      console.log("Profile Image:", profileImage);
      // Handle form submission
    } else {
      if (!profileImage) {
        setProfileImageError("Profile image is required");
      }
    }
  };

  const validateFile = (file: File | undefined, fieldName: string) => {
    if (!file) {
      setFileStates(prev => ({ ...prev, [fieldName]: { ...prev[fieldName], error: "This document is required", uploaded: false } }));
      return false;
    }
    
    const allowedExtensions = ["pdf"];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension || "")) {
      setFileStates(prev => ({ ...prev, [fieldName]: { ...prev[fieldName], error: "Only PDF files are allowed", uploaded: false } }));
      return false;
    }
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setFileStates(prev => ({ ...prev, [fieldName]: { ...prev[fieldName], error: "File size should not exceed 2MB", uploaded: false } }));
      return false;
    }

    setFileStates(prev => ({ ...prev, [fieldName]: { file, error: "", uploaded: true } }));
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    validateFile(file, fieldName);
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (file.size > maxSize) {
        setProfileImageError("Image size should not exceed 5MB");
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setProfileImageError("Only JPEG, PNG, and GIF images are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setProfileImageError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maxLength: number,
    isPan?: boolean
  ) => {
    let value = e.target.value;
    if (isPan) {
      value = value.toUpperCase();
    } else {
      value = value.replace(/[^0-9]/g, "");
    }
    e.target.value = value.slice(0, maxLength);
  };

  const handleAadharVerify = () => {
    openModal("aadhaar-modal");
  };

  const handlePanVerify = () => {
    openModal("pan-modal");
  };

  const handleMobileVerify = () => {
    openModal("mobile-modal");
  };

  const handleOtpVerification = (otp: string) => {
    setIsVerifying(true);
    console.log("Verifying OTP:", otp);
    setTimeout(() => {
      setIsVerifying(false);
      setIsAadhaarVerified(true);
    }, 2000);
  };

  const handleMobileOtpVerification = (otp: string) => {
    setIsVerifying(true);
    console.log("Verifying OTP:", otp);
    setTimeout(() => {
      setIsVerifying(false);
      setIsMobileVerified(true);
    }, 2000);
  };

  const handlePanVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsPanVerified(true);
    }, 2000);
  };

  const renderVerificationGroup = (
    name: keyof FormValues,
    label: string,
    icon: React.ReactNode,
    isVerified: boolean,
    handleVerify: () => void,
    fileFieldName: string
  ) => (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-lg font-semibold">{label} Verification</h2>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} Number
        </label>
        <div className="flex relative">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                maxLength={name === "pan" ? 10 : 12}
                disabled={isVerified}
                placeholder={`Enter ${label} Number`}
                className={`flex-1 pl-2 py-3 border rounded-lg ${
                  errors[name] ? "border-red-500" : ""
                }`}
                onInput={(e) => handleInputChange(
                  e as React.ChangeEvent<HTMLInputElement>,
                  name === "pan" ? 10 : 12,
                  name === "pan"
                )}
              />
            )}
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={
              (schema.fields[name] instanceof Yup.StringSchema &&
                !schema.fields[name].isValidSync(watch(name))) ||
              isVerified
            }
            className={`absolute py-2 px-4 text-sm rounded-md top-[6px] right-1 ${
              schema.fields[name] instanceof Yup.StringSchema &&
              schema.fields[name].isValidSync(watch(name))
                ? "bg-blue-600 hover:bg-blue-700"
                : isVerified
                ? "bg-green-500"
                : "bg-gray-400"
            } text-white transition-colors`}
          >
            {isVerified ? "Verified" : "Verify"}
          </button>
        </div>
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor={fileFieldName} className="block text-sm font-medium text-gray-700">
          Upload {label} Document
        </label>
        <div className="relative">
          <input
            id={fileFieldName}
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, fileFieldName)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById(fileFieldName)?.click()}
            className={`w-full px-4 py-2 text-left text-sm font-normal border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fileStates[fileFieldName].uploaded ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-700'
            }`}
          >
            <span className="flex items-center">
              {fileStates[fileFieldName].uploaded ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              ) : (
                <Upload className="h-5 w-5 mr-2 text-gray-400" />
              )}
              {fileStates[fileFieldName].file ? fileStates[fileFieldName].file.name : 'Choose file'}
            </span>
          </button>
        </div>
        {fileStates[fileFieldName].error && (
          <div className="flex items-center text-sm text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            {fileStates[fileFieldName].error}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative bg-gray-100 min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-start gap-[25%] p-4 bg-main text-white">
        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => router.push("/customers")} />
        <div className="text-lg text-center font-semibold">New Customer</div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-6 pb-24 px-4 space-y-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg"        onClick={() => fileInputRef.current?.click()}>
            {profileImage ? (
              <Image src={profileImage} alt="Profile" layout="fill" objectFit="cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            {/* <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button> */}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="hidden"
          />
          <p className="text-sm text-gray-600">Click the Profile icon to upload a profile picture</p>
          {profileImageError && (
            <p className="text-red-500 text-xs">{profileImageError}</p>
          )}
        </div>

        {renderVerificationGroup("aadhar", "Aadhar", <CreditCard className="w-6 h-6 text-blue-500" />, isAadhaarVerified, handleAadharVerify, "aadharFile")}
        {renderVerificationGroup("pan", "PAN", <FileText className="w-6 h-6 text-blue-500" />, isPanVerified, handlePanVerify, "panFile")}

        <div className="space-y-4 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Mobile Verification</h2>
          </div>
          <div className="space-y-2">
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
                    className={`flex-1 pl-2 py-3 border rounded-lg ${
                      errors.mobile ? "border-red-500" : ""
                    }`}
                    onInput={(e) => handleInputChange(
                      e as React.ChangeEvent<HTMLInputElement>,
                      10
                    )}
                  />
                )}
              />
              <button
                type="button"
                onClick={handleMobileVerify}
                disabled={
                  (schema.fields.mobile instanceof Yup.StringSchema &&
                    !schema.fields.mobile.isValidSync(mobile)) ||
                  isMobileVerified
                }
                className={`absolute py-2 px-4 text-sm rounded-md top-[6px] right-1 ${
                  schema.fields.mobile instanceof Yup.StringSchema &&
                  schema.fields.mobile.isValidSync(mobile)
                    ? "bg-blue-600 hover:bg-blue-700"
                    : isMobileVerified
                    ? "bg-green-500"
                    : "bg-gray-400"
                } text-white transition-colors`}
              >
                {isMobileVerified ? "Verified" : "Verify"}
              </button>
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-white">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>

      <AadhaarModal
        isOpen={modalStack.includes("aadhaar-modal")}
        isLoading={isVerifying}
        onVerify={handleOtpVerification}
        isSuccess={isAadhaarVerified}
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
        onVerify={handlePanVerification}
        isSuccess={isPanVerified}
      />
    </div>
  );
};