'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

import { DUMMY_BID_DATA } from '@/features/bidSearch/model/data';
import { BidItem } from '@/features/bidSearch/model/types';
import { BidList, Pagination } from '@/features/bidSearch/ui';
import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export function FavoriteBidsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteBids, setFavoriteBids] = useState<BidItem[]>([]);

  const { getFavorites } = useFavoriteStore();

  // 즐겨찾기 목록 가져오기
  useEffect(() => {
    const favoriteIds = getFavorites();
    const favoriteItems = DUMMY_BID_DATA.filter(bid => favoriteIds.includes(bid.id));
    setFavoriteBids(favoriteItems);
  }, [getFavorites]);

  // 검색 필터링
  const filteredBids = favoriteBids.filter(
    bid =>
      bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 페이지네이션
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBids.length / itemsPerPage);
  const currentItems = filteredBids.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">관심 공고</h1>
        <p className="text-gray-600">저장한 관심 입찰 공고 목록을 확인하세요</p>
      </div>

      {/* 검색 */}
      <div className="mb-6 flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">관심 공고 목록</h2>
          <div className="text-sm text-gray-500">총 {filteredBids.length}개의 공고</div>
        </div>

        {filteredBids.length > 0 ? (
          <>
            <BidList bids={currentItems} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <div className="mb-2">관심 공고가 없습니다.</div>
            <div className="text-sm">
              입찰 검색에서 관심 있는 공고를 찾아 별표 아이콘을 클릭하여 추가하세요.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
