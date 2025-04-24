import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';

interface FilterTypeSelectorProps {
  filterType: 'shared' | 'personal';
  onFilterTypeChange: (type: 'shared' | 'personal') => void;
}

export function FilterTypeSelector({ filterType, onFilterTypeChange }: FilterTypeSelectorProps) {
  return (
    <div className="flex">
      <Button
        variant="unstyled"
        size="none"
        className={cn(
          '!h-[30px] !cursor-pointer !rounded-full !px-[10px] !text-xs !font-bold',
          filterType === 'shared'
            ? '!z-[4] !bg-[rgb(166,161,219)] !text-white'
            : '!z-[3] !bg-[rgb(234,234,234)] !text-[rgb(102,102,102)]'
        )}
        onClick={() => onFilterTypeChange('shared')}
      >
        공유
      </Button>
      <Button
        variant="unstyled"
        size="none"
        className={cn(
          '!ml-2 !h-[30px] !cursor-pointer !rounded-full !px-[10px] !text-xs !font-bold',
          filterType === 'personal'
            ? '!z-[4] !bg-[rgb(166,161,219)] !text-white'
            : '!z-[3] !bg-[rgb(234,234,234)] !text-[rgb(102,102,102)]'
        )}
        onClick={() => onFilterTypeChange('personal')}
      >
        개인
      </Button>
    </div>
  );
}
