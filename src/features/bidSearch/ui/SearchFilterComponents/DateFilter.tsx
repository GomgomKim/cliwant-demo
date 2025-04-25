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
}

export function DateFilter({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setTimeFilter,
  includeExpired,
  toggleIncludeExpired,
}: DateFilterProps) {
  return (
    <div className="!mb-6 !flex !items-center !gap-4 !rounded-lg !bg-white !p-4 !shadow-sm">
      <span className="!min-w-[120px] !text-sm !font-semibold !text-gray-700">공고일</span>
      <Input
        type="date"
        value={startDate}
        onChange={e => {
          setStartDate(e.target.value);
          setTimeFilter('custom' as TimeFilterType);
        }}
        className="!w-36 !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm"
      />
      <span className="!text-gray-500">~</span>
      <Input
        type="date"
        value={endDate}
        onChange={e => {
          setEndDate(e.target.value);
          setTimeFilter('custom' as TimeFilterType);
        }}
        className="!w-36 !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm"
      />
      <div className="!ml-auto !flex !items-center !gap-2">
        <Checkbox
          id="include-expired"
          checked={includeExpired}
          onCheckedChange={() => toggleIncludeExpired()}
          className="!text-blue-600 focus:!ring-blue-600"
        />
        <label htmlFor="include-expired" className="!text-sm !text-gray-700">
          마감일 지난 공고 포함
        </label>
      </div>
    </div>
  );
}
