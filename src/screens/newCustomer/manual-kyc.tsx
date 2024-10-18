'use client';

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ArrowLeft, CheckCircle,  User, Briefcase, Home, Users, IndianRupee, Smartphone, Upload } from "lucide-react";
import Image from "next/image";
import { useModal } from "@/src/components/bottomSheet/useModal";
import { MobileModal } from "@/src/components/bottomSheet/mobileModal";

import { useMutation } from "@tanstack/react-query";
import { TFileUploadResponse } from "@/src/services/fileUpload/fileUpload.type";
import { FileUpload } from "@/src/services/fileUpload";
import { AddCustomer } from "@/src/services/customer";
import toast from "react-hot-toast";

const schema = yup.object({
  profile: yup.string().required("Profile picture is required"),
  full_name: yup.string().required("Full name is required"),
  gender: yup.string().oneOf(['Male', 'Female', 'Other'], "Please select a gender").required("Gender is required"),
  father_name: yup.string().required("Father's name is required"),
  occupation: yup.string().required("Occupation is required"),
  salary: yup.number().positive().required("Salary is required"),
  address: yup.string().required("Address is required"),
  phone: yup.string().matches(/^[6-9]\d{9}$/, "Phone number must be 10 digits").required("Phone number is required"),
  aadhaar_card: yup.string().required("Aadhaar card is required"),
  pan_card: yup.string().required("PAN card is required"),
  voterCard: yup.string()
}).required();

type FormData = yup.InferType<typeof schema>;

export const ManualKYC = () => {
  const { openModal, modalStack } = useModal();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const { control, handleSubmit, formState: { errors }, watch, setValue,reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const phone = watch("phone");

  const [fileStates, setFileStates] = useState({
    profile: { file: null, error: "", uploaded: false, url: "" },
    aadhaar_card: { file: null, error: "", uploaded: false, url: "" },
    pan_card: { file: null, error: "", uploaded: false, url: "" },
    voterCard: { file: null, error: "", uploaded: false, url: "" },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);





  const uploadFileMutation = useMutation({
    mutationFn: (data: { file: File; fieldName: keyof typeof fileStates }) => {
      return FileUpload(data.file);
    },
    onSuccess: (response: TFileUploadResponse, variables) => {
      if (response.data.url) {
        console.log("url", response.data.url);
        setFileStates(prev => ({
          ...prev,
          [variables.fieldName]: { ...prev[variables.fieldName], file: variables.file, error: "", uploaded: true, url: response.data.url }
        }));
        setValue(variables.fieldName, response.data.url);
      } else {
        throw new Error('File upload failed');
      }
    },
    onError: (error, variables) => {
      setFileStates(prev => ({
        ...prev,
        [variables.fieldName]: { ...prev[variables.fieldName], error: "File upload failed", uploaded: false }
      }));
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof fileStates) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFileMutation.mutate({ file, fieldName });
    }
  };



  const AddCustomerMutation = useMutation({
    mutationKey : ['addCustomer'],
    mutationFn: AddCustomer,
    onSuccess: () => {
      console.log('Customer added successfully!');
      toast.success('Customer added successfully!');
      router.push('/customers');
    },
    onError: (error) => {
      console.error('Failed to add customer:', error);
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
    
    AddCustomerMutation.mutate(data);
    // Handle form submission
  };

  const handleMobileOtpVerification = (otp: string) => {
    setIsVerifying(true);
    console.log("Verifying OTP:", otp);
    setTimeout(() => {
      setIsVerifying(false);
      setIsMobileVerified(true);
    }, 2000);
  };

  const handleMobileVerify = () => {
    openModal("mobile-modal");
  };

  const inputFields = [
    { name: "full_name", icon: User, type: "text", label: "Full Name" },
    { name: "father_name", icon: Users, type: "text", label: "Father's Name" },
    { name: "occupation", icon: Briefcase, type: "text", label: "Occupation" },
    { name: "salary", icon: IndianRupee, type: "number", label: "Salary" },
    { name: "address", icon: Home, type: "textarea", label: "Address" },
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
                {fileStates.profile.url ? (
                  <Image src={fileStates.profile.url} alt="Profile" layout="fill" objectFit="cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <Controller
                name="profile"
                control={control}
                render={({ field }) => (
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      handleFileChange(e, 'profile');
                      field.onChange(e.target.files?.[0]);
                    }}
                    className="hidden"
                  />
                )}
              />
              {errors.profile && <p className="text-sm text-red-600">{errors.profile.message}</p>}
              <p className="text-sm text-gray-600">Click the Profile icon to upload a profile picture</p>
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
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            {...field}
                            value={gender}
                            checked={field.value === gender}
                            className="hidden"
                          />
                          <div className={`p-1 rounded-full ${field.value === gender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            <img src={`/${gender.toLowerCase()}.svg`} className="h-6 w-6" alt={gender} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{gender}</span>
                        </label>
                      ))}
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
                  {field.label}
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
                          value={typeof value === 'string' || typeof value === 'number' ? value : ""}
                          placeholder={`Enter ${field.label}`}
                          rows={3}
                          className="w-full pl-2 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <input
                          id={field.name}
                          type={field.type}
                          onChange={onChange}
                          value={typeof value === 'string' || typeof value === 'number' ? value : ""}
                          placeholder={`Enter ${field.label}`}
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
                <Smartphone className="w-4 h-4 text-gray-400" /> Phone Number
              </label>
              <div className="flex relative">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      maxLength={10}
                      disabled={isMobileVerified}
                      placeholder="Enter Phone Number"
                      className={`flex-1 pl-2 py-3 border rounded-lg ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={handleMobileVerify}
                  disabled={!phone || phone.length !== 10 || isMobileVerified}
                  className={`absolute py-2 px-4 text-sm rounded-md top-[6px] right-1 ${
                    phone && phone.length === 10 && !isMobileVerified
                      ? "bg-blue-600 hover:bg-blue-700"
                      : isMobileVerified
                      ? "bg-green-500"
                      : "bg-gray-400"
                  } text-white transition-colors`}
                >
                  {isMobileVerified ? "Verified" : "Verify"}
                </button>
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Aadhaar Card Upload */}
            <div className="space-y-2">
              <label htmlFor="aadhaar_card" className="block text-sm font-medium text-gray-700">
                Aadhaar Card
              </label>
              <div className="relative">
                <Controller
                  name="aadhaar_card"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      id="aadhaar_card"
                      accept=".pdf"
                      onChange={(e) => {
                        handleFileChange(e, 'aadhaar_card');
                        field.onChange(e.target.files?.[0]);
                      }}
                      className="hidden"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('aadhaar_card')?.click()}
                  className={`w-full px-4 py-2 text-left text-sm font-normal border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    fileStates['aadhaar_card'].uploaded ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="flex items-center">
                    {fileStates['aadhaar_card'].uploaded ? (
                      <div className="w-full flex justify-center items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                        {/* {fileStates['aadhaar_card'].file} */}
                      </div>
                      
                    ) : (
                      <div className="flex ">
                        <Upload className="h-5 w-5 mr-2 text-gray-400" />
                        <p className="text-sm text-gray-400">Upload Aadhaar Card</p>
                      </div>

                    )}
                    {/* {fileStates['aadhaar_card'].file ? fileStates['aadhaar_card'].file.name : 'Choose file'} */}
                  </span>
                </button>
              </div>
            </div>

            {/* PAN Card Upload */}
            <div className="space-y-2">
              <label htmlFor="pan_card" className="block text-sm font-medium text-gray-700">
                PAN Card
              </label>
              <div className="relative">
                <Controller
                  name="pan_card"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      id="pan_card"
                      accept=".pdf"
                      onChange={(e) => {
                        handleFileChange(e, 'pan_card');
                        field.onChange(e.target.files?.[0]);
                      }}
                      className="hidden"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('pan_card')?.click()}
                  className={`w-full px-4 py-2 text-left text-sm font-normal border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    fileStates['pan_card'].uploaded ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="flex items-center">
                    {fileStates['pan_card'].uploaded ? (
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                      <Upload className="h-5 w-5 mr-2 text-gray-400" />
                    )}
                    {/* {fileStates['pan_card'].file ? fileStates['pan_card'].file.name : 'Choose file'} */}
                  </span>
                </button>
              </div>
            </div>

            {/* Voter Card Upload (Optional) */}
            <div className="space-y-2">
              <label htmlFor="voterCard" className="block text-sm font-medium text-gray-700">
                Voter Card (Optional)
              </label>
              <div className="relative">
                <Controller
                  name="voterCard"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      id="voterCard"
                      accept=".pdf"
                      onChange={(e) => {
                        handleFileChange(e, 'voterCard');
                        field.onChange(e.target.files?.[0]);
                      }}
                      className="hidden"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('voterCard')?.click()}
                  className={`w-full px-4 py-2 text-left text-sm font-normal border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    fileStates['voterCard'].uploaded ? 'border-green-500 text-green-700' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="flex items-center">
                    {fileStates['voterCard'].uploaded ? (
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                      <Upload className="h-5 w-5 mr-2 text-gray-400" />
                    )}
                    {/* {fileStates['voterCard'].file ? fileStates['voterCard'].file.name : 'Choose file'} */}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 left-0 right-0  border-t border-gray-200 p-4 bg-white">
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
}