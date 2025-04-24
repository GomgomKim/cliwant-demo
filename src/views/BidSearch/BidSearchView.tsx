'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

import { DUMMY_BID_DATA } from '@/features/bidSearch/model/data';
import { useSearchStore } from '@/features/bidSearch/model/searchStore';
import { BidItem } from '@/features/bidSearch/model/types';
import { BidList, Pagination, SearchFilter } from '@/features/bidSearch/ui';
import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';

export function BidSearchView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<BidItem[]>(DUMMY_BID_DATA);
  const [isSearched, setIsSearched] = useState(false);
  const [searchResultsByGroup, setSearchResultsByGroup] = useState<Record<string, BidItem[]>>({});
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

  // 페이지당 표시할 항목 수
  const itemsPerPage = 10;

  // 전체 페이지 수 계산 (현재 선택된 세트)
  const totalPages = Math.ceil(currentResults.length / itemsPerPage);

  // 현재 페이지에 표시할 항목 (현재 선택된 세트)
  const currentItems = currentResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // SearchFilter에서 검색 이벤트 처리
  const handleSearch = (filters: any) => {
    console.log('Search triggered with filters:', filters);
    // 키워드 매칭 함수
    const matchesBid = (bid: BidItem, kw: { keyword: string; searchField?: string }) => {
      const txt = kw.keyword.toLowerCase();
      if (kw.searchField === 'title') {
        return bid.title.toLowerCase().includes(txt);
      }
      return (
        bid.organization.toLowerCase().includes(txt) ||
        bid.budget.toLowerCase().includes(txt) ||
        (bid.status && bid.status.toLowerCase().includes(txt)) ||
        (bid.bidType && bid.bidType.toLowerCase().includes(txt))
      );
    };

    // 저장된 키워드 세트별로 결과 계산
    const resultsBySet: Record<string, BidItem[]> = {};
    searchStore.savedKeywordSets.forEach(set => {
      const results = set.keywordRows.reduce((acc: BidItem[], row, index) => {
        if (!row.keyword.trim()) return index === 0 ? [] : acc;
        const rowMatches = DUMMY_BID_DATA.filter(bid => matchesBid(bid, row));
        if (index === 0) {
          return rowMatches;
        }
        if (row.conjunction === 'OR') {
          // OR: 이전 결과와 합집합
          const union = [...acc];
          rowMatches.forEach(item => {
            if (!union.includes(item)) union.push(item);
          });
          return union;
        }
        // AND: 교집합
        return acc.filter(item => rowMatches.includes(item));
      }, [] as BidItem[]);
      resultsBySet[set.id] = results;
    });

    setSearchResultsByGroup(resultsBySet);
    // 검색시 페이지를 첫 페이지로 초기화
    setCurrentPage(1);
    setIsSearched(true);
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

  // isSearched 상태 변화 추적을 위한 디버깅 로그
  useEffect(() => {
    console.log('isSearched :', isSearched);
  }, [isSearched]);

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

  return (
    <div className="container mx-auto py-4 font-['Pretendard']">
      <div className="flex items-center gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold mb-1 font-['Pretendard']">입찰 공고</h1>
        </div>
      </div>

      <SearchFilter onSearch={handleSearch} />

      {/* 선택된 키워드 세트 검색 결과 표시 */}
      {isSearched && currentSet && (
        <div key={currentSet.id} className="mt-6 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-base font-medium font-['Pretendard'] text-gray-800">
              {currentSet.name} ({currentSet.isShared ? '공용' : '개인'} 그룹)
            </h2>
            <div className="text-sm text-gray-500 font-['Pretendard']">
              총{' '}
              <span className="text-[rgb(166,161,219)] font-semibold">{currentResults.length}</span>
              개의 입찰 공고
            </div>
          </div>
          {currentResults.length > 0 ? (
            <>
              <BidList bids={currentItems} />
              <div className="border-t p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="p-10 text-center text-gray-500 font-['Pretendard']">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
