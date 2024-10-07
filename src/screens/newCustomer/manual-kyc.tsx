"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ArrowLeft, Upload, CheckCircle, XCircle, User, Briefcase, Home, Users, IndianRupee, Camera } from "lucide-react";
import Image from "next/image";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  occupation: yup.string().required("Occupation is required"),
  address: yup.string().required("Address is required"),
  fathersName: yup.string().required("Father's Name is required"),
  salary: yup.number().positive().required("Salary is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

type FileState = {
  file: File | null;
  error: string;
  uploaded: boolean;
};

export const ManualKYC = () => {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

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
      <main className="flex-1 pt-20">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between gap-8 p-4 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div            onClick={() => fileInputRef.current?.click()} className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
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
                  className="absolute bottom-0 right-10 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
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
              <p className="text-sm text-gray-600">Click the Profile icon  nto upload a profile picture</p>
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
      </main>
    </div>
  );
};