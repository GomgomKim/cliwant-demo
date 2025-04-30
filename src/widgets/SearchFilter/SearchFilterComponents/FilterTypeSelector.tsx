import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';

interface FilterTypeSelectorProps {
  filterType: 'shared' | 'personal';
  onFilterTypeChange: (type: 'shared' | 'personal') => void;
}

export function FilterTypeSelector({ filterType, onFilterTypeChange }: FilterTypeSelectorProps) {
  return (
    <div className="!flex !h-8 !rounded-full !bg-gray-200 !p-1">
      <div
        className={`!flex !h-6 !w-24 !cursor-pointer !items-center !justify-center !rounded-full !text-xs !font-bold ${
          filterType === 'shared' ? '!bg-[#A6A1DB] !text-white' : '!bg-transparent !text-gray-600'
        }`}
        onClick={() => onFilterTypeChange('shared')}
      >
        공유
      </div>
      <div
        className={`!flex !h-6 !w-24 !cursor-pointer !items-center !justify-center !rounded-full !text-xs !font-bold ${
          filterType === 'personal' ? '!bg-[#A6A1DB] !text-white' : '!bg-transparent !text-gray-600'
        }`}
        onClick={() => onFilterTypeChange('personal')}
      >
        개인
      </div>
    </div>
  );
}
