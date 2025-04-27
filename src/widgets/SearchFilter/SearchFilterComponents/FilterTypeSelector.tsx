import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';

interface FilterTypeSelectorProps {
  filterType: 'shared' | 'personal';
  onFilterTypeChange: (type: 'shared' | 'personal') => void;
}

export function FilterTypeSelector({ filterType, onFilterTypeChange }: FilterTypeSelectorProps) {
  return (
    <div className="!relative !flex !h-9 !w-[200px] !rounded-full !bg-gray-200 !p-1">
      {/* 활성화된 배경 효과 */}
      <div
        className={cn(
          '!absolute !top-1 !h-7 !w-[98px] !rounded-full !bg-[rgb(166,161,219)] !transition-all !duration-300 !ease-in-out',
          filterType === 'personal' ? '!left-[98px]' : '!left-1'
        )}
      />

      <Button
        variant="unstyled"
        size="none"
        className={cn(
          '!relative !z-10 !h-7 !w-[98px] !cursor-pointer !rounded-full !px-4 !py-1 !text-xs !font-bold !transition-colors !duration-200',
          filterType === 'shared' ? '!text-white' : '!text-gray-600 hover:!text-gray-800'
        )}
        onClick={() => onFilterTypeChange('shared')}
      >
        공유
      </Button>
      <Button
        variant="unstyled"
        size="none"
        className={cn(
          '!relative !z-10 !h-7 !w-[98px] !cursor-pointer !rounded-full !px-4 !py-1 !text-xs !font-bold !transition-colors !duration-200',
          filterType === 'personal' ? '!text-white' : '!text-gray-600 hover:!text-gray-800'
        )}
        onClick={() => onFilterTypeChange('personal')}
      >
        개인
      </Button>
    </div>
  );
}
