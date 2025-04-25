'use client';

import { useEffect, useMemo, useState } from 'react';

import { DUMMY_BID_DATA } from '@/features/bid-search/model/data';
import { BidItem } from '@/features/bid-search/model/types';
import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/shared/ui/Select';

import { BID_TYPE_OPTIONS, BUDGET_OPTIONS, STATUS_OPTIONS } from './model/constants';
import { FavoriteBidsTable } from './ui/FavoriteBidsTable';

export function FavoriteBidsView() {
  const [showMemo, setShowMemo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteBids, setFavoriteBids] = useState<BidItem[]>([]);
  const [sortKey, setSortKey] = useState<'budget' | 'publishedDate' | 'deadline' | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterBidType, setFilterBidType] = useState<string>('');
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [filterOrg, setFilterOrg] = useState<string>('');
  const [filterBudget, setFilterBudget] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const favorites = useFavoriteStore(state => state.favorites);
  const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);

  // 즐겨찾기 목록 가져오기
  useEffect(() => {
    const favoriteItems = DUMMY_BID_DATA.filter(bid => favorites.includes(bid.id));
    setFavoriteBids(favoriteItems);
  }, [favorites]);

  // 검색 필터링
  const filteredBids = favoriteBids
    .filter(bid => !filterBidType || bid.bidType === filterBidType)
    .filter(bid => !filterTitle || bid.title.includes(filterTitle))
    .filter(bid => !filterOrg || bid.organization.includes(filterOrg))
    .filter(bid => !filterBudget || Number(bid.budget.replace(/[^0-9]/g, '')) >= filterBudget)
    .filter(bid => !filterStatus || bid.status === filterStatus)
    .filter(
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

      <div className="!mt-6 !mr-5 !w-[95%] !rounded-lg !border !bg-white !p-6 !shadow-sm">
        {/* 상단 필터 */}
        <div className="!mb-6 grid grid-cols-6 items-center gap-4">
          <Select value={filterBidType} onValueChange={val => setFilterBidType(val)}>
            <SelectTrigger className="!px-3 !py-2">
              <SelectValue placeholder="공고 단계" />
            </SelectTrigger>
            <SelectContent className="!border !border-gray-200 !bg-white !shadow-md">
              {BID_TYPE_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="공고명"
            className="!px-3 !py-2"
            value={filterTitle}
            onChange={e => setFilterTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="기관"
            className="!px-3 !py-2"
            value={filterOrg}
            onChange={e => setFilterOrg(e.target.value)}
          />
          <Select
            value={filterBudget.toString()}
            onValueChange={val => setFilterBudget(Number(val))}
          >
            <SelectTrigger className="!px-3 !py-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="!border !border-gray-200 !bg-white !shadow-md">
              {BUDGET_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={val => setFilterStatus(val)}>
            <SelectTrigger className="!px-3 !py-2">
              <SelectValue placeholder="구분" />
            </SelectTrigger>
            <SelectContent className="!border !border-gray-200 !bg-white !shadow-md">
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* 메모 표시 토글 */}
          <div className="!flex !items-center !gap-2">
            <Checkbox
              id="show-memo"
              checked={showMemo}
              onCheckedChange={val => setShowMemo(!!val)}
              className="!h-4 !w-4 !rounded !border !border-gray-700"
            />
            <label htmlFor="show-memo" className="!text-sm !text-gray-700">
              메모 표시
            </label>
          </div>
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
          showMemo={showMemo}
        />
      </div>
    </div>
  );
}
