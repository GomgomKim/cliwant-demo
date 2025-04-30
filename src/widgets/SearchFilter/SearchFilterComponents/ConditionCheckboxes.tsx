import { useState } from 'react';

import { Checkbox } from '@/shared/ui/Checkbox';

export function ConditionCheckboxes() {
  const [conditions, setConditions] = useState({
    businessType: false,
    product: false,
    jointSupply: false,
    noPerformance: false,
    noCertification: false,
    noMaxAmount: false,
    includeExpired: false,
  });

  const handleCheckboxChange = (condition: keyof typeof conditions) => {
    setConditions(prev => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  return (
    <div className="!mb-6">
      <div className="!flex !items-center">
        <div className="!w-[60px] !max-w-[60px] !min-w-[60px] !flex-grow-1 !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
          조건
        </div>
        <div className="!ml-[20px] !flex !flex-wrap !items-center">
          <div className="!mr-1 !flex !items-center">
            <Checkbox
              id="industry-condition"
              className="!h-4 !w-4 !rounded !border !border-gray-300 !bg-white"
            />
            <label htmlFor="industry-condition" className="!ml-1 !text-sm !text-gray-700">
              업종조건 충족
            </label>
          </div>

          <div className="!mx-1 !flex !items-center">
            <Checkbox
              id="goods-condition"
              className="!h-4 !w-4 !rounded !border !border-gray-300 !bg-white"
            />
            <label htmlFor="goods-condition" className="!ml-1 !text-sm !text-gray-700">
              물품조건 충족
            </label>
          </div>

          <div className="!mx-1 !flex !items-center">
            <Checkbox
              id="joint-supply"
              className="!h-4 !w-4 !rounded !border !border-gray-300 !bg-white"
            />
            <label htmlFor="joint-supply" className="!ml-1 !text-sm !text-gray-700">
              공동수급 허용
            </label>
          </div>

          <div className="!mx-1 !flex !items-center">
            <Checkbox
              id="no-performance-limit"
              className="!h-4 !w-4 !rounded !border !border-gray-300 !bg-white"
            />
            <label htmlFor="no-performance-limit" className="!ml-1 !text-sm !text-gray-700">
              실적제한 없음
            </label>
          </div>

          <div className="!mx-1 !flex !items-center">
            <Checkbox
              id="no-human-limit"
              className="!h-4 !w-4 !rounded !border !border-gray-300 !bg-white"
            />
            <label htmlFor="no-human-limit" className="!ml-1 !text-sm !text-gray-700">
              인적제한 없음
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
