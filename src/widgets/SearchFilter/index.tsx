'use client';

import {
  ChevronDown,
  Plus,
  Search,
  Settings2,
  Star,
  X,
  Check,
  ChevronUp,
  CogIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { IMAGES } from '@/features/bid-search/model/constants';
import { useSearchStore, KeywordRow } from '@/features/bid-search/model/searchStore';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
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
  const [activeTab, setActiveTab] = useState('bid');
  const [filterMode, setFilterMode] = useState('advanced');
  const [isAIToggleOn, setIsAIToggleOn] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

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
    <div
      suppressHydrationWarning
      className="!flex !min-h-[500px] !w-full !flex-col !border !border-gray-200 !bg-[#F3F6F7] !p-18 !shadow-sm"
    >
      {/* 탭 헤더 영역 */}
      <div className="!mb-3 !flex !items-center !justify-between !border-b !border-gray-200 !pb-2">
        <div className="!flex !gap-3">
          <h4
            className={`!cursor-pointer !text-lg !font-bold ${activeTab === 'bid' ? '!border-b-4 !border-[#686FE8] !text-[#686FE8]' : '!border-b-4 !border-transparent !text-[#999999]'}`}
            onClick={() => setActiveTab('bid')}
          >
            입찰 공고
          </h4>
          <h4
            className={`!cursor-pointer !text-lg !font-bold ${activeTab === 'spec' ? '!border-b-4 !border-[#686FE8] !text-[#686FE8]' : '!border-b-4 !border-transparent !text-[#999999]'}`}
            onClick={() => setActiveTab('spec')}
          >
            사전 규격
          </h4>
          <h4
            className={`!cursor-pointer !text-lg !font-bold ${activeTab === 'plan' ? '!border-b-4 !border-[#686FE8] !text-[#686FE8]' : '!border-b-4 !border-transparent !text-[#999999]'}`}
            onClick={() => setActiveTab('plan')}
          >
            발주 계획
          </h4>
          <h4
            className={`!cursor-pointer !text-lg !font-bold ${activeTab === 'failed' ? '!border-b-4 !border-[#686FE8] !text-[#686FE8]' : '!border-b-4 !border-transparent !text-[#999999]'}`}
            onClick={() => setActiveTab('failed')}
          >
            유찰 공고
          </h4>
        </div>

        <div className="!flex !items-center !gap-2">
          <span className="!text-sm !font-semibold !text-[#111111]">검색 결과 개수</span>
          <select
            className="!h-[30px] !w-[50px] !rounded !border !border-[#ebebeb] !bg-white !py-1 !pl-2 !text-xs !font-bold"
            defaultValue="20"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
          <Button className="!h-[30px] !w-[50px] !cursor-pointer !rounded-md !bg-[#686FE8] !px-3 !py-1 !text-xs !text-white hover:!bg-[#585CCE]">
            저장
          </Button>
        </div>
      </div>

      {/* 검색 모드 선택 */}
      <div className="!mb-2 !flex">
        <div className="!flex !gap-1">
          <div
            className={`!z-[4] !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-max !cursor-pointer !items-center !justify-center !self-center !rounded-[20px] !px-[15px] !py-0 !text-[14px] !leading-[1.4] !font-bold ${
              filterMode === 'simple'
                ? '!bg-[rgb(108,186,162)] !text-white !shadow-[0px_2px_4px_0px_var(--color_text_default)]'
                : '!bg-[rgba(108,186,162,0.1)] !text-[rgb(108,186,162)] !shadow-[0px_2px_4px_0px_var(--color_destructive_default)]'
            }`}
            onClick={() => setFilterMode('simple')}
          >
            간편 검색
          </div>
          <div
            className={`!z-[4] !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-max !cursor-pointer !items-center !justify-center !self-center !rounded-[20px] !px-[15px] !py-0 !text-[14px] !leading-[1.4] !font-bold ${
              filterMode === 'ai'
                ? '!bg-gradient-to-r !from-[rgb(251,0,255)] !to-[rgb(93,44,255)] !text-white !shadow-[0px_2px_4px_0px_var(--color_text_default)]'
                : '!bg-gradient-to-r !from-[rgba(251,0,255,0.06)] !to-[rgba(251,0,255,0.06)] !text-[rgb(238,127,134)] !shadow-[0px_2px_4px_0px_var(--color_destructive_default)]'
            }`}
            onClick={() => setFilterMode('ai')}
          >
            AI 검색
          </div>
          <div
            className={`!z-[4] !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-max !cursor-pointer !items-center !justify-center !self-center !rounded-[20px] !px-[15px] !py-0 !text-[14px] !leading-[1.4] !font-bold ${
              filterMode === 'advanced'
                ? '!bg-[rgb(104,111,232)] !text-white !shadow-[0px_2px_4px_0px_var(--color_text_default)]'
                : '!bg-[rgba(104,111,232,0.1)] !text-[rgb(104,111,232)] !shadow-[0px_2px_4px_0px_var(--color_destructive_default)]'
            }`}
            onClick={() => setFilterMode('advanced')}
          >
            고급 검색
          </div>
        </div>
      </div>

      {/* 필터 본문 컨테이너 */}
      <div className="!mb-4 !rounded-md !border !border-gray-200 !bg-white !p-5">
        <div className="!mb-4 !flex !items-center !justify-between">
          {/* 필터 타입 선택 */}
          <div className="!flex !items-center !gap-1">
            <div className="!z-[18] !flex !min-h-[40px] !w-max !min-w-[40px] !cursor-pointer !flex-row !items-center !gap-[5px] !self-center !overflow-visible !rounded-none !opacity-100">
              <div
                className={`!z-[4] !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-max !items-center !justify-center !self-center !rounded-[20px] !px-[10px] !py-0 !text-xs !leading-[1.4] !font-bold !shadow-[0px_2px_4px_0px_rgba(var(--color_primary_contrast_default_rgb),0.2)] ${
                  filterType === 'shared'
                    ? '!bg-[#A6A1DB] !text-white'
                    : '!bg-[#EAEAEA] !text-[#666666] !shadow-[0px_2px_4px_0px_rgb(255,255,255)]'
                }`}
                onClick={() => setFilterType('shared')}
              >
                <div>공유</div>
              </div>
              <div
                className={`!z-[4] !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-max !items-center !justify-center !self-center !rounded-[20px] !px-[10px] !py-0 !text-xs !leading-[1.4] !font-bold !shadow-[0px_2px_4px_0px_rgba(var(--color_primary_contrast_default_rgb),0.2)] ${
                  filterType === 'personal'
                    ? '!bg-[#A6A1DB] !text-white'
                    : '!bg-[#EAEAEA] !text-[#666666] !shadow-[0px_2px_4px_0px_rgb(255,255,255)]'
                }`}
                onClick={() => setFilterType('personal')}
              >
                <div>개인</div>
              </div>
            </div>

            <div className="!mx-2 !flex !items-center">
              <button className="!flex !h-6 !w-6 !items-center !justify-center !rounded !text-blue-900">
                <div className="!h-[22px] !w-[22px] !flex-shrink-0 !text-[rgb(21,22,99)]">
                  <Image
                    src="/pin.svg"
                    alt="Pin"
                    width={22}
                    height={22}
                    className="!h-full !w-full"
                  />
                </div>
              </button>
            </div>

            <select
              className="!w-60 !rounded !border !border-gray-200 !px-2 !py-1 !text-sm"
              value={selectedKeywordSetId || ''}
              onChange={e => selectKeywordSet(e.target.value)}
            >
              {filteredKeywordSets.length === 0 ? (
                <option value="" disabled>
                  {filterType === 'shared' ? '공유 그룹 없음' : '개인 그룹 없음'}
                </option>
              ) : (
                filteredKeywordSets.map(set => (
                  <option key={set.id} value={set.id}>
                    {set.name}
                  </option>
                ))
              )}
            </select>

            <Button className="!ml-1 !h-[30px] !w-[90px] !rounded-md !bg-[#686FE8] !px-3 !py-1 !text-xs !text-white hover:!bg-[#585CCE]">
              현재 조건 저장
            </Button>

            <Button className="!ml-1 !h-[30px] !w-[120px] !rounded-md !bg-[#686FE8] !px-3 !py-1 !text-xs !text-white hover:!bg-[#585CCE]">
              {filterType === 'shared' ? '개인 그룹으로 복사' : '공용 그룹으로 복사'}
            </Button>

            <Button size="sm" variant="ghost" className="!ml-1 !p-1">
              <div className="!h-[24px] !w-[24px] !flex-shrink-0 !text-[rgb(21,22,99)]">
                <Image
                  src="/settings.svg"
                  alt="Settings"
                  width={24}
                  height={24}
                  className="!h-full !w-full"
                />
              </div>
            </Button>

            <div className="!ml-auto !flex !items-center !gap-2">
              <span className="!text-sm !font-semibold !text-gray-500">AI 키워드 추천 받기</span>
              <label className="!relative !inline-block !h-[25px] !w-[45px]">
                <input
                  type="checkbox"
                  className="!peer !sr-only"
                  checked={isAIToggleOn}
                  onChange={() => setIsAIToggleOn(!isAIToggleOn)}
                />
                <div
                  className={`!absolute !inset-0 !cursor-pointer !rounded-full !transition-all !duration-300 after:!absolute after:!top-0.5 after:!left-0.5 after:!h-[21px] after:!w-[21px] after:!rounded-full after:!bg-[rgba(166,161,219,1)] after:!transition-all after:!duration-300 ${isAIToggleOn ? '!bg-[rgba(166,161,219,1)] after:!translate-x-5 after:!bg-white' : '!bg-[rgba(230,230,230,1)]'}`}
                ></div>
              </label>
            </div>
          </div>
        </div>

        {/* 키워드 행 필드 */}
        <div className="!mb-4 !space-y-2">
          {keywordRows.slice(0, isFilterExpanded ? undefined : 2).map((row, index) => (
            <div key={row.id} className="!flex !items-center !gap-2">
              <select
                className="!h-[30px] !w-[90px] !rounded !border !border-[#EBEBEB] !py-1 !text-left !text-xs !font-semibold !text-[var(--color_primary_contrast_default)]"
                value={row.searchField || 'title'}
                onChange={e =>
                  updateKeywordRow(row.id, { searchField: e.target.value as 'title' | 'content' })
                }
              >
                <option value="title" className="!bg-[#999999] !text-white hover:!bg-blue-600">
                  공고 제목
                </option>
                <option value="content" className="!bg-[#999999] !text-white hover:!bg-blue-600">
                  첨부파일 본문
                </option>
              </select>

              <select
                className="!h-[30px] !w-[55px] !rounded !border !border-[#EBEBEB] !py-1 !text-left !text-xs !font-semibold !text-[var(--color_primary_contrast_default)]"
                value={row.conjunction || 'AND'}
                onChange={e =>
                  updateKeywordRow(row.id, { conjunction: e.target.value as 'AND' | 'OR' })
                }
              >
                <option value="AND" className="!bg-[#999999] !text-white hover:!bg-blue-600">
                  AND
                </option>
                <option value="OR" className="!bg-[#999999] !text-white hover:!bg-blue-600">
                  OR
                </option>
              </select>

              <input
                type="text"
                className="!h-[30px] !w-[179px] !rounded !border !border-[#EBEBEB] !px-3 !py-1 !text-xs !font-semibold !text-[#423F3F] placeholder:!text-gray-300"
                placeholder="키워드를 입력해보세요"
                value={row.keyword}
                onChange={e => updateKeywordRow(row.id, { keyword: e.target.value })}
              />

              <button
                className="!size-[30px] !cursor-pointer !overflow-hidden !rounded-md"
                onClick={() => addKeywordTag(row.id)}
              >
                <Image
                  src="https://542682c8b17017789cc2e977902e8281.cdn.bubble.io/cdn-cgi/image/w=48,h=48,f=auto,dpr=1.5,fit=contain/f1705385303393x142142722905198800/Group%20187.png"
                  alt="Add"
                  width={30}
                  height={30}
                  className="!h-full !w-full !object-cover"
                />
              </button>

              {/* Keyword Tags */}
              <div className="!ml-2 !flex !flex-wrap !gap-1">
                {(keywordTagsByRow[row.id] || []).map((tag, tagIndex) => (
                  <div
                    key={tagIndex}
                    className="!flex !h-[30px] !w-[108px] !items-center !justify-between !rounded-full !bg-[#A6A1DB] !px-5 !py-1 !text-xs !text-white"
                  >
                    <span>{tag}</span>
                    <X
                      size={8}
                      strokeWidth={5}
                      className="!ml-1 !cursor-pointer"
                      onClick={() => removeKeywordTag(row.id, tag)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 제외 키워드 영역 */}
        {isFilterExpanded && (
          <div className="!mb-4 !space-y-2">
            <div className="!flex !items-center">
              <span className="!w-[120px] !max-w-[120px] !min-w-[120px] !flex-grow-1 !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
                제목 제외 키워드
              </span>
              <div className="!flex !items-center !gap-2">
                <input
                  type="text"
                  className="!ml-[-5px] !h-[30px] !w-[225px] !rounded !border !border-[#EBEBEB] !px-3 !py-1 !text-xs !font-semibold !text-[#423F3F] placeholder:!text-gray-300"
                  placeholder="제목에서 제외할 키워드 입력"
                  value={excludeTitleInput}
                  onChange={e => setExcludeTitleInput(e.target.value)}
                  onKeyPress={e => handleKeyPress(e, 'title')}
                />
                <button
                  className="!size-[30px] !cursor-pointer !overflow-hidden !rounded-md"
                  onClick={handleAddExcludeTitleKeyword}
                >
                  <Image
                    src="https://542682c8b17017789cc2e977902e8281.cdn.bubble.io/cdn-cgi/image/w=48,h=48,f=auto,dpr=1.5,fit=contain/f1705391588566x143885163104544580/Group%20187.png"
                    alt="Add"
                    width={30}
                    height={30}
                    className="!h-full !w-full !object-cover"
                  />
                </button>
              </div>

              <div className="!ml-2 !flex !gap-1">
                {excludeTitleKeywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="!flex !h-[30px] !w-[108px] !items-center !justify-between !rounded-full !bg-[#F2989E] !px-5 !py-1 !text-xs !text-white"
                  >
                    <span>{keyword}</span>
                    <X
                      size={8}
                      strokeWidth={5}
                      className="!cursor-pointer"
                      onClick={() => removeExcludeTitleKeyword(keyword)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="!flex !items-center">
              <span className="!w-[120px] !max-w-[120px] !min-w-[120px] !flex-grow-1 !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
                본문 제외 키워드
              </span>
              <div className="!flex !items-center !gap-2">
                <input
                  type="text"
                  className="!ml-[-5px] !h-[30px] !w-[225px] !rounded !border !border-[#EBEBEB] !px-3 !py-1 !text-xs !font-semibold !text-[#423F3F] placeholder:!text-gray-300"
                  placeholder="본문에서 제외할 키워드 입력"
                  value={excludeContentInput}
                  onChange={e => setExcludeContentInput(e.target.value)}
                  onKeyPress={e => handleKeyPress(e, 'content')}
                />
                <button
                  className="!size-[30px] !cursor-pointer !overflow-hidden !rounded-md"
                  onClick={handleAddExcludeContentKeyword}
                >
                  <Image
                    src="https://542682c8b17017789cc2e977902e8281.cdn.bubble.io/cdn-cgi/image/w=48,h=48,f=auto,dpr=1.5,fit=contain/f1705391588566x143885163104544580/Group%20187.png"
                    alt="Add"
                    width={30}
                    height={30}
                    className="!h-full !w-full !object-cover"
                  />
                </button>
              </div>

              <div className="!ml-2 !flex !gap-1">
                {excludeContentKeywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="!flex !h-[30px] !w-[108px] !items-center !justify-between !rounded-full !bg-[#F2989E] !px-5 !py-1 !text-xs !text-white"
                  >
                    <span>{keyword}</span>
                    <X
                      size={8}
                      strokeWidth={5}
                      className="!cursor-pointer"
                      onClick={() => removeExcludeContentKeyword(keyword)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 금액 필터 */}
        {isFilterExpanded && (
          <AmountFilter
            minAmount={minAmount}
            maxAmount={maxAmount}
            setAmountRange={setAmountRange}
            excludeAmount={excludeAmount}
            toggleExcludeAmount={toggleExcludeAmount}
          />
        )}

        {/* 날짜 필터 */}
        {isFilterExpanded && (
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
        )}

        {/* 시간 필터 */}
        {isFilterExpanded && (
          <TimeFilter
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            includeExpired={includeExpired}
            toggleIncludeExpired={toggleIncludeExpired}
          />
        )}

        {/* 사업 구분 */}
        {isFilterExpanded && <BusinessTypeFilter />}

        {/* 조건 체크박스 */}
        {isFilterExpanded && <ConditionCheckboxes />}

        {/* 더보기/접기 & 검색 버튼 */}
        <div className="!relative !mt-4 !min-h-[45px]">
          <div
            className="!absolute !bottom-0 !left-1/2 !flex !-translate-x-1/2 !cursor-pointer !items-center !text-blue-900"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          >
            <span className="!text-sm !font-semibold">
              {isFilterExpanded ? '상세 필터 접기' : '상세 필터 열기'}
            </span>
            {isFilterExpanded ? (
              <ChevronUp size={18} className="!ml-1" />
            ) : (
              <ChevronDown size={18} className="!ml-1" />
            )}
          </div>
          <button
            onClick={handleSearch}
            className="!absolute !top-1/2 !right-0 !flex !h-[45px] !w-[150px] !-translate-y-1/2 !items-center !rounded-md !bg-[#151663] !py-2 !pl-8 !font-bold !text-white"
          >
            <Search size={16} strokeWidth={3} className="!mr-2" />
            검색하기
          </button>
        </div>
      </div>

      {/* 검색 설명 영역 */}
      <div className="!mb-4 !text-center !text-[#364152]">
        공고 제목에서 <span className="!text-[#686FE8]">인공지능</span> 을 포함하고, 사업 구분은{' '}
        <span className="!text-[#6CBAA2]">전체</span> 에 해당하는 공고를 찾습니다.
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
