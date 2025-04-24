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
    <div className="!mb-4 flex items-center gap-2">
      <span className="z-[4] order-1 m-0 h-[30px] max-w-[120px] min-w-[120px] self-center overflow-visible rounded-none text-[14px] leading-[1.4] font-[var(--font_default)] font-bold whitespace-pre-wrap text-[#939393] opacity-100">
        공고일
      </span>
      <Input
        type="date"
        value={startDate}
        onChange={e => {
          setStartDate(e.target.value);
          setTimeFilter('custom' as TimeFilterType); // Cast to TimeFilterType
        }}
        className="w-40 bg-gray-50"
      />
      <span className="">~</span>
      <Input
        type="date"
        value={endDate}
        onChange={e => {
          setEndDate(e.target.value);
          setTimeFilter('custom' as TimeFilterType); // Cast to TimeFilterType
        }}
        className="w-40 bg-gray-50"
      />
      <div className="ml-4 flex items-center">
        <Checkbox
          id="include-expired"
          checked={includeExpired}
          onCheckedChange={() => toggleIncludeExpired()}
          className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
        />
        <label htmlFor="include-expired" className="!ml-2 !text-sm !text-gray-700">
          마감일 지난 공고 포함
        </label>
      </div>
    </div>
  );
}
