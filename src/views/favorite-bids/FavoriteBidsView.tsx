'use client';

import { useEffect, useMemo, useState } from 'react';

import { DUMMY_BID_DATA } from '@/features/bid-search/model/data';
import { BidItem } from '@/features/bid-search/model/types';
import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';

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
  const [filterBusinessType, setFilterBusinessType] = useState<string>('all');

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
    .filter(bid => filterBusinessType === 'all' || bid.status === filterBusinessType)
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
      let aVal, bVal;

      if (sortKey === 'budget') {
        // 금액 정렬: 숫자만 추출하여 비교
        aVal = Number(a[sortKey].replace(/[^0-9]/g, ''));
        bVal = Number(b[sortKey].replace(/[^0-9]/g, ''));
        return sortAsc ? aVal - bVal : bVal - aVal;
      } else {
        // 날짜 정렬
        aVal = a[sortKey];
        bVal = b[sortKey];
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
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
    <div className="!container !mx-auto !pl-18">
      <div className="!mb-6 !flex !items-center !gap-6">
        <div className="!flex-1">
          <h4 className="!z-[2] !h-[30px] !max-h-[30px] !min-h-[30px] !w-max !max-w-[300px] !min-w-0 !flex-grow-0 !overflow-visible !rounded-none !border-b-4 !border-[#676FE7] !font-['Pretendard'] !text-[18px] !leading-none !font-bold !whitespace-pre-wrap !text-[#676FE7] !opacity-100">
            관심 공고
          </h4>
        </div>
      </div>

      <div className="!mt-6 !mr-5 !w-[95%] !rounded-lg !border !bg-white !p-6 !shadow-sm">
        {/* 상단 필터 */}
        <div className="!mb-6 !grid !grid-cols-7 !items-center !gap-2">
          <select
            value={filterBidType}
            onChange={e => setFilterBidType(e.target.value)}
            className="!h-[35px] !w-full !rounded !border !border-[#EBEBEB] !py-1 !text-left !text-xs !font-semibold !text-[var(--color_primary_contrast_default)]"
          >
            <option value="">공고 단계</option>
            {BID_TYPE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <Input
            type="text"
            placeholder="공고명 검색"
            className="!h-[35px] !w-full !rounded !border !border-[#EBEBEB]"
            value={filterTitle}
            onChange={e => setFilterTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="기관 검색"
            className="!h-[35px] !w-full !rounded !border !border-[#EBEBEB]"
            value={filterOrg}
            onChange={e => setFilterOrg(e.target.value)}
          />
          <select
            value={filterBusinessType}
            onChange={e => setFilterBusinessType(e.target.value)}
            className="!h-[35px] !w-full !rounded !border !border-[#EBEBEB] !py-1 !text-left !text-xs !font-semibold !text-[var(--color_primary_contrast_default)]"
          >
            <option value="all">전체</option>
            <option value="용역">용역</option>
            <option value="물품">물품</option>
            <option value="공사">공사</option>
            <option value="외자">외자</option>
            <option value="기타">기타</option>
          </select>
          <select
            value={filterBudget.toString()}
            onChange={e => setFilterBudget(Number(e.target.value))}
            className="!h-[35px] !w-full !rounded !border !border-[#EBEBEB] !py-1 !text-left !text-xs !font-semibold !text-[var(--color_primary_contrast_default)]"
          >
            <option value="0">예산</option>
            {BUDGET_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="!h-[35px] !w-full !rounded !border !border-[#EBEBEB] !py-1 !text-left !text-xs !font-semibold !text-[var(--color_primary_contrast_default)]"
          >
            <option value="">구분</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {/* 메모 표시 토글 */}
          <div className="!flex !items-center !justify-center !gap-2">
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
