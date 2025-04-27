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

    // 필터에서 전달받은 키워드 목록
    const keywordFilters = filters.keywords || [];

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

    // timeFilter 기반으로 bid 필터링
    const filterBidsByTime = (bids: BidItem[]): BidItem[] => {
      // filters.timeFilter에서 선택된 시간 필터
      const timeFilter = filters.timeFilter;
      if (timeFilter === 'all') return bids;

      const now = new Date();
      const fromDate = new Date();

      // 시간 필터에 따라 시작 날짜 설정
      if (timeFilter === 'day') {
        fromDate.setDate(now.getDate() - 1);
      } else if (timeFilter === 'week') {
        fromDate.setDate(now.getDate() - 7);
      } else if (timeFilter === 'month') {
        fromDate.setMonth(now.getMonth() - 1);
      } else if (timeFilter === 'custom' && filters.startDate && filters.endDate) {
        // custom 시간 필터의 경우 startDate와 endDate 사용
        return bids.filter(bid => {
          const bidDate = new Date(bid.publishedDate);
          const startDate = new Date(filters.startDate);
          const endDate = new Date(filters.endDate);
          return bidDate >= startDate && bidDate <= endDate;
        });
      }

      // 시간 필터에 따른 기간 내의 공고만 필터링
      return bids.filter(bid => {
        const bidDate = new Date(bid.publishedDate);
        return bidDate >= fromDate && bidDate <= now;
      });
    };

    // 새로운 검색 결과 처리 로직
    if (keywordFilters.length > 0) {
      // 그룹핑: rowId를 기준으로 그룹화하여 각 그룹의 키워드를 AND/OR 조건으로 결합
      const groupedKeywords: Record<
        string,
        { searchField: string; conjunction: string; keywords: string[] }
      > = {};
      const orderedRowIds: string[] = [];
      keywordFilters.forEach((kw: any) => {
        if (!groupedKeywords[kw.rowId]) {
          groupedKeywords[kw.rowId] = {
            searchField: kw.searchField,
            conjunction: kw.conjunction && kw.conjunction !== '' ? kw.conjunction : 'AND',
            keywords: [kw.keyword],
          };
          orderedRowIds.push(kw.rowId);
        } else {
          groupedKeywords[kw.rowId].keywords.push(kw.keyword);
        }
      });

      let results: BidItem[] = [];
      orderedRowIds.forEach((rowId, index) => {
        const group = groupedKeywords[rowId];
        let groupMatches: BidItem[] = [];
        if (group.conjunction === 'AND') {
          // AND: bid must match every keyword in the group
          groupMatches = DUMMY_BID_DATA.filter(bid =>
            group.keywords.every(kw =>
              matchesBid(bid, { keyword: kw, searchField: group.searchField })
            )
          );
        } else {
          // OR condition
          groupMatches = DUMMY_BID_DATA.filter(bid =>
            group.keywords.some(kw =>
              matchesBid(bid, { keyword: kw, searchField: group.searchField })
            )
          );
        }
        if (index === 0) {
          results = groupMatches;
        } else {
          // Combine with previous groups based on this group's conjunction
          if (group.conjunction === 'AND') {
            results = results.filter(bid => groupMatches.includes(bid));
          } else if (group.conjunction === 'OR') {
            results = Array.from(new Set([...results, ...groupMatches]));
          }
        }
      });

      // 시간 필터 적용
      results = filterBidsByTime(results);

      const resultsBySet: Record<string, BidItem[]> = {};
      if (selectedKeywordSetId) {
        resultsBySet[selectedKeywordSetId] = results;
      } else if (savedKeywordSets.length > 0) {
        resultsBySet[savedKeywordSets[0].id] = results;
      }
      setSearchResultsByGroup(resultsBySet);
    } else {
      // 기존 로직: 키워드가 없는 경우 저장된 키워드 세트 기반 처리
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

        // 시간 필터 적용
        resultsBySet[set.id] = filterBidsByTime(results);
      });

      setSearchResultsByGroup(resultsBySet);
    }

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
      <div className="mb-6 flex items-center gap-6">
        <div className="flex-1">
          <h1 className="!mb-4 !inline-block !border-b-2 !border-[rgb(166,161,219)] !pb-2 !font-['Pretendard'] !text-xl !font-bold !text-[rgb(68,64,128)]">
            입찰 공고
          </h1>
        </div>
      </div>

      <SearchFilter onSearch={handleSearch} />

      {/* 선택된 키워드 세트 검색 결과 표시 */}
      {isSearched && currentSet && (
        <div key={currentSet.id} className="mt-6 rounded-lg border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div className="font-['Pretendard'] text-sm text-gray-500">
              총{' '}
              <span className="font-semibold text-[rgb(166,161,219)]">{currentResults.length}</span>
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
            <div className="p-10 text-center font-['Pretendard'] text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
