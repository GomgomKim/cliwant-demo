'use client';

import { ChevronDown, Plus, Search, Settings2, Star, X, Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { IMAGES } from '@/features/bidSearch/model/constants';
import { useSearchStore, KeywordRow } from '@/features/bidSearch/model/searchStore';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Toast } from '@/shared/ui/Toast';

// Sub-components
import { AmountFilter } from './SearchFilterComponents/AmountFilter';
import { BusinessTypeFilter } from './SearchFilterComponents/BusinessTypeFilter';
import { ConditionCheckboxes } from './SearchFilterComponents/ConditionCheckboxes';
import { DateFilter } from './SearchFilterComponents/DateFilter';
import { ExcludeKeywordSection } from './SearchFilterComponents/ExcludeKeywordSection';
import { FilterTypeSelector } from './SearchFilterComponents/FilterTypeSelector';
import { KeywordRowComponent } from './SearchFilterComponents/KeywordRowComponent';
import { KeywordSetDropdown } from './SearchFilterComponents/KeywordSetDropdown';
import { TimeFilter } from './SearchFilterComponents/TimeFilter';

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
      // 해당 행에 태그 추가
      setKeywordTagsByRow(prev => ({
        ...prev,
        [rowId]: [...(prev[rowId] || []), keywordRow.keyword.trim()],
      }));
      // 입력 필드 초기화
      updateKeywordRow(rowId, { keyword: '' });
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
    // 모든 키워드 가져오기
    const allKeywords = keywordRows
      .flatMap(row => {
        const tags = keywordTagsByRow[row.id] || [];
        return tags.map(tag => ({
          keyword: tag,
          searchField: row.searchField,
          conjunction: row.conjunction,
          rowId: row.id,
        }));
      })
      .filter(item => item.keyword.trim() !== '');

    const filters = {
      keywords: allKeywords,
      excludeTitleKeywords,
      excludeContentKeywords,
      minAmount,
      maxAmount,
      excludeAmount,
      startDate,
      endDate,
      includeExpired,
      timeFilter,
      filterType,
      selectedKeywordSetId,
    };

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
    <div className="rounded-lg border bg-white shadow">
      <div className="flex items-center justify-end border-b p-4">
        <span className="text-sm">검색 결과 개수</span>
        <select className="ml-2 w-16 rounded border px-2 py-1 text-sm">
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <Button className="ml-2 rounded-md bg-[rgb(166,161,219)] text-xs text-white hover:bg-[rgb(146,141,199)]">
          저장
        </Button>
      </div>

      {/* 검색 필터 영역 */}
      <div className="!mb-5 bg-white p-4">
        {/* 검색 조건 선택 */}
        <div className="!mb-6 flex items-center gap-2">
          <FilterTypeSelector filterType={filterType} onFilterTypeChange={setFilterType} />

          <KeywordSetDropdown
            selectedSet={selectedSet}
            filteredKeywordSets={filteredKeywordSets}
            isDropdownOpen={isDropdownOpen}
            selectedKeywordSetId={selectedKeywordSetId}
            setIsDropdownOpen={setIsDropdownOpen}
            selectKeywordSet={selectKeywordSet}
            filterType={filterType}
          />

          <Button
            variant="unstyled"
            className="!cursor-pointer !rounded-md border !border-gray-300 !bg-[rgb(104,111,232)] !px-3 !py-2 !text-sm !text-white"
            onClick={resetKeywords}
          >
            키워드 초기화
          </Button>
          <Button
            variant="purple"
            onClick={copyGroup}
            className="!cursor-pointer !rounded-md border !border-gray-300 !bg-[rgb(104,111,232)] !px-3 !py-2 !text-sm !text-white"
          >
            {filterType === 'shared' ? '개인 그룹으로 복사' : '공용 그룹으로 복사'}
          </Button>

          <Button variant="ghost" className="ml-2 p-1 text-gray-500">
            <Settings2 size={18} />
          </Button>
        </div>

        {/* 키워드 행 */}
        <div className="!mb-6 space-y-3">
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
        />

        {/* 시간 필터 */}
        <TimeFilter timeFilter={timeFilter} setTimeFilter={setTimeFilter} />

        {/* 사업 구분 */}
        <BusinessTypeFilter />

        {/* 조건 체크박스 */}
        <ConditionCheckboxes />

        {/* 검색 버튼 */}
        <div className="mt-8 mb-4 flex justify-center">
          <Button
            className="flex cursor-pointer items-center gap-2 rounded-md bg-[rgb(166,161,219)] px-10 py-2.5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-[rgb(146,141,199)] hover:shadow-md"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
            <span className="font-medium">검색하기</span>
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
