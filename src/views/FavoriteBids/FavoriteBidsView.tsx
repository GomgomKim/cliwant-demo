'use client';

import { Search, Trash2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import { DUMMY_BID_DATA } from '@/features/bidSearch/model/data';
import { BidItem } from '@/features/bidSearch/model/types';
import { Pagination } from '@/features/bidSearch/ui';
import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export function FavoriteBidsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteBids, setFavoriteBids] = useState<BidItem[]>([]);
  const [sortKey, setSortKey] = useState<'budget' | 'publishedDate' | 'deadline' | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // derive favorites and toggle from store
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
      <div className="overflow-x-auto rounded-lg bg-white p-6 shadow-sm">
        {sortedBids.length > 0 ? (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="h-8">
                <tr className="bg-[rgb(166,161,219)] text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">공고 단계</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">구분</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">공고명</th>
                  <th
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase"
                    onClick={() => handleSort('budget')}
                  >
                    금액{sortKey === 'budget' ? (sortAsc ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">공고기관</th>
                  <th
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase"
                    onClick={() => handleSort('publishedDate')}
                  >
                    게시일{sortKey === 'publishedDate' ? (sortAsc ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase"
                    onClick={() => handleSort('deadline')}
                  >
                    마감일{sortKey === 'deadline' ? (sortAsc ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.map(bid => (
                  <tr key={bid.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{bid.bidType}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{bid.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{bid.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{bid.budget}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{bid.organization}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{bid.publishedDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{bid.deadline}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <button onClick={() => toggleFavorite(bid.id)}>
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
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
