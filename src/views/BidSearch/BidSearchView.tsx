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
  const { isFavorite } = useFavoriteStore();
  const searchStore = useSearchStore();
  const { timeFilter, setTimeFilter, setDateRange, startDate, endDate } = searchStore;

  // 필터 상태
  const [bidStatus, setBidStatus] = useState<string>('');
  const [bidType, setBidType] = useState<string>('');
  const [dateFilterLabel, setDateFilterLabel] = useState('전체 기간');

  // 페이지당 표시할 항목 수
  const itemsPerPage = 10;

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  // 현재 페이지에 표시할 항목
  const currentItems = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // SearchFilter에서 검색 이벤트 처리
  const handleSearch = (filters: any) => {
    console.log('Search triggered with filters:', filters);
    const {
      keywords,
      excludeTitleKeywords,
      excludeContentKeywords,
      minAmount,
      maxAmount,
      excludeAmount,
      startDate,
      endDate,
      includeExpired,
      timeFilter,
    } = filters;

    // 필터링 로직 시작
    let filteredResults = [...DUMMY_BID_DATA];

    // 키워드 기반 필터링
    if (keywords && keywords.length > 0) {
      filteredResults = filteredResults.filter(bid => {
        // 여러 키워드에 대한 필터링 로직 개선
        let result = true;
        let orConditionMet = false;
        let hasOrCondition = false;

        for (let i = 0; i < keywords.length; i++) {
          const { searchField, keyword, conjunction } = keywords[i];

          // 키워드가 비어있으면 건너뛰기
          if (!keyword || keyword.trim() === '') continue;

          // 키워드 매칭 검사
          let isMatched = false;
          if (searchField === 'title') {
            isMatched = bid.title.toLowerCase().includes(keyword.toLowerCase());
          } else if (searchField === 'content') {
            isMatched =
              bid.organization.toLowerCase().includes(keyword.toLowerCase()) ||
              bid.budget.toLowerCase().includes(keyword.toLowerCase());
          } else {
            isMatched =
              bid.title.toLowerCase().includes(keyword.toLowerCase()) ||
              bid.organization.toLowerCase().includes(keyword.toLowerCase()) ||
              bid.budget.toLowerCase().includes(keyword.toLowerCase());
          }

          // 첫 번째 키워드는 무조건 적용
          if (i === 0) {
            result = isMatched;
          }
          // AND 조건인 경우: 이전 결과와 AND 연산
          else if (conjunction === 'AND') {
            result = result && isMatched;
          }
          // OR 조건인 경우: OR 연산 결과 저장
          else if (conjunction === 'OR') {
            hasOrCondition = true;
            if (isMatched) {
              orConditionMet = true;
            }
          }
        }

        // OR 조건이 있었다면 최종 결과와 OR 연산
        if (hasOrCondition) {
          return result || orConditionMet;
        }

        return result;
      });
    }

    // 제외 키워드 필터링
    if (excludeTitleKeywords && excludeTitleKeywords.length > 0) {
      const exclusionTerms = excludeTitleKeywords
        .split(',')
        .map((term: string) => term.trim().toLowerCase());

      filteredResults = filteredResults.filter(bid => {
        return !exclusionTerms.some((term: string) => bid.title.toLowerCase().includes(term));
      });
    }

    if (excludeContentKeywords && excludeContentKeywords.length > 0) {
      const exclusionTerms = excludeContentKeywords
        .split(',')
        .map((term: string) => term.trim().toLowerCase());

      filteredResults = filteredResults.filter(bid => {
        return !exclusionTerms.some(
          (term: string) =>
            bid.organization.toLowerCase().includes(term) || bid.budget.toLowerCase().includes(term)
        );
      });
    }

    // 금액 기반 필터링
    if (minAmount && !excludeAmount) {
      filteredResults = filteredResults.filter(bid => {
        // 금액 문자열에서 쉼표 제거 후 숫자로 변환
        const bidAmount = parseInt(bid.budget.replace(/[^0-9]/g, ''), 10);
        return !isNaN(bidAmount) && bidAmount >= minAmount;
      });
    }

    if (maxAmount && !excludeAmount) {
      filteredResults = filteredResults.filter(bid => {
        // 금액 문자열에서 쉼표 제거 후 숫자로 변환
        const bidAmount = parseInt(bid.budget.replace(/[^0-9]/g, ''), 10);
        return !isNaN(bidAmount) && bidAmount <= maxAmount;
      });
    }

    // 날짜 기반 필터링
    if (startDate) {
      const start = new Date(startDate);
      filteredResults = filteredResults.filter(bid => {
        const bidDate = new Date(bid.publishedDate);
        return bidDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredResults = filteredResults.filter(bid => {
        const bidDate = new Date(bid.publishedDate);
        return bidDate <= end;
      });
    }

    // 마감 포함 여부
    if (!includeExpired) {
      filteredResults = filteredResults.filter(bid => {
        return bid.status !== '마감';
      });
    }

    // 상태 기반 필터링 (bidStatus)
    if (bidStatus !== 'all') {
      filteredResults = filteredResults.filter(bid => {
        if (bidStatus === 'new') return bid.status === '신규';
        if (bidStatus === 'progress') return bid.status === '진행';
        if (bidStatus === 'closed') return bid.status === '마감';
        return true;
      });
    }

    // 사업 구분 필터링 (bidTypes)
    if (bidType) {
      filteredResults = filteredResults.filter(bid => bid.bidType === bidType);
    }

    console.log('Filtered results:', filteredResults);

    // 검색 결과 업데이트
    setSearchResults(filteredResults);
    setCurrentPage(1);

    // isSearched 상태를 true로 설정하여 검색 결과 테이블이 표시되도록 함
    // 이 상태가 true일 때만 조건부 렌더링에 의해 테이블이 표시됨
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
    // 이전에는 bidStatus와 bidType이 모두 비어있을 때 isSearched를 false로 설정하는
    // 코드가 있었으나, 이로 인해 검색 후 필터가 초기화되면 결과가 표시되지 않는 문제가 발생했음
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

      {isSearched && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-base font-medium font-['Pretendard'] text-gray-800">
              {isSearched ? '검색 결과' : '모든 입찰 공고'}
            </h2>
            <div className="text-sm text-gray-500 font-['Pretendard']">
              총{' '}
              <span className="text-[rgb(166,161,219)] font-semibold">{searchResults.length}</span>
              개의 입찰 공고
            </div>
          </div>

          {searchResults.length > 0 ? (
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
              검색 결과가 없습니다. 다른 검색어로 시도해 보세요.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
