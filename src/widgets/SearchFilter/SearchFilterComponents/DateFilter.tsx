import { TimeFilter as TimeFilterType } from '@/features/bid-search/model/searchStore';
import { cn } from '@/shared/lib/utils';
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
    <div className="!mb-6 !flex !items-center !gap-0">
      <div className="!w-[80px] !max-w-[120px] !min-w-[80px] !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
        공고일
      </div>
      <div className="!flex !flex-1 !items-center !gap-0">
        <Input
          type="date"
          value={startDate}
          onChange={e => {
            setStartDate(e.target.value);
            setTimeFilter('custom' as TimeFilterType);
          }}
          disabled={timeFilter !== 'custom'}
          className="!h-[30px] !w-[140px] !rounded !border !border-gray-200 !bg-white !px-2 !py-1 !text-sm disabled:!bg-gray-100"
        />
        <span className="!mx-1 !text-gray-500">~</span>
        <Input
          type="date"
          value={endDate}
          onChange={e => {
            setEndDate(e.target.value);
            setTimeFilter('custom' as TimeFilterType);
          }}
          disabled={timeFilter !== 'custom'}
          className="!h-[30px] !w-[140px] !rounded !border !border-gray-200 !bg-white !px-2 !py-1 !text-sm disabled:!bg-gray-100"
        />
        <div className="!ml-2 !flex !items-center !gap-2">
          <Checkbox
            id="exclude-amount"
            checked={includeExpired}
            onCheckedChange={() => toggleIncludeExpired()}
            className={cn(
              '!size-[13px] !rounded-sm !border !border-gray-500 !bg-white',
              includeExpired &&
                '!text-white [&]:!border-[hsl(var(--blue))] [&]:!bg-[hsl(var(--blue))]'
            )}
          />
          <span className="!text-[13px] !font-normal !text-gray-500">마감일 지난 공고 포함</span>
        </div>
      </div>
    </div>
  );
}
