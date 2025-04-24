import { Checkbox } from '@/shared/ui/Checkbox';

export function ConditionCheckboxes() {
  return (
    <div className="mb-6 flex items-start">
      <span className="z-[4] order-1 m-0 h-[30px] max-w-[120px] min-w-[120px] self-center overflow-visible rounded-none text-[14px] leading-[1.4] font-[var(--font_default)] font-bold whitespace-pre-wrap text-[#939393] opacity-100">
        조건
      </span>
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        <div className="flex items-center">
          <Checkbox
            id="condition1"
            className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
          />
          <label htmlFor="condition1" className="!ml-2 !text-sm !text-gray-700">
            업종조건 충족
          </label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="condition2"
            className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
          />
          <label htmlFor="condition2" className="!ml-2 !text-sm !text-gray-700">
            물품조건 충족
          </label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="condition3"
            className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
          />
          <label htmlFor="condition3" className="!ml-2 !text-sm !text-gray-700">
            공동수급 허용
          </label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="condition4"
            className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
          />
          <label htmlFor="condition4" className="!ml-2 !text-sm !text-gray-700">
            실적제한 없음
          </label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="condition5"
            className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
          />
          <label htmlFor="condition5" className="!ml-2 !text-sm !text-gray-700">
            인증제한 없음
          </label>
        </div>
      </div>
    </div>
  );
}
