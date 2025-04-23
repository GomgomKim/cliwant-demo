'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const tagVariants = cva(
  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
  {
    variants: {
      variant: {
        default: 'bg-gray-50 text-gray-600 ring-gray-500/10',
        primary: 'bg-blue-50 text-blue-700 ring-blue-700/10',
        secondary: 'bg-purple-50 text-purple-700 ring-purple-700/10',
        success: 'bg-green-50 text-green-700 ring-green-600/20',
        warning: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        danger: 'bg-red-50 text-red-700 ring-red-600/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, onRemove, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(tagVariants({ variant }), className)} {...props}>
        {children}
        {onRemove && (
          <button
            type="button"
            className="ml-1 inline-flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
            onClick={onRemove}
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Remove</span>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

export { Tag, tagVariants };
