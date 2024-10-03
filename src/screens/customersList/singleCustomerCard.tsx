// SingleCustomerCard.tsx
import React from "react";
import { Phone } from "lucide-react"; // Lucide Phone icon

interface Customer {
  name: string;
  cases: number;
  pendingPayments: number;
  status: string;
}

interface SingleCustomerCardProps {
  customer: Customer;
  showKYCDetailButton?: boolean;
}

export const SingleCustomerCard: React.FC<SingleCustomerCardProps> = ({
  customer,
  showKYCDetailButton,
}) => {
  return (
    <div className="border border-[#D9D9D9] rounded-lg p-4  bg-white mb-4">
      <div className="flex justify-between items-center">
        {/* Rating dots */}
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < (customer.name === "Ram Kumar" ? 3 : 4)
                  ? "bg-green-400"
                  : "bg-green-200"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* Customer Name and Cases */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <h3 className="font-medium text-[13px] text-[#4B5563]">
            {customer.name}
          </h3>
          <p className="text-[15px] font-bold text-black">
            {customer.cases} Cases
          </p>
        </div>
        {/* Phone Icon (Lucide) */}
        <div>
          <Phone size={24} className="text-gray-400" />
        </div>
      </div>

      {/* Pending Payments and Status */}
      <div className="mt-2 flex justify-between items-center border-t pt-2">
        <div>
          <p className="text-xs text-gray-500">Pending Payments</p>
          <p
            className={`font-bold ${
              customer.pendingPayments > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {customer.pendingPayments}
          </p>
        </div>
        <div>
          <p
            className={`font-bold ${
              customer.status === "Active" ? "text-green-500" : "text-red-500"
            }`}
          >
            {customer.status}
          </p>
        </div>
      </div>

      {showKYCDetailButton && (
        <button className="mt-4 bg-white text-xs text-gray-900 border border-gray-900 p-2 px-4 rounded-lg shadow-sm">
          KYC Details
        </button>
      )}
    </div>
  );
};
