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
    <div className="!mb-4 flex items-center gap-2">
      <span className="z-[4] order-1 m-0 h-[30px] max-w-[120px] min-w-[120px] self-center overflow-visible rounded-none text-[14px] leading-[1.4] font-[var(--font_default)] font-bold whitespace-pre-wrap text-[#939393] opacity-100">
        사업 금액
      </span>
      <Input
        type="number"
        value={minAmount}
        onChange={e => setAmountRange(Number(e.target.value), maxAmount)}
        className="w-36"
      />
      <span className="">~</span>
      <Input
        type="number"
        value={maxAmount}
        onChange={e => setAmountRange(minAmount, Number(e.target.value))}
        className="w-36"
      />
      <div className="ml-4 flex items-center">
        <Checkbox
          id="exclude-amount"
          checked={excludeAmount}
          onCheckedChange={() => toggleExcludeAmount()}
          className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
        />
        <label htmlFor="exclude-amount" className="!ml-2 !text-sm !text-gray-700">
          금액 제한 없음
        </label>
      </div>
    </div>
  );
}
