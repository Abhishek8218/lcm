"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerModal } from "@/src/components/bottomSheet/customerSheet";
import { useModal } from "@/src/components/bottomSheet/useModal";
import { useState } from "react";

const schema = yup.object({
  customer: yup.string().required("Customer is required"),
  loanAmount: yup.number().positive().required("Loan Amount is required"),
  loanTenure: yup.string().required("Loan Tenure is required"),
  paymentCycle: yup.string().required("Payment Cycle is required"), // Payment Cycle validation
  finalAmount: yup.number().positive().required("Final Amount is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

export const NewCase = () => {
  const router = useRouter();
  const { openModal, modalStack } = useModal();
  const [customer, setCustomer] = useState<string>("");
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      finalAmount: 0,
    },
  });

  const loanAmount = watch("loanAmount");
  const loanTenure = watch("loanTenure");

  const calculateFinalAmount = (amount: number, tenure: string) => {
    const rate = 0.1; // 10% interest rate
    const years = parseInt(tenure) || 0;
    return amount * (1 + rate * years);
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission
  };

  const handleCustomerSelect = (value: string) => {
    setCustomer(value);
    setValue("customer", value);
  };

  return (
    <div className="flex flex-col bg-slate-50">
      <header className="flex items-center justify-start gap-[25%] p-4 bg-main text-white">
        <ArrowLeft className="w-6 h-6" onClick={() => { router.push("/") }} />
        <div className="text-lg text-center font-semibold">New Case</div>
      </header>
      <main className="flex-1">
        <form onSubmit={handleSubmit(onSubmit)} className="pt-10 flex flex-col justify-between gap-10 min-h-[85vh]">
          <div className="flex flex-col p-4 gap-10">
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <div className="relative flex" onClick={() => openModal('customer-modal')}>
                <Controller
                  name="customer"
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
              {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer.message}</p>}
            </div>

            <div>
              <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
              <div className="flex">
                <Controller
                  name="loanAmount"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(e);
                        const newAmount = parseFloat(e.target.value);
                        setValue("finalAmount", calculateFinalAmount(newAmount, loanTenure));
                      }}
                      placeholder="0"
                      className="flex-1 pl-2 py-3 border rounded-lg"
                    />
                  )}
                />
              </div>
              {errors.loanAmount && <p className="mt-1 text-sm text-red-600">{errors.loanAmount.message}</p>}
            </div>

            <div>
              <label htmlFor="loanTenure" className="block text-sm font-medium text-gray-700 mb-2">Loan Tenure</label>
              <div className="relative flex">
                <Controller
                  name="loanTenure"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("finalAmount", calculateFinalAmount(loanAmount, e.target.value));
                      }}
                      className="flex-1 px-2 py-3 border rounded-lg"
                    >
                      <option value="">Select Loan Tenure</option>
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                    </select>
                  )}
                />
              </div>
              {errors.loanTenure && <p className="mt-1 text-sm text-red-600">{errors.loanTenure.message}</p>}
            </div>

            <div>
              <label htmlFor="paymentCycle" className="block text-sm font-medium text-gray-700 mb-2">Payment Cycle</label>
              <div className="relative flex">
                <Controller
                  name="paymentCycle"
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
              {errors.paymentCycle && <p className="mt-1 text-sm text-red-600">{errors.paymentCycle.message}</p>}
            </div>

            <div>
              <label htmlFor="finalAmount" className="block text-sm font-medium text-gray-700 mb-2">Final Amount</label>
              <div className="flex">
                <Controller
                  name="finalAmount"
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
              {errors.finalAmount && <p className="mt-1 text-sm text-red-600">{errors.finalAmount.message}</p>}
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
