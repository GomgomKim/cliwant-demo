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
    <div className="!mb-6 !flex !items-center !gap-4">
      <div className="!w-[120px] !max-w-[120px] !min-w-[120px] !flex-grow-1 !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
        사업 금액
      </div>
      <div className="!flex !flex-1 !items-center">
        <div className="!flex !items-center">
          <Input
            type="number"
            value={minAmount}
            onChange={e => setAmountRange(Number(e.target.value), maxAmount)}
            className="!w-[140px] !rounded !border !border-gray-200 !bg-white !px-3 !py-2 !text-sm"
            placeholder="0"
          />
          {excludeAmount ? (
            <span className="!mx-2 !text-gray-500">이상</span>
          ) : (
            <>
              <span className="!mx-2 !text-gray-500">~</span>
              <Input
                type="number"
                value={maxAmount}
                onChange={e => setAmountRange(minAmount, Number(e.target.value))}
                className="!w-[140px] !rounded !border !border-gray-200 !bg-white !px-3 !py-2 !text-sm"
                placeholder="5000000"
              />
            </>
          )}
        </div>
        <div className="!ml-2 !flex !items-center">
          <Checkbox
            id="exclude-amount"
            checked={excludeAmount}
            onCheckedChange={() => toggleExcludeAmount()}
            className="!h-4 !w-4 !rounded !border !border-gray-300 !bg-white"
          />
          <label htmlFor="exclude-amount" className="!ml-1 !text-sm !text-gray-700">
            금액 제한 없음
          </label>
        </div>
      </div>
    </div>
  );
}
