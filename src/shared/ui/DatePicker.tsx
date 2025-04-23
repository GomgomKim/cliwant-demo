'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Calendar } from '@/shared/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/Popover';

export interface DatePickerProps {
  date?: Date | null;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = '날짜 선택',
  className,
}: DatePickerProps) {
  // onSelect 핸들러 래핑
  const handleSelect = React.useCallback(
    (day: Date | undefined) => {
      onSelect?.(day);
    },
    [onSelect]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'yyyy-MM-dd') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date || undefined} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
