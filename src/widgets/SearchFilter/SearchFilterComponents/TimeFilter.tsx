import { TimeFilter as TimeFilterType } from '@/features/bid-search/model/searchStore';

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
      <div className="!ml-[80px] !flex !flex-wrap !items-center !gap-4">
        {timeOptions.map(option => (
          <label key={option.id} className="!flex !cursor-pointer !items-center !space-x-2">
            <input
              type="radio"
              name="timeFilter"
              value={option.id}
              checked={timeFilter === option.id}
              onChange={() => handleTimeFilterChange(option.id as TimeFilterType)}
              className="!checked:!bg-blue !h-4 !w-4 !appearance-none !rounded-full !border !border-[#888888] !bg-white checked:!border-[888888]"
            />
            <span className="!text-[14px] !font-normal !text-[#888888]">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
