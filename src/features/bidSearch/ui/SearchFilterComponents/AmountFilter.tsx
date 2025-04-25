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
      <Input
        type="number"
        value={minAmount}
        onChange={e => setAmountRange(Number(e.target.value), maxAmount)}
        className="!w-32 !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm"
      />
      <span className="!text-gray-500">~</span>
      <Input
        type="number"
        value={maxAmount}
        onChange={e => setAmountRange(minAmount, Number(e.target.value))}
        className="!w-32 !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm"
      />
      <div className="!ml-auto !flex !items-center !gap-2">
        <Checkbox
          id="exclude-amount"
          checked={excludeAmount}
          onCheckedChange={() => toggleExcludeAmount()}
          className="!text-blue-600 focus:!ring-blue-600"
        />
        <label htmlFor="exclude-amount" className="!text-sm !text-gray-700">
          금액 제한 없음
        </label>
      </div>
    </div>
  );
}
