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
    <div className={cn('!min-h-screen !w-64 !bg-white !shadow-xl', className)}>
      <div className="!flex !flex-col !space-y-4 !p-6">
        {/* 입찰 검색 메뉴 */}
        <div>
          <button
            className="!flex !w-full !cursor-pointer !items-center !justify-between !rounded-lg !bg-[#151663] !p-3 !text-lg !font-semibold !text-white !transition-colors"
            onClick={() => setSearchMenuOpen(!searchMenuOpen)}
          >
            <div className="!flex !items-center !gap-3">
              <Search className="!h-5 !w-5" />
              <span>입찰 검색</span>
            </div>
            <ChevronDown
              className={cn(
                '!h-5 !w-5 !transition-transform !duration-200',
                searchMenuOpen ? '!rotate-180' : ''
              )}
            />
          </button>

          {searchMenuOpen && (
            <div className="!mt-4 !flex !flex-col !space-y-2 !pl-6">
              <Link
                href="/bids"
                className={cn(
                  '!flex !items-center !gap-2 !rounded-md !px-4 !py-2 !text-base !font-medium !transition-colors',
                  pathname === '/bids' ? '!bg-[#151663] !text-white' : '!bg-white !text-[#666666]'
                )}
              >
                <List className="!h-5 !w-5" />
                <span>국내입찰</span>
              </Link>
              <Link
                href="/favorites"
                className={cn(
                  '!flex !items-center !gap-2 !rounded-md !px-4 !py-2 !text-base !font-medium !transition-colors',
                  pathname === '/favorites'
                    ? '!bg-[#151663] !text-white'
                    : '!bg-white !text-[#666666]'
                )}
              >
                <Bookmark className="!h-5 !w-5" />
                <span>관심공고</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
