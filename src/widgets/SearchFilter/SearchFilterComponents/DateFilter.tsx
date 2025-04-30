import { TimeFilter as TimeFilterType } from '@/features/bid-search/model/searchStore';
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
    <div className="!mb-6 !flex !items-center">
      <div className="!w-[120px] !max-w-[120px] !min-w-[120px] !flex-grow-1 !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
        공고일
      </div>

      <div className="!flex !items-center">
        <Input
          type="date"
          value={startDate}
          onChange={e => {
            setStartDate(e.target.value);
            setTimeFilter('custom' as TimeFilterType);
          }}
          disabled={timeFilter !== 'custom'}
          className="!w-[140px] !rounded !border !border-gray-200 !bg-white !px-3 !py-1 !text-sm disabled:!bg-gray-100"
        />
        <span className="!mx-2 !text-gray-500">~</span>
        <Input
          type="date"
          value={endDate}
          onChange={e => {
            setEndDate(e.target.value);
            setTimeFilter('custom' as TimeFilterType);
          }}
          disabled={timeFilter !== 'custom'}
          className="!w-[140px] !rounded !border !border-gray-200 !bg-white !px-3 !py-1 !text-sm disabled:!bg-gray-100"
        />
      </div>

      <div className="!ml-3">
        <label className="!flex !cursor-pointer !items-center">
          <Checkbox
            checked={includeExpired}
            onCheckedChange={() => toggleIncludeExpired()}
            className="!h-4 !w-4 !rounded !border !border-gray-300 !bg-white"
          />
          <span className="!ml-1 !text-sm !text-gray-700">마감일 지난 공고 포함</span>
        </label>
      </div>
    </div>
  );
}
