'use client';

import { ChevronDown, Search, List, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/shared/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname() || '';
  const [searchMenuOpen, setSearchMenuOpen] = useState(true);

  return (
    <div className={cn('w-60 bg-white border-r border-gray-200 min-h-screen', className)}>
      <div className="flex flex-col py-2">
        {/* 입찰검색 메뉴 */}
        <div className="px-4 py-2">
          <button
            className="w-full flex items-center justify-between p-3 rounded-md bg-[#1c1e64] text-white"
            onClick={() => setSearchMenuOpen(!searchMenuOpen)}
          >
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              <span className="font-medium">입찰검색</span>
            </div>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform',
                searchMenuOpen ? 'transform rotate-180' : ''
              )}
            />
          </button>

          {searchMenuOpen && (
            <div className="border-l-2 border-gray-200 ml-7 pl-4 mt-2">
              <Link
                href="/bids"
                className={cn(
                  'flex items-center gap-2 py-3 my-1 w-full text-sm font-medium',
                  pathname === '/bids' ? 'text-[#1c1e64]' : 'text-gray-600 hover:text-[#1c1e64]'
                )}
              >
                <List className="h-5 w-5" />
                <span>국내입찰</span>
              </Link>
              <Link
                href="/favorites"
                className={cn(
                  'flex items-center gap-2 py-3 my-1 w-full text-sm font-medium',
                  pathname === '/favorites'
                    ? 'text-[#1c1e64]'
                    : 'text-gray-600 hover:text-[#1c1e64]'
                )}
              >
                <Bookmark className="h-5 w-5" />
                <span>관심공고</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
