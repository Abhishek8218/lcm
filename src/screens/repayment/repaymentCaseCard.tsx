import React from "react";

export interface Case {
  caseID?: string;

  customer?: string;
  tenure: number;
  amount: number;
  paymentHealth: string;
  frequency: string;
  status: string;

}

interface SingleCaseCardProps {
  caseInfo: Case;
  caseId?: boolean;
}

export const RepaymentCaseCard: React.FC<SingleCaseCardProps> = ({ caseInfo,caseId }) => {
  return (
    <div className="border border-[#D9D9D9] rounded-lg p-4 bg-white mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-[13px] text-[#4B5563]">
          {caseInfo.caseID && caseId ? "Case ID" : "Customer Name "}
          </h3>
          <p className="text-[15px] font-semibold text-black">
            {caseInfo.caseID && caseId ? caseInfo.caseID  : caseInfo.customer}
          </p>
        </div>
        <div>
          <h3 className="font-medium text-[13px] text-[#4B5563] text-right">
            Case Amount
          </h3>
          <p className="text-[15px] font-semibold text-black text-right">
            Rs.{caseInfo.amount}
          </p>
        </div>
      </div>

      <div className="border-t mt-2 py-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-[12px] text-[#4B5563]">Tenure</h3>
            <p className="text-[13px] font-semibold text-black">
              {caseInfo.tenure}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[12px] text-[#4B5563] text-right">
              Frequency
            </h3>
            <p className="text-[13px] text-right font-semibold text-black">
              {caseInfo.frequency}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-[12px] text-[#4B5563]">
              Payment Health
            </h3>
            <p
              className={`text-[13px] font-semibold  ${
                caseInfo.paymentHealth === "Not Good"
                  ? "text-[#D43E3E]"
                  : caseInfo.paymentHealth === "Good"
                  ? "text-[#22C55E]"
                  : "text-[#008B27]"
              }`}
            >
              {caseInfo.paymentHealth}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[12px] text-[#4B5563] text-right">
              Status
            </h3>
            <p
              className={`text-[13px] font-semibold  text-right ${
                caseInfo.status === "Active"
                  ? "text-[#008B27]"
                  : "text-[#1310A5]"
              }`}
            >
              {caseInfo.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
