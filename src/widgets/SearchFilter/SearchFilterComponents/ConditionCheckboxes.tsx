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
    <div className="!mb-6 !rounded-lg !bg-white !p-4 !shadow-sm">
      <span className="!min-w-[80px] !text-left !text-sm !font-semibold !text-gray-700">조건</span>
      <div className="!mt-4 !flex !flex-wrap !gap-x-8 !gap-y-4">
        <div className="!flex !items-center">
          <Checkbox
            id="businessType"
            checked={conditions.businessType}
            onCheckedChange={() => handleCheckboxChange('businessType')}
            className="!h-5 !w-5 !rounded !border-2 !border-gray-400 !bg-white !text-[rgb(166,161,219)] !transition-all !duration-200 focus:!ring-1 focus:!ring-[rgb(166,161,219)]"
          />
          <label htmlFor="businessType" className="!ml-2 !text-sm !text-gray-700">
            업종조건 충족
          </label>
        </div>
        <div className="!flex !items-center">
          <Checkbox
            id="product"
            checked={conditions.product}
            onCheckedChange={() => handleCheckboxChange('product')}
            className="!h-5 !w-5 !rounded !border-2 !border-gray-400 !bg-white !text-[rgb(166,161,219)] !transition-all !duration-200 focus:!ring-1 focus:!ring-[rgb(166,161,219)]"
          />
          <label htmlFor="product" className="!ml-2 !text-sm !text-gray-700">
            물품조건 충족
          </label>
        </div>
        <div className="!flex !items-center">
          <Checkbox
            id="jointSupply"
            checked={conditions.jointSupply}
            onCheckedChange={() => handleCheckboxChange('jointSupply')}
            className="!h-5 !w-5 !rounded !border-2 !border-gray-400 !bg-white !text-[rgb(166,161,219)] !transition-all !duration-200 focus:!ring-1 focus:!ring-[rgb(166,161,219)]"
          />
          <label htmlFor="jointSupply" className="!ml-2 !text-sm !text-gray-700">
            공동수급 허용
          </label>
        </div>
        <div className="!flex !items-center">
          <Checkbox
            id="noPerformance"
            checked={conditions.noPerformance}
            onCheckedChange={() => handleCheckboxChange('noPerformance')}
            className="!h-5 !w-5 !rounded !border-2 !border-gray-400 !bg-white !text-[rgb(166,161,219)] !transition-all !duration-200 focus:!ring-1 focus:!ring-[rgb(166,161,219)]"
          />
          <label htmlFor="noPerformance" className="!ml-2 !text-sm !text-gray-700">
            실적제한 없음
          </label>
        </div>
        <div className="!flex !items-center">
          <Checkbox
            id="noCertification"
            checked={conditions.noCertification}
            onCheckedChange={() => handleCheckboxChange('noCertification')}
            className="!h-5 !w-5 !rounded !border-2 !border-gray-400 !bg-white !text-[rgb(166,161,219)] !transition-all !duration-200 focus:!ring-1 focus:!ring-[rgb(166,161,219)]"
          />
          <label htmlFor="noCertification" className="!ml-2 !text-sm !text-gray-700">
            인증제한 없음
          </label>
        </div>
      </div>
    </div>
  );
}
