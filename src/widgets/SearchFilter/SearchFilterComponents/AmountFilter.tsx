import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';

interface AmountFilterProps {
  minAmount: number;
  maxAmount: number;
  setAmountRange: (min: number, max: number) => void;
  excludeAmount: boolean;
  toggleExcludeAmount: () => void;
}

export function AmountFilter({
  minAmount,
  maxAmount,
  setAmountRange,
  excludeAmount,
  toggleExcludeAmount,
}: AmountFilterProps) {
  return (
    <div className="!mb-6 !flex !items-center !gap-4 !rounded-lg !bg-white !p-4 !shadow-sm">
      <span className="!min-w-[120px] !text-sm !font-semibold !text-gray-700">사업 금액</span>
      <div className="!flex !flex-1 !items-center">
        <div className="!flex !min-w-[280px] !items-center !gap-2">
          <Input
            type="number"
            value={minAmount}
            onChange={e => setAmountRange(Number(e.target.value), maxAmount)}
            className="!w-32 !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm"
          />
          {excludeAmount ? (
            <span className="!text-gray-500">이상</span>
          ) : (
            <>
              <span className="!text-gray-500">~</span>
              <Input
                type="number"
                value={maxAmount}
                onChange={e => setAmountRange(minAmount, Number(e.target.value))}
                className="!w-32 !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm"
              />
            </>
          )}
        </div>
        <div className="!flex !items-center !gap-2 !border-l !border-gray-200 !pl-4">
          <Checkbox
            id="exclude-amount"
            checked={excludeAmount}
            onCheckedChange={() => toggleExcludeAmount()}
            className="!h-5 !w-5 !rounded !border-2 !border-gray-400 !bg-white !text-blue-600 !transition-all !duration-200 focus:!ring-1 focus:!ring-blue-600"
          />
          <label htmlFor="exclude-amount" className="!text-sm !text-gray-700">
            최대 금액 제한 없음
          </label>
        </div>
      </div>
    </div>
  );
}
