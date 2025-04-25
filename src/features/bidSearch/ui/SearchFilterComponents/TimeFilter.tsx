import { TimeFilter as TimeFilterType } from '@/features/bidSearch/model/searchStore';
import { cn } from '@/shared/lib/utils';

interface TimeFilterProps {
  timeFilter: TimeFilterType;
  setTimeFilter: (filter: TimeFilterType) => void;
}

export function TimeFilter({ timeFilter, setTimeFilter }: TimeFilterProps) {
  // 기간 옵션 배열
  const timeOptions = [
    { id: 'day', label: '하루 전' },
    { id: 'week', label: '일주일 전' },
    { id: 'month', label: '한 달 전' },
    { id: 'all', label: '전체 기간' },
  ];

  return (
    <div className="!mb-6 !rounded-lg !bg-white !p-4 !shadow-sm">
      <div className="!mb-2 !text-sm !font-semibold !text-gray-700">기간 필터</div>
      <div className="!grid !grid-cols-2 !gap-4 md:!grid-cols-4">
        {timeOptions.map(option => (
          <div
            key={option.id}
            className={cn(
              '!relative !flex !cursor-pointer !items-center !justify-center !rounded-full !border !px-4 !py-2 !transition-all',
              timeFilter === option.id
                ? '!border-[rgb(166,161,219)] !bg-[rgba(166,161,219,0.1)] !text-[rgb(166,161,219)]'
                : '!border-gray-200 !bg-white !text-gray-700 hover:!border-gray-300'
            )}
            onClick={() => setTimeFilter(option.id as TimeFilterType)}
          >
            <input
              type="radio"
              id={option.id}
              name="timeFilter"
              value={option.id}
              checked={timeFilter === option.id}
              onChange={() => {
                setTimeFilter(option.id as TimeFilterType);
              }}
              className="!absolute !opacity-0"
            />
            <label htmlFor={option.id} className="!cursor-pointer !text-sm !font-medium">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
