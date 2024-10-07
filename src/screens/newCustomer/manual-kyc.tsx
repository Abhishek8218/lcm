"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ArrowLeft, Upload, CheckCircle, XCircle, User, Briefcase, Home, Users, IndianRupee, Smartphone, Users as Others } from "lucide-react";
import Image from "next/image";
import { useModal } from "@/src/components/bottomSheet/useModal";
import { MobileModal } from "@/src/components/bottomSheet/mobileModal";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  gender: yup.string().oneOf(['male', 'female', 'other'], "Please select a gender").required("Gender is required"),
  occupation: yup.string().required("Occupation is required"),
  address: yup.string().required("Address is required"),
  fathersName: yup.string().required("Father's Name is required"),
  salary: yup.number().positive().required("Salary is required"),
  mobile: yup.string()
    .matches(/^[6-9]\d{9}$/, "Mobile number must be 10 digits")
    .required(),
}).required();

type FormData = yup.InferType<typeof schema>;

type FileState = {
  file: File | null;
  error: string;
  uploaded: boolean;
};

export const ManualKYC = () => {
  const { openModal, modalStack } = useModal();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const mobile = watch("mobile");

  const [fileStates, setFileStates] = useState<Record<string, FileState>>({
    aadharFile: { file: null, error: "", uploaded: false },
    panFile: { file: null, error: "", uploaded: false },
    voterFile: { file: null, error: "", uploaded: false },
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    const isAadharValid = validateFile(fileStates.aadharFile.file!, "aadharFile");
    const isPanValid = validateFile(fileStates.panFile.file!, "panFile");
    const isVoterValid = validateFile(fileStates.voterFile.file!, "voterFile");

    if (isAadharValid && isPanValid && isVoterValid) {
      console.log(data);
      console.log(fileStates);
      console.log("Profile Image:", profileImage);
      // Handle form submission
    }
  };

  const handleMobileOtpVerification = (otp: string) => {
    setIsVerifying(true);
    console.log("Verifying OTP:", otp);
    setTimeout(() => {
      setIsVerifying(false);
      setIsMobileVerified(true);
    }, 2000);
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

  const handleMobileVerify = () => {
    openModal("mobile-modal");
  };

  const inputFields = [
    { name: "name", icon: User, type: "text" },
    { name: "fathersName", icon: Users, type: "text" },
    { name: "occupation", icon: Briefcase, type: "text" },
    { name: "salary", icon: IndianRupee, type: "number" },
    { name: "address", icon: Home, type: "textarea" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="fixed w-full flex items-center justify-start gap-[25%] p-4 bg-main text-white z-10">
        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => { router.push("/customers") }} />
        <div className="text-lg text-center font-semibold">Manual KYC</div>
      </header>
      <main className="flex-1 pt-14">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between gap-8 p-4 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div onClick={() => fileInputRef.current?.click()} className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg cursor-pointer">
                {profileImage ? (
                  <Image src={profileImage} alt="Profile" layout="fill" objectFit="cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
              <p className="text-sm text-gray-600">Click the Profile icon to upload a profile picture</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center gap-1 text-sm font-medium text-gray-700 capitalize">
                <User className="h-4 w-4 text-gray-400" />
                Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    className="w-full pl-2 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4 text-gray-400" />
                Gender
              </label>
              <div className="flex space-x-4">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          {...field}
                          value="male"
                          className="hidden"
                        />
                        <div className={`p-1 rounded-full ${field.value === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          {/* <Male className="w-6 h-6" /> */}
                          <img  src="/male.svg" className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Male</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          {...field}
                          value="female"
                          className="hidden"
                        />
                        <div className={`p-1 rounded-full ${field.value === 'female' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          {/* <Female className="w-6 h-6" /> */}
                          <img src="/female.svg" className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Female</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          {...field}
                          value="other"
                          className="hidden"
                        />
                        <div className={`p-2 rounded-full ${field.value === 'other' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          <Others className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Other</span>
                      </label>
                    </>
                  )}
                />
              </div>
              {errors.gender && (
                <p className="text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            {inputFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="flex items-center gap-1 text-sm font-medium text-gray-700 capitalize">
                  <field.icon className="h-4 w-4 text-gray-400" />
                  {field.name === "fathersName" ? "Father's Name" : field.name}
                </label>
                <div className="relative">
                  <Controller
                    name={field.name as keyof FormData}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      field.type === "textarea" ? (
                        <textarea
                          id={field.name}
                          onChange={onChange}
                          value={value || ""}
                          placeholder={`Enter ${field.name === "fathersName" ? "Father's Name" : field.name}`}
                          rows={3}
                          className="w-full pl-2 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <input
                          id={field.name}
                          type={field.type}
                          onChange={onChange}
                          value={value || ""}
                          placeholder={`Enter ${field.name === "fathersName" ? "Father's Name" : field.name}`}
                          className="w-full pl-2 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )
                    )}
                  />
                </div>
                {errors[field.name as keyof FormData] && (
                  <p className="text-sm text-red-600">{errors[field.name as keyof FormData]?.message}</p>
                )}
              </div>
            ))}

            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 capitalize">
                <Smartphone className="w-4 h-4 text-gray-400" /> Mobile Number
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
                    (schema.fields.mobile instanceof yup.StringSchema &&
                      !schema.fields.mobile.isValidSync(mobile)) ||
                    isMobileVerified
                  }
                  className={`absolute py-2 px-4 text-sm rounded-md top-[6px] right-1 ${
                    schema.fields.mobile instanceof yup.StringSchema &&
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

            {Object.entries(fileStates).map(([fieldName, state]) => (
              <div key={fieldName} className="space-y-2">
                <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
                  {fieldName.replace('File', '').charAt(0).toUpperCase() + fieldName.replace('File', '').slice(1)} Card
                </label>
                <div className="relative">
                  <input
                    id={fieldName}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, fieldName)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById(fieldName)?.click()}
                    className={`w-full px-4 py-2 text-left text-sm font-normal border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      state.uploaded ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      {state.uploaded ? (
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      ) : (
                        <Upload className="h-5 w-5 mr-2 text-gray-400" />
                      )}
                      {state.file ? state.file.name : 'Choose file'}
                    </span>
                  </button>
                </div>
                {state.error && (
                  <div className="flex items-center text-sm text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    {state.error}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-white">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-colors"
            >
              Submit KYC
            </button>
          </div>
        </form>
        <MobileModal
          isOpen={modalStack.includes("mobile-modal")}
          isLoading={isVerifying}
          onVerify={handleMobileOtpVerification}
          isSuccess={isMobileVerified}
        />
      </main>
    </div>
  );
};