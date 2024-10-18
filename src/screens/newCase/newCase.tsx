"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerModal } from "@/src/components/bottomSheet/customerSheet";
import { useModal } from "@/src/components/bottomSheet/useModal";
import { useState } from "react";
import toast from "react-hot-toast";
import { newCase } from "@/src/services/case";
import { useMutation } from "@tanstack/react-query";

const schema = yup.object({
  customerId: yup.string().required("Customer is required"),
  loan_amount: yup.number().positive().required("Loan Amount is required"),
  loan_tenure: yup.number().required("Loan Tenure is required"),
  payment_cycle: yup.string().required("Payment Cycle is required"), // Payment Cycle validation
  emi_amount: yup.number().positive().required("Final Amount is required"),
  final_amount: yup.number().positive().required("Final Amount is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

export const NewCase = () => {
  const router = useRouter();
  const { openModal, modalStack } = useModal();
  const [customer, setCustomer] = useState<string>("");
  const { control, handleSubmit, watch, setValue, formState: { errors } ,reset} = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      final_amount: 0,
    },
  });

  const loan_amount = watch("loan_amount");
  const loan_tenure = watch("loan_tenure");

  const calculatefinal_amount = (amount: number, tenure: number) => {
    const rate = 0.1; // 10% interest rate
    const years = tenure || 0;
    return amount * (1 + rate * years);
  };


const newCaseMutation = useMutation({
    mutationKey: ['createCase'],
    mutationFn: newCase,
    onSuccess: () => {
        console.log('Case created successfully!');
        toast.success('Case created successfully!');
        // Redirect to dashboard or any other page
    }

});
  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
    newCaseMutation.mutate(data);
    // Handle form submission
  };

  const handleCustomerSelect = (value: string) => {
    setCustomer(value);
    setValue("customerId", value);
  };

  return (
    <div className="flex flex-col bg-slate-50">
      <header className="flex items-center justify-start gap-[25%] p-4 bg-main text-white">
        <ArrowLeft className="w-6 h-6" onClick={() => { router.push("/cases") }} />
        <div className="text-lg text-center font-semibold">New Case</div>
      </header>
      <main className="flex-1">
        <form onSubmit={handleSubmit(onSubmit)} className="pt-10 flex flex-col justify-between gap-10 min-h-[85vh]">
          <div className="flex flex-col p-4 gap-10">
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <div className="relative flex" onClick={() => openModal('customer-modal')}>
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      readOnly
                      value={customer}
                      placeholder="Select Customer"
                      className="flex-1 pl-2 py-3 border rounded-lg"
                    />
                  )}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>}
            </div>

            <div>
              <label htmlFor="loan_amount" className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
              <div className="flex">
                <Controller
                  name="loan_amount"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(e);
                        const newAmount = parseFloat(e.target.value);
                        setValue("final_amount", calculatefinal_amount(newAmount, loan_tenure));
                      }}
                      placeholder="0"
                      className="flex-1 pl-2 py-3 border rounded-lg"
                    />
                  )}
                />
              </div>
              {errors.loan_amount && <p className="mt-1 text-sm text-red-600">{errors.loan_amount.message}</p>}
            </div>

            <div>
              <label htmlFor="loan_tenure" className="block text-sm font-medium text-gray-700 mb-2">Loan Tenure</label>
              <div className="relative flex">
                <Controller
                  name="loan_tenure"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("final_amount", calculatefinal_amount(loan_amount, Number(e.target.value)));
                      }}
                      className="flex-1 px-2 py-3 border rounded-lg"
                    >
                      <option value={1}>Select Loan Tenure</option>
                      <option value={2}>1 Year</option>
                      <option value={3}>2 Years</option>
                      <option value={4}>3 Years</option>
                    </select>
                  )}
                />
              </div>
              {errors.loan_tenure && <p className="mt-1 text-sm text-red-600">{errors.loan_tenure.message}</p>}
            </div>
            <div>
              <label htmlFor="emi_amount" className="block text-sm font-medium text-gray-700 mb-2">EMI Amount</label>
              <div className="flex">
              <Controller
                  name="emi_amount"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        
                      }}
                      className="flex-1 px-2 py-3 border rounded-lg"
                    >
                      <option value="">Select Loan Tenure</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                      <option value="600">600</option>
                      <option value="700">700</option>
                      <option value="800">800</option>
                      <option value="900">900</option>
                      <option value="1000">1000</option>

                    </select>
                  )}
                />
              </div>
              {errors.emi_amount && <p className="mt-1 text-sm text-red-600">{errors.emi_amount.message}</p>}
            </div>

            <div>
              <label htmlFor="payment_cycle" className="block text-sm font-medium text-gray-700 mb-2">Payment Cycle</label>
              <div className="relative flex">
                <Controller
                  name="payment_cycle"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="flex-1 px-2 py-3 border rounded-lg"
                    >
                      <option value="">Select Payment Cycle</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  )}
                />
              </div>
              {errors.payment_cycle && <p className="mt-1 text-sm text-red-600">{errors.payment_cycle.message}</p>}
            </div>

            <div>
              <label htmlFor="final_amount" className="block text-sm font-medium text-gray-700 mb-2">Final Amount</label>
              <div className="flex">
                <Controller
                  name="final_amount"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      readOnly
                      placeholder="0"
                      className="flex-1 px-2 py-3 border rounded-lg"
                    />
                  )}
                />
              </div>
              {errors.final_amount && <p className="mt-1 text-sm text-red-600">{errors.final_amount.message}</p>}
            </div>
          </div>

          <CustomerModal isOpen={modalStack.includes('customer-modal')} onSelect={handleCustomerSelect} />
          
          <div className='w-full border-t border-[#D1D9E3] p-4 bg-white'>
            <button type="submit" className="w-full self-end p-3 mt-6 text-white bg-green-600 rounded-lg">
              Save
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
