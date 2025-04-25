'use client';

import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { DUMMY_BID_DATA } from '@/features/bidSearch/model/data';
import { BidItem } from '@/features/bidSearch/model/types';
import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

import { FavoriteBidsTable } from './ui/FavoriteBidsTable';

export function FavoriteBidsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteBids, setFavoriteBids] = useState<BidItem[]>([]);
  const [sortKey, setSortKey] = useState<'budget' | 'publishedDate' | 'deadline' | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const favorites = useFavoriteStore(state => state.favorites);
  const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);

  // 즐겨찾기 목록 가져오기
  useEffect(() => {
    const favoriteItems = DUMMY_BID_DATA.filter(bid => favorites.includes(bid.id));
    setFavoriteBids(favoriteItems);
  }, [favorites]);

  // 검색 필터링
  const filteredBids = favoriteBids.filter(
    bid =>
      bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 정렬 처리
  const sortedBids = useMemo(() => {
    if (!sortKey) return filteredBids;
    const bids = [...filteredBids];
    bids.sort((a, b) => {
      const aVal = a[sortKey] || '';
      const bVal = b[sortKey] || '';
      // date or string compare
      const compare = aVal.localeCompare(bVal);
      return sortAsc ? compare : -compare;
    });
    return bids;
  }, [filteredBids, sortKey, sortAsc]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedBids.length / itemsPerPage);
  const currentItems = sortedBids.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: 'budget' | 'publishedDate' | 'deadline') => {
    if (sortKey === key) {
      setSortAsc(prev => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-6">
        <div className="flex-1">
          <h1 className="!mb-4 !inline-block !border-b-2 !border-[rgb(166,161,219)] !pb-2 !font-['Pretendard'] !text-xl !font-bold !text-[rgb(68,64,128)]">
            관심 공고
          </h1>
        </div>
      </div>

      {/* 검색 */}
      <div className="mb-6 flex max-w-md gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="관심 공고 검색..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>검색</Button>
      </div>

      {/* 관심 공고 목록 */}
      <FavoriteBidsTable
        bids={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        sortKey={sortKey}
        sortAsc={sortAsc}
        onSort={handleSort}
        onDelete={toggleFavorite}
      />
    </div>
  );
}
