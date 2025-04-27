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

  // Remove automatic toggling, only handle setTimeFilter
  const handleTimeFilterChange = (optionId: TimeFilterType) => {
    setTimeFilter(optionId);
  };

  return (
    <div className="!mb-6 !rounded-lg !bg-white !p-4 !shadow-sm">
      <div className="!mb-2 !text-sm !font-semibold !text-gray-700">기간 필터</div>
      <div className="!flex !flex-wrap !items-center !gap-2">
        {timeOptions.map(option => (
          <div
            key={option.id}
            className={cn(
              '!relative !flex !min-w-[80px] !cursor-pointer !items-center !justify-center !rounded-full !border !px-3 !py-1 !text-center !transition-all',
              timeFilter === option.id
                ? '!border-[rgb(166,161,219)] !bg-[rgba(166,161,219,0.1)] !text-[rgb(166,161,219)]'
                : '!border-gray-200 !bg-white !text-gray-700 hover:!border-gray-300'
            )}
            onClick={() => handleTimeFilterChange(option.id as TimeFilterType)}
          >
            <input
              type="radio"
              id={option.id}
              name="timeFilter"
              value={option.id}
              checked={timeFilter === option.id}
              onChange={() => handleTimeFilterChange(option.id as TimeFilterType)}
              className="!absolute !opacity-0"
            />
            <label htmlFor={option.id} className="!cursor-pointer !text-xs !font-medium">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
