'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

import { DUMMY_BID_DATA } from '@/features/bid-search/model/data';
import { useSearchStore } from '@/features/bid-search/model/searchStore';
import { BidItem } from '@/features/bid-search/model/types';
import { BidList, Pagination } from '@/features/bid-search/ui';
import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';
import { SearchFilter } from '@/widgets/SearchFilter';

export function BidSearchView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<BidItem[]>(DUMMY_BID_DATA);
  const [isSearched, setIsSearched] = useState(false);
  const [searchResultsByGroup, setSearchResultsByGroup] = useState<Record<string, BidItem[]>>({});
  const [totalResults, setTotalResults] = useState(0);
  const [resultCount, setResultCount] = useState(20);
  const { isFavorite } = useFavoriteStore();
  const searchStore = useSearchStore();
  const {
    savedKeywordSets,
    selectedKeywordSetId,
    timeFilter,
    setTimeFilter,
    setDateRange,
    startDate,
    endDate,
  } = searchStore;
  // 현재 선택된 키워드 세트 결과
  const currentResults = selectedKeywordSetId
    ? searchResultsByGroup[selectedKeywordSetId] || []
    : [];
  const currentSet = savedKeywordSets.find(s => s.id === selectedKeywordSetId);

  // 필터 상태
  const [bidStatus, setBidStatus] = useState<string>('');
  const [bidType, setBidType] = useState<string>('');
  const [dateFilterLabel, setDateFilterLabel] = useState('전체 기간');

  // 페이지당 표시할 항목 수를 resultCount로 설정
  const itemsPerPage = resultCount;

  // 전체 페이지 수 계산 (현재 선택된 세트)
  const totalPages = Math.ceil(currentResults.length / itemsPerPage);

  // 현재 페이지에 표시할 항목 (현재 선택된 세트)
  const currentItems = currentResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // SearchFilter에서 검색 이벤트 처리
  const handleSearch = (filters: any, setTotal: (total: number) => void) => {
    console.log('Search triggered with filters:', filters);

    // 필터에서 전달받은 키워드 목록
    const keywordFilters = filters.keywords || [];
    const resultCount = filters.resultCount || 20;
    setResultCount(resultCount);

    // 키워드 매칭 함수
    const matchesBid = (bid: BidItem, kw: { keyword: string; searchField?: string }) => {
      const txt = kw.keyword.toLowerCase();

      // 검색 필드에 따라 다른 필드 검색
      if (kw.searchField === 'title') {
        return bid.title.toLowerCase().includes(txt);
      } else if (kw.searchField === 'content') {
        // 콘텐츠 검색은 여러 필드에서 수행
        return (
          bid.organization.toLowerCase().includes(txt) ||
          bid.budget.toLowerCase().includes(txt) ||
          (bid.status && bid.status.toLowerCase().includes(txt)) ||
          (bid.bidType && bid.bidType.toLowerCase().includes(txt))
        );
      }

      // 기본값 (모든 필드 검색)
      return (
        bid.title.toLowerCase().includes(txt) ||
        bid.organization.toLowerCase().includes(txt) ||
        bid.budget.toLowerCase().includes(txt) ||
        (bid.status && bid.status.toLowerCase().includes(txt)) ||
        (bid.bidType && bid.bidType.toLowerCase().includes(txt))
      );
    };

    // 필터링된 결과 계산
    let filteredResults = DUMMY_BID_DATA;

    // 키워드 필터링
    if (keywordFilters.length > 0) {
      filteredResults = filteredResults.filter(bid => {
        return keywordFilters.every((kw: any) => {
          const matches = matchesBid(bid, kw);
          return kw.conjunction === 'OR' ? matches : matches;
        });
      });
    }

    // 전체 결과 수 설정
    setTotalResults(filteredResults.length);
    setTotal(filteredResults.length);

    // 선택된 개수만큼만 결과 저장
    const limitedResults = filteredResults.slice(0, resultCount);

    // 결과 저장
    if (selectedKeywordSetId) {
      setSearchResultsByGroup(prev => ({
        ...prev,
        [selectedKeywordSetId]: limitedResults,
      }));
    }

    // 검색 완료 상태 설정
    setIsSearched(true);
    setCurrentPage(1);
  };

  // 사업 구분 및 입찰 방식 필터 변경 시 결과 업데이트
  useEffect(() => {
    if (bidStatus || bidType) {
      let filteredResults = DUMMY_BID_DATA;

      if (bidStatus) {
        filteredResults = filteredResults.filter(bid => bid.status === bidStatus);
      }

      if (bidType) {
        filteredResults = filteredResults.filter(bid => bid.bidType === bidType);
      }

      setSearchResults(filteredResults);
      setCurrentPage(1);
      setIsSearched(true); // 필터 변경 시에도 테이블 표시 유지
    }
  }, [bidStatus, bidType]);

  // timeFilter가 변경될 때 라벨도 업데이트
  useEffect(() => {
    // SearchFilter 컴포넌트에서 radio button 변경 시 반영
    if (timeFilter === 'day') {
      setDateFilterLabel('하루 전');
    } else if (timeFilter === 'week') {
      setDateFilterLabel('일주일 전');
    } else if (timeFilter === 'month') {
      setDateFilterLabel('한 달 전');
    } else if (timeFilter === 'all') {
      setDateFilterLabel('전체 기간');
    }
  }, [timeFilter]);

  useEffect(() => {
    // Clear the isSearched state on component mount to ensure table is hidden initially
    setIsSearched(false);
  }, []);

  return (
    <div className="container mx-auto !bg-[#F3F6F7] !p-18 py-4 font-['Pretendard']">
      <SearchFilter onSearch={handleSearch} />

      {/* 선택된 키워드 세트 검색 결과 표시 - Only show when isSearched is true */}
      {isSearched && (
        <div className="mt-6 bg-white !shadow-sm">
          {currentResults.length > 0 ? (
            <>
              <BidList bids={currentResults} />
            </>
          ) : (
            <div className="p-10 text-center font-['Pretendard'] text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
