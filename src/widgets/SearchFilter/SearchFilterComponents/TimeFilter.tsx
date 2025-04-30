import { TimeFilter as TimeFilterType } from '@/features/bid-search/model/searchStore';
import { cn } from '@/shared/lib/utils';

interface TimeFilterProps {
  timeFilter: TimeFilterType;
  setTimeFilter: (filter: TimeFilterType) => void;
  includeExpired: boolean;
  toggleIncludeExpired: () => void;
}

export function TimeFilter({
  timeFilter,
  setTimeFilter,
  includeExpired,
  toggleIncludeExpired,
}: TimeFilterProps) {
  // 기간 옵션 배열
  const timeOptions = [
    { id: 'day', label: '하루 전' },
    { id: 'week', label: '일주일 전' },
    { id: 'month', label: '한 달 전' },
    { id: 'year', label: '일년 전' },
    { id: 'all', label: '전체 조회' },
    { id: 'custom', label: '자유 입력' },
  ];

  // Handle time filter change
  const handleTimeFilterChange = (optionId: TimeFilterType) => {
    setTimeFilter(optionId);
  };

  return (
    <div className="!mb-6 !ml-[80px] !flex !items-start !gap-0">
      <div className="!items-center!pl-0 !flex !flex-1 !flex-wrap">
        {timeOptions.map(option => (
          <label key={option.id} className="!flex !cursor-pointer !items-center !space-x-2">
            <input
              type="radio"
              name="timeFilter"
              value={option.id}
              checked={timeFilter === option.id}
              onChange={() => handleTimeFilterChange(option.id as TimeFilterType)}
              className="!h-4 !w-4 !appearance-none !rounded-full !border !border-gray-300 !bg-white !bg-center !bg-no-repeat checked:!border-[hsl(217.4,89%,60.8%)] checked:!bg-white checked:!bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNCIgZmlsbD0iaHNsKDIxNy40LDg5JSw2MC44JSkiLz48L3N2Zz4=')]"
            />
            <span className="!w-[80px] !text-[14px] !font-normal !text-[#adadad]">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
