'use client';

import { Check, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useSearchStore } from '@/features/bid-search/model/searchStore';
import { Button } from '@/shared/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Toast } from '@/shared/ui/Toast';
import { AmountFilter } from '@/widgets/SearchFilter/SearchFilterComponents/AmountFilter';
import { BusinessTypeFilter } from '@/widgets/SearchFilter/SearchFilterComponents/BusinessTypeFilter';
import { ConditionCheckboxes } from '@/widgets/SearchFilter/SearchFilterComponents/ConditionCheckboxes';
import { DateFilter } from '@/widgets/SearchFilter/SearchFilterComponents/DateFilter';
import { ExcludeKeywordSection } from '@/widgets/SearchFilter/SearchFilterComponents/ExcludeKeywordSection';
import { FilterTypeSelector } from '@/widgets/SearchFilter/SearchFilterComponents/FilterTypeSelector';
import { KeywordRowComponent } from '@/widgets/SearchFilter/SearchFilterComponents/KeywordRowComponent';
import { KeywordSetDropdown } from '@/widgets/SearchFilter/SearchFilterComponents/KeywordSetDropdown';
import { TimeFilter } from '@/widgets/SearchFilter/SearchFilterComponents/TimeFilter';

interface SearchFilterProps {
  onSearch?: (filters: any) => void;
}

export function SearchFilter({ onSearch }: SearchFilterProps) {
  const {
    keywordRows,
    updateKeywordRow,
    removeKeywordRow,
    excludeTitleKeywords,
    excludeContentKeywords,
    addExcludeTitleKeyword,
    removeExcludeTitleKeyword,
    addExcludeContentKeyword,
    removeExcludeContentKeyword,
    minAmount,
    maxAmount,
    setAmountRange,
    excludeAmount,
    toggleExcludeAmount,
    timeFilter,
    setTimeFilter,
    includeExpired,
    toggleIncludeExpired,
    filterType,
    setFilterType,
    savedKeywordSets,
    selectedKeywordSetId,
    selectKeywordSet,
    setDateRange,
    saveCurrentSet,
  } = useSearchStore();

  const [startDate, setStartDate] = useState('2025-04-16');
  const [endDate, setEndDate] = useState('2025-04-23');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [excludeTitleInput, setExcludeTitleInput] = useState('');
  const [excludeContentInput, setExcludeContentInput] = useState('');
  const [showResetToast, setShowResetToast] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [copyToastMessage, setCopyToastMessage] = useState('');
  const [keywordTagsByRow, setKeywordTagsByRow] = useState<Record<string, string[]>>({});

  // 필터된 키워드 세트 배열
  const filteredKeywordSets = savedKeywordSets.filter(set =>
    filterType === 'shared' ? set.isShared : !set.isShared
  );

  // 선택된 세트 또는 첫 번째 필터된 세트, 또는 모든 세트 중 첫 번째 세트
  const selectedSet =
    savedKeywordSets.find(set => set.id === selectedKeywordSetId) ||
    filteredKeywordSets[0] ||
    savedKeywordSets[0];

  // 필터 타입이 변경될 때 해당 타입의 첫 번째 세트 선택
  useEffect(() => {
    if (filteredKeywordSets.length > 0) {
      const currentSelected = savedKeywordSets.find(set => set.id === selectedKeywordSetId);
      if (!currentSelected || currentSelected.isShared !== (filterType === 'shared')) {
        selectKeywordSet(filteredKeywordSets[0].id);
      }
    }
  }, [filterType, filteredKeywordSets, savedKeywordSets, selectedKeywordSetId, selectKeywordSet]);

  // 키워드셋이 선택될 때마다 자동 검색 트리거
  useEffect(() => {
    if (selectedKeywordSetId) {
      // 자동 검색 시 콘솔 로그 추가
      console.log('Auto searching with keyword set:', selectedKeywordSetId);

      // 키워드셋이 선택되었으나 키워드 입력칸이 비어있는 경우에만 기본 키워드를 설정
      if (keywordRows.length === 1 && keywordRows[0].keyword === '') {
        const selectedSet = savedKeywordSets.find(set => set.id === selectedKeywordSetId);
        if (selectedSet && selectedSet.keywordRows.length > 0) {
          // 선택된 키워드셋의 첫 번째 키워드만 사용
          updateKeywordRow(keywordRows[0].id, {
            keyword: '',
            searchField: 'title',
          });
        }
      }

      // 자동 검색 실행
      handleSearch();
    }
  }, [selectedKeywordSetId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 키워드를 태그로 추가하는 함수
  const addKeywordTag = (rowId: string) => {
    const keywordRow = keywordRows.find(row => row.id === rowId);
    if (keywordRow && keywordRow.keyword.trim()) {
      // 현재 입력된 키워드 저장
      const newKeyword = keywordRow.keyword.trim();

      // 해당 행에 태그 추가
      setKeywordTagsByRow(prev => ({
        ...prev,
        [rowId]: [...(prev[rowId] || []), newKeyword],
      }));

      // 입력 필드 초기화
      updateKeywordRow(rowId, { keyword: '' });

      // 태그가 추가되면 자동으로 검색 실행 (원하는 경우)
      // setTimeout(() => handleSearch(), 0);
    }
  };

  // 태그 삭제
  const removeKeywordTag = (rowId: string, tag: string) => {
    setKeywordTagsByRow(prev => ({
      ...prev,
      [rowId]: (prev[rowId] || []).filter(t => t !== tag),
    }));
  };

  // 키워드 초기화
  const resetKeywords = () => {
    // 모든 키워드 행의 내용을 비움 (행 자체는 유지)
    keywordRows.forEach(row => {
      updateKeywordRow(row.id, { keyword: '', searchField: 'title' });
    });

    // 태그도 모두 초기화
    setKeywordTagsByRow({});

    // Show toast notification
    setShowResetToast(true);
  };

  // 그룹 복사 핸들러
  const copyGroup = () => {
    if (!selectedKeywordSetId) return;
    const currentSet = savedKeywordSets.find(set => set.id === selectedKeywordSetId);
    if (!currentSet) return;

    const newName = currentSet.name;
    // isShared 반대로 설정하여 복사
    saveCurrentSet(newName, !currentSet.isShared);

    // Set toast message based on current filter type
    const toastMessage =
      filterType === 'shared' ? '개인 그룹으로 복사되었습니다' : '공용 그룹으로 복사되었습니다';
    setCopyToastMessage(toastMessage);
    setShowCopyToast(true);
  };

  const handleSearch = () => {
    // 입력 필드의 키워드도 처리
    const keywordsWithInputField = keywordRows.map(row => {
      const tags = keywordTagsByRow[row.id] || [];
      // 이미 태그가 있거나 키워드가 비어있으면 원래 태그만 반환
      if (tags.length > 0 || !row.keyword.trim()) {
        return { rowId: row.id, tags, searchField: row.searchField || 'title' };
      }
      // 키워드가 있지만 태그가 없는 경우, 현재 입력된 키워드를 임시 태그로 사용
      return { rowId: row.id, tags: [row.keyword.trim()], searchField: row.searchField || 'title' };
    });

    // 모든 키워드 가져오기
    const allKeywords = keywordsWithInputField
      .flatMap(({ rowId, tags, searchField }) => {
        if (tags.length === 0) return [];

        const row = keywordRows.find(r => r.id === rowId);
        if (!row) return [];

        // Use the row's conjunction for all keywords so that if it's AND, every keyword is required
        return tags.map(tag => ({
          keyword: tag,
          searchField,
          conjunction: row.conjunction || 'AND',
          rowId: row.id,
        }));
      })
      .filter(item => item.keyword && item.keyword.trim() !== '');

    console.log('검색에 사용되는 키워드와 AND/OR 조건:', allKeywords);

    const filters = {
      keywords: allKeywords,
      excludeTitleKeywords,
      excludeContentKeywords,
      minAmount,
      maxAmount: excludeAmount ? null : maxAmount,
      excludeAmount,
      startDate,
      endDate,
      includeExpired,
      timeFilter,
      filterType,
      selectedKeywordSetId,
    };

    // 필터 조건을 로그로 출력
    console.log('적용된 필터 조건:', {
      키워드: allKeywords.map(
        k => `${k.keyword} (${k.searchField}, ${k.conjunction || '첫 조건'})`
      ),
      제외제목키워드: excludeTitleKeywords,
      제외본문키워드: excludeContentKeywords,
      금액범위: excludeAmount ? `${minAmount} 이상` : `${minAmount}~${maxAmount}`,
      기간: `${startDate || '없음'} ~ ${endDate || '없음'} (${timeFilter})`,
      마감포함: includeExpired ? 'O' : 'X',
    });

    // 상위 컴포넌트로 필터 상태 전달
    if (onSearch) {
      onSearch(filters);
    }
  };

  // timeFilter 변경 시 날짜 자동 업데이트
  const updateDatesByTimeFilter = (filter: string) => {
    const now = new Date();
    const start = new Date();

    if (filter === 'day') {
      start.setDate(now.getDate() - 1);
    } else if (filter === 'week') {
      start.setDate(now.getDate() - 7);
    } else if (filter === 'month') {
      start.setMonth(now.getMonth() - 1);
    } else if (filter === 'all') {
      start.setFullYear(2020, 0, 1); // 충분히 과거 날짜
    }

    const formattedStartDate = start.toISOString().split('T')[0];
    const formattedEndDate = now.toISOString().split('T')[0];

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setDateRange(formattedStartDate, formattedEndDate);
  };

  // timeFilter 변경 시 자동으로 실행
  useEffect(() => {
    if (timeFilter !== 'custom') {
      updateDatesByTimeFilter(timeFilter);
    }
  }, [timeFilter]);

  // timeFilter에 따라 includeExpired 자동 토글
  useEffect(() => {
    const shouldInclude = ['year', 'all'].includes(timeFilter);
    if (shouldInclude !== includeExpired) {
      toggleIncludeExpired();
    }
  }, [timeFilter]);

  const handleAddExcludeTitleKeyword = () => {
    if (excludeTitleInput.trim()) {
      addExcludeTitleKeyword(excludeTitleInput.trim());
      setExcludeTitleInput('');
    }
  };

  const handleAddExcludeContentKeyword = () => {
    if (excludeContentInput.trim()) {
      addExcludeContentKeyword(excludeContentInput.trim());
      setExcludeContentInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, fieldType: 'title' | 'content') => {
    if (e.key === 'Enter') {
      if (fieldType === 'title') {
        handleAddExcludeTitleKeyword();
      } else {
        handleAddExcludeContentKeyword();
      }
    }
  };

  return (
    <div className="!rounded-lg !bg-white !shadow-sm">
      <div className="!flex !items-center !justify-between !p-4">
        <h3 className="!text-base !font-semibold !text-gray-800">검색 필터</h3>
        <div className="!flex !items-center">
          <span className="!text-sm !text-gray-600">검색 결과 개수</span>
          <Select defaultValue="20">
            <SelectTrigger className="!ml-2 !w-16 !rounded !border !px-2 !py-1 !text-sm">
              <SelectValue placeholder="항목 수" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <Button className="!ml-2 !rounded-md !bg-[rgb(166,161,219)] !px-3 !text-xs !text-white hover:!bg-[rgb(146,141,199)]">
            저장
          </Button>
        </div>
      </div>

      {/* 검색 필터 영역 */}
      <div className="!space-y-6 !p-6">
        {/* 검색 조건 선택 */}
        <div className="!mb-4 !flex !flex-col !gap-4">
          {/* 검색 필터 타입 선택 */}
          <div className="!space-y-2">
            <p className="!text-sm !font-medium !text-gray-700">검색 방법</p>
            <FilterTypeSelector filterType={filterType} onFilterTypeChange={setFilterType} />
          </div>

          {/* 키워드셋 드롭다운 */}
          <div className="!space-y-2">
            <p className="!text-sm !font-medium !text-gray-700">키워드 셋</p>
            <KeywordSetDropdown
              selectedSet={selectedSet}
              filteredKeywordSets={filteredKeywordSets}
              isDropdownOpen={isDropdownOpen}
              selectedKeywordSetId={selectedKeywordSetId}
              setIsDropdownOpen={setIsDropdownOpen}
              selectKeywordSet={selectKeywordSet}
              filterType={filterType}
            />
          </div>
        </div>

        {/* 키워드 행 */}
        <div className="!mb-3 space-y-3">
          {keywordRows.map(row => (
            <KeywordRowComponent
              key={row.id}
              row={row}
              updateKeywordRow={updateKeywordRow}
              addKeywordTag={addKeywordTag}
              keywordTags={keywordTagsByRow[row.id] || []}
              removeKeywordTag={removeKeywordTag}
            />
          ))}
        </div>

        {/* 제외 키워드 영역 */}
        <ExcludeKeywordSection
          excludeTitleInput={excludeTitleInput}
          setExcludeTitleInput={setExcludeTitleInput}
          excludeContentInput={excludeContentInput}
          setExcludeContentInput={setExcludeContentInput}
          excludeTitleKeywords={excludeTitleKeywords}
          excludeContentKeywords={excludeContentKeywords}
          handleAddExcludeTitleKeyword={handleAddExcludeTitleKeyword}
          handleAddExcludeContentKeyword={handleAddExcludeContentKeyword}
          removeExcludeTitleKeyword={removeExcludeTitleKeyword}
          removeExcludeContentKeyword={removeExcludeContentKeyword}
          handleKeyPress={handleKeyPress}
        />

        {/* 금액 필터 */}
        <AmountFilter
          minAmount={minAmount}
          maxAmount={maxAmount}
          setAmountRange={setAmountRange}
          excludeAmount={excludeAmount}
          toggleExcludeAmount={toggleExcludeAmount}
        />

        {/* 날짜 필터 */}
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setTimeFilter={setTimeFilter}
          includeExpired={includeExpired}
          toggleIncludeExpired={toggleIncludeExpired}
          timeFilter={timeFilter}
        />

        {/* 시간 필터 */}
        <TimeFilter
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          includeExpired={includeExpired}
          toggleIncludeExpired={toggleIncludeExpired}
        />

        {/* 사업 구분 */}
        <BusinessTypeFilter />

        {/* 조건 체크박스 */}
        <ConditionCheckboxes />

        {/* 검색 버튼 */}
        <div className="!mt-6 !flex !items-center !justify-center">
          <Button
            disabled={!selectedKeywordSetId}
            onClick={() => handleSearch()}
            className="!flex !h-12 !w-40 !cursor-pointer !items-center !justify-center !gap-2 !rounded-full !bg-blue-600 !px-6 !py-3 !text-white !shadow-md hover:!bg-blue-700 active:!bg-blue-800"
          >
            <Search className="!h-5 !w-5" />
            <span className="!font-medium">검색</span>
          </Button>
        </div>
      </div>

      {/* Toast notifications */}
      <Toast
        title="키워드가 초기화되었습니다"
        isVisible={showResetToast}
        onClose={() => setShowResetToast(false)}
        icon={<Check className="size-5 text-green-600" />}
      />

      <Toast
        title={copyToastMessage}
        isVisible={showCopyToast}
        onClose={() => setShowCopyToast(false)}
        icon={<Check className="size-5 text-green-600" />}
      />
    </div>
  );
}
