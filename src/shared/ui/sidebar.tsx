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
    <div className={cn('min-h-screen w-64 bg-white shadow-xl', className)}>
      <div className="flex flex-col space-y-4 p-6">
        {/* 입찰 검색 메뉴 */}
        <div>
          <button
            className="flex w-full items-center justify-between rounded-lg bg-indigo-600 p-3 text-lg font-semibold text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            onClick={() => setSearchMenuOpen(!searchMenuOpen)}
          >
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5" />
              <span>입찰 검색</span>
            </div>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform duration-200',
                searchMenuOpen ? 'rotate-180' : ''
              )}
            />
          </button>

          {searchMenuOpen && (
            <div className="mt-4 flex flex-col space-y-2 pl-6">
              <Link
                href="/bids"
                className={cn(
                  'flex items-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors',
                  pathname === '/bids'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                )}
              >
                <List className="h-5 w-5" />
                <span>국내 입찰</span>
              </Link>
              <Link
                href="/favorites"
                className={cn(
                  'flex items-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors',
                  pathname === '/favorites'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                )}
              >
                <Bookmark className="h-5 w-5" />
                <span>관심 공고</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
