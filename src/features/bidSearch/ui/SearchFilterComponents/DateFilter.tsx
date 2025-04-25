import { TimeFilter as TimeFilterType } from '@/features/bidSearch/model/searchStore';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';

// Import TimeFilter type from the store to match the type in the parent component

interface DateFilterProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setTimeFilter: (filter: TimeFilterType) => void;
  includeExpired: boolean;
  toggleIncludeExpired: () => void;
  timeFilter: TimeFilterType;
}

export function DateFilter({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setTimeFilter,
  includeExpired,
  toggleIncludeExpired,
  timeFilter,
}: DateFilterProps) {
  return (
    <div className="!mb-6 !flex !items-center !gap-4 !rounded-lg !bg-white !p-4 !shadow-sm">
      <span className="!min-w-[120px] !text-sm !font-semibold !text-gray-700">공고일</span>

      <div className="!flex !items-center !gap-2">
        <Input
          type="date"
          value={startDate}
          onChange={e => {
            setStartDate(e.target.value);
            setTimeFilter('custom' as TimeFilterType);
          }}
          disabled={timeFilter !== 'custom'}
          className="!w-36 !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm !filter disabled:!cursor-not-allowed disabled:!bg-gray-100 [&::-webkit-calendar-picker-indicator]:!invert"
        />
        <span className="!text-gray-500">~</span>
        <Input
          type="date"
          value={endDate}
          onChange={e => {
            setEndDate(e.target.value);
            setTimeFilter('custom' as TimeFilterType);
          }}
          disabled={timeFilter !== 'custom'}
          className="!w-36 !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm !filter disabled:!cursor-not-allowed disabled:!bg-gray-100 [&::-webkit-calendar-picker-indicator]:!invert"
        />
      </div>

      <div className="!flex !items-center !gap-2 !pl-2">
        <Checkbox
          id="include-expired"
          checked={includeExpired}
          onCheckedChange={() => toggleIncludeExpired()}
          className="!h-5 !w-5 !rounded !border-2 !border-gray-400 !bg-white !text-blue-600 !transition-all !duration-200 focus:!ring-1 focus:!ring-blue-600"
        />
        <label htmlFor="include-expired" className="!text-sm !text-gray-700">
          마감일 지난 공고 포함
        </label>
      </div>

      <div className="!flex-1"></div>
    </div>
  );
}
