import { cn } from '@/shared/lib/utils';
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
    <div className="!mb-3 !flex !items-center !gap-0">
      <div className="!w-[80px] !max-w-[120px] !min-w-[80px] !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
        사업 금액
      </div>
      <div className="!flex !flex-1 !items-center !gap-0">
        <div className="!flex !items-center !gap-1">
          <Input
            type="number"
            value={minAmount}
            onChange={e => setAmountRange(Number(e.target.value), maxAmount)}
            className="!h-[30px] !w-[140px] !rounded !border !border-gray-200 !bg-white !px-2 !py-1 !text-sm [&::-webkit-inner-spin-button]:!appearance-none [&::-webkit-outer-spin-button]:!appearance-none"
            placeholder="0"
          />
          <span className="!text-gray-500">~</span>
          <div className="!w-[140px]">
            {!excludeAmount && (
              <Input
                type="number"
                value={maxAmount}
                onChange={e => setAmountRange(minAmount, Number(e.target.value))}
                className="!h-[30px] !w-[140px] !rounded !border !border-gray-200 !bg-white !px-2 !py-1 !text-sm [&::-webkit-inner-spin-button]:!appearance-none [&::-webkit-outer-spin-button]:!appearance-none"
                placeholder="5000000"
              />
            )}
          </div>
        </div>
        <div className="!ml-2 !flex !items-center !gap-2">
          <Checkbox
            id="exclude-amount"
            checked={excludeAmount}
            onCheckedChange={() => toggleExcludeAmount()}
            className={cn(
              '!size-[13px] !rounded-sm !border !border-gray-500 !bg-white',
              excludeAmount &&
                '!text-white [&]:!border-[hsl(var(--blue))] [&]:!bg-[hsl(var(--blue))]'
            )}
          />
          <label htmlFor="exclude-amount" className="!text-[13px] !font-normal !text-gray-500">
            금액 제한 없음
          </label>
        </div>
      </div>
    </div>
  );
}
