import { TimeFilter as TimeFilterType } from '@/features/bidSearch/model/searchStore';

interface TimeFilterProps {
  timeFilter: TimeFilterType;
  setTimeFilter: (filter: TimeFilterType) => void;
}

export function TimeFilter({ timeFilter, setTimeFilter }: TimeFilterProps) {
  return (
    <div className="mb-4 flex items-center">
      <div className="flex gap-8">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="day"
            name="timeFilter"
            value="day"
            checked={timeFilter === 'day'}
            onChange={() => {
              setTimeFilter('day' as TimeFilterType);
            }}
            className="h-4 w-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
          />
          <label htmlFor="day" className="text-sm text-gray-700">
            하루 전
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="week"
            name="timeFilter"
            value="week"
            checked={timeFilter === 'week'}
            onChange={() => {
              setTimeFilter('week' as TimeFilterType);
            }}
            className="h-4 w-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
          />
          <label htmlFor="week" className="text-sm text-gray-700">
            일주일 전
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="month"
            name="timeFilter"
            value="month"
            checked={timeFilter === 'month'}
            onChange={() => {
              setTimeFilter('month' as TimeFilterType);
            }}
            className="h-4 w-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
          />
          <label htmlFor="month" className="text-sm text-gray-700">
            한 달 전
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="all"
            name="timeFilter"
            value="all"
            checked={timeFilter === 'all'}
            onChange={() => {
              setTimeFilter('all' as TimeFilterType);
            }}
            className="h-4 w-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
          />
          <label htmlFor="all" className="text-sm text-gray-700">
            전체 기간
          </label>
        </div>
      </div>
    </div>
  );
}
