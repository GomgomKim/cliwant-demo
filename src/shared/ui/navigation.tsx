'use client';

import { Bell, Heart, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib/utils';

const navItems = [
  {
    name: '홈',
    href: '/',
    icon: Home,
  },
  {
    name: '입찰 검색',
    href: '/bids',
    icon: Search,
  },
  {
    name: '관심 공고',
    href: '/favorites',
    icon: Heart,
  },
  {
    name: '알림',
    href: '/notifications',
    icon: Bell,
  },
];

export function Navigation() {
  const pathname = usePathname() || '';

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 py-4">
            <span className="font-bold text-xl text-indigo-600">BidWant</span>
          </Link>

          <div className="flex">
            {navItems.map(item => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-4 py-4 text-sm font-medium border-b-2 transition-colors',
                    isActive
                      ? 'text-indigo-600 border-indigo-600'
                      : 'text-gray-500 border-transparent hover:text-indigo-600 hover:border-indigo-300'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              로그인
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
