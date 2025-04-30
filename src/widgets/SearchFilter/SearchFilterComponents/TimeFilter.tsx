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
    <div className="!mb-6">
      <div className="!ml-[80px] !flex !flex-wrap !items-center">
        {timeOptions.map(option => (
          <div key={option.id} className="!mr-2">
            <label className="!flex !cursor-pointer !items-center">
              <input
                type="radio"
                name="timeFilter"
                value={option.id}
                checked={timeFilter === option.id}
                onChange={() => handleTimeFilterChange(option.id as TimeFilterType)}
                className="!absolute !opacity-0"
              />
              <span
                className={cn(
                  '!rounded-full !border !px-3 !py-1 !text-sm !font-medium',
                  timeFilter === option.id
                    ? '!border-[#686FE8] !bg-[rgba(104,111,232,0.1)] !text-[#686FE8]'
                    : '!border-gray-200 !bg-white !text-gray-700 hover:!border-gray-300'
                )}
              >
                {option.label}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
