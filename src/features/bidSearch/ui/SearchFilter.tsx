'use client';

import { ChevronDown, Plus, Search, Settings2, Star, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

import { IMAGES } from '@/features/bidSearch/model/constants';
import { useSearchStore } from '@/features/bidSearch/model/searchStore';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';

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
  } = useSearchStore();

  const [startDate, setStartDate] = useState('2025-04-16');
  const [endDate, setEndDate] = useState('2025-04-23');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [excludeTitleInput, setExcludeTitleInput] = useState('');
  const [excludeContentInput, setExcludeContentInput] = useState('');

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
      // 이렇게 하면 사용자가 직접 입력하는 경우에는 덮어쓰지 않음
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

  const handleFilterTypeChange = (type: 'shared' | 'personal') => {
    setFilterType(type);
  };

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

  // 추가 - 키워드 태그 관리를 위한 상태 및 함수
  // 각 행마다 자체 태그 목록을 관리하기 위해 객체로 변경
  const [keywordTagsByRow, setKeywordTagsByRow] = useState<Record<string, string[]>>({});

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
  };

  const handleSearch = () => {
    // 현재 검색 필터 상태를 모아서 객체로 전달
    const allTags = Object.values(keywordTagsByRow).flat();

    const filters = {
      keywords: [
        // 키워드 행에서 입력된 키워드 (비어있지 않은 것만)
        ...keywordRows
          .filter(row => row.keyword.trim() !== '')
          .map(row => ({
            searchField: row.searchField || 'title',
            conjunction: row.conjunction,
            keyword: row.keyword,
          })),
        // 태그로 추가된 키워드들도 검색어로 포함
        ...allTags.map(tag => ({
          searchField: 'title' as const, // 태그는 기본적으로 제목 검색으로 설정
          conjunction: 'OR' as const,
          keyword: tag,
        })),
      ],
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

    console.log('Search filters:', filters);

    // 상위 컴포넌트로 필터 상태 전달
    if (onSearch) {
      onSearch(filters);
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

  return (
    <div className="rounded-lg border shadow bg-white">
      <div className="p-4 border-b flex justify-end items-center">
        <span className="text-sm ">검색 결과 개수</span>
        <select className="border rounded px-2 py-1 w-16 text-sm ml-2 ">
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <Button className="bg-[rgb(166,161,219)] hover:bg-[rgb(146,141,199)] text-white ml-2 text-xs rounded-md ">
          저장
        </Button>
      </div>

      {/* 검색 필터 영역 */}
      <div className="p-4 bg-white !mb-5">
        {/* 검색 조건 선택 */}
        <div className="flex items-center gap-2 !mb-6">
          <div className="flex">
            <button
              className={cn(
                'h-[30px] text-xs font-bold py-0 px-[10px] rounded-full opacity-100 self-center min-w-0 w-max flex-grow-0 m-0 border-0 cursor-pointer whitespace-pre-wrap overflow-visible text-center leading-tight font-["Pretendard"]',
                filterType === 'shared'
                  ? 'shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] bg-[rgb(166,161,219)] text-white z-[4]'
                  : 'shadow-[0px_2px_4px_0px_rgb(255,255,255)] bg-[rgb(234,234,234)] text-[rgb(102,102,102)] z-[3]'
              )}
              onClick={() => handleFilterTypeChange('shared')}
            >
              공유
            </button>
            <button
              className={cn(
                'h-[30px] text-xs font-bold py-0 px-[10px] rounded-full opacity-100 self-center min-w-0 w-max flex-grow-0 m-0 border-0 cursor-pointer whitespace-pre-wrap overflow-visible text-center leading-tight font-["Pretendard"]',
                filterType === 'personal'
                  ? 'shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] bg-[rgb(166,161,219)] text-white z-[4]'
                  : 'shadow-[0px_2px_4px_0px_rgb(255,255,255)] bg-[rgb(234,234,234)] text-[rgb(102,102,102)] z-[3]'
              )}
              onClick={() => handleFilterTypeChange('personal')}
            >
              개인
            </button>
          </div>

          <div className="relative ml-4">
            <div
              className="flex items-center gap-2 border border-gray-300 rounded-md p-2 bg-white cursor-pointer min-w-[180px]"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium ">
                {selectedSet?.name || '키워드 그룹 선택'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  {filteredKeywordSets.length > 0 ? (
                    filteredKeywordSets.map(set => (
                      <div
                        key={set.id}
                        className={cn(
                          'px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150 font-["Pretendard"]',
                          selectedKeywordSetId === set.id ? 'bg-gray-50' : ''
                        )}
                        onClick={() => {
                          selectKeywordSet(set.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Star
                          className={cn(
                            'h-4 w-4',
                            selectedKeywordSetId === set.id
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          )}
                        />
                        <span className="text-sm">{set.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 ">
                      {filterType === 'shared'
                        ? '공유된 키워드 세트가 없습니다'
                        : '개인 키워드 세트가 없습니다'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button variant="outline" className="ml-2 text-sm  text-gray-700 border-gray-300">
            임시 조건 저장
          </Button>

          <Button
            variant="outline"
            className="ml-2 text-sm  text-gray-700 border-gray-300"
            onClick={resetKeywords}
          >
            키워드 초기화
          </Button>

          <Button variant="ghost" className="ml-2 p-1 text-gray-500">
            <Settings2 size={18} />
          </Button>
        </div>

        {/* 키워드 행 */}
        <div className="space-y-3 !mb-6">
          {keywordRows.map((row, index) => (
            <div key={row.id} className="flex items-center">
              <Select
                value={row.searchField || 'title'}
                onValueChange={value =>
                  updateKeywordRow(row.id, { searchField: value as 'title' | 'content' })
                }
              >
                <SelectTrigger className="w-[130px] h-[30px] mr-[10px] z-10 bg-[#4285F4] text-white font-semibold text-xs border-none ">
                  <SelectValue>
                    {row.searchField === 'title' ? '공고 제목' : '첨부파일 본문'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#505050] text-white border-none">
                  <SelectItem
                    value="title"
                    className="text-white focus:bg-[#4285F4] focus:text-white px-4 py-2"
                  >
                    <span className="pl-4">공고 제목</span>
                  </SelectItem>
                  <SelectItem
                    value="content"
                    className="text-white focus:bg-[#4285F4] focus:text-white px-4 py-2"
                  >
                    <span className="pl-4">첨부파일 본문</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={row.conjunction}
                onValueChange={value => updateKeywordRow(row.id, { conjunction: value as any })}
              >
                <SelectTrigger className="w-[55px] h-[30px] !mx-[20px] z-10 text-white text-xs border-none">
                  <SelectValue placeholder="조건" />
                </SelectTrigger>
                <SelectContent className="bg-[#505050] text-white border-none">
                  <SelectItem value="AND" className="text-white focus:text-white px-4 py-2">
                    <span className="pl-4">AND</span>
                  </SelectItem>
                  <SelectItem value="OR" className="text-white focus:text-white px-4 py-2">
                    <span className="pl-4">OR</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="relative flex items-center">
                <Input
                  value={row.keyword}
                  onChange={e => updateKeywordRow(row.id, { keyword: e.target.value })}
                  placeholder="키워드를 입력해보세요"
                  className="flex w-[180px]  bg-white self-center min-h-[30px] h-[30px] m-0 z-[4] border-solid border border-[#ebebeb] rounded-[5px] font-[var(--font_default)] text-xs font-semibold text-[#423F3F] p-[6px] pr-10 opacity-100"
                />
                <Button
                  variant="ghost"
                  className="flex rounded-[5px] cursor-pointer ml-1"
                  onClick={() => addKeywordTag(row.id)}
                  title="키워드 추가"
                >
                  <Image
                    src={IMAGES.PLUS_BUTTON}
                    width={24}
                    height={24}
                    alt="추가"
                    className="h-6 w-6"
                  />
                </Button>
              </div>

              {/* 각 행별 태그 표시 영역을 같은 줄에 배치 */}
              {keywordTagsByRow[row.id] && keywordTagsByRow[row.id].length > 0 && (
                <div className="flex flex-wrap gap-2 !ml-4">
                  {keywordTagsByRow[row.id].map((tag, tagIndex) => (
                    <div
                      key={tagIndex}
                      className="bg-[#a6a1db] self-center !rounded-[20px] opacity-100 !py-1 !px-4 text-white flex items-center"
                    >
                      <span className="text-xs font-medium">{tag}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1.5 p-0 h-auto text-white hover:text-gray-100 rounded-full cursor-pointer"
                        onClick={() => removeKeywordTag(row.id, tag)}
                        aria-label={`태그 삭제: ${tag}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 제외 키워드 영역 */}
        <div className="space-y-4 !mb-6">
          <div className="flex flex-col pb-3">
            <span className="self-start min-w-[120px] max-w-[120px] mb-2 h-[30px] z-[4] whitespace-pre-wrap overflow-visible text-[14px] font-bold text-[#939393] leading-[1.4] rounded-none opacity-100">
              제목 제외 키워드
            </span>
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="제목에서 제외할 키워드 입력"
                    className="w-full  bg-white self-center min-h-[30px] h-[30px] m-0 z-[4] border-solid border border-[#ebebeb] rounded-[5px] font-[var(--font_default)] text-xs font-semibold text-[#423F3F] p-[6px] pr-10 opacity-100"
                    value={excludeTitleInput}
                    onChange={e => setExcludeTitleInput(e.target.value)}
                    onKeyPress={e => handleKeyPress(e, 'title')}
                  />
                  <Button
                    variant="ghost"
                    className="absolute right-0 mr-[-5px] self-center min-w-[30px] max-w-[30px] order-5 min-h-[30px] max-h-[30px] w-[30px] flex-grow h-[30px] ml-[5px] z-[2] rounded-[5px]"
                    onClick={handleAddExcludeTitleKeyword}
                  >
                    <Image
                      src={IMAGES.PLUS_BUTTON}
                      width={24}
                      height={24}
                      alt="추가"
                      className="h-6 w-6"
                    />
                  </Button>
                </div>
              </div>

              {excludeTitleKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {excludeTitleKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="bg-[#F2989E] self-start min-w-0 order-2 min-h-0 w-max flex-none h-max mr-[5px] z-[4] overflow-visible justify-start rounded-[20px] opacity-100 py-[4px] px-[10px] text-white flex items-center"
                    >
                      <span className="text-xs font-medium">{keyword}</span>
                      <button
                        className="ml-1.5 p-0.5 text-white hover:text-gray-100 rounded-full"
                        onClick={() => removeExcludeTitleKeyword(keyword)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col pb-3">
            <span className="self-start min-w-[120px] max-w-[120px] mb-2 h-[30px] z-[4] whitespace-pre-wrap overflow-visible font-[var(--font_default)] text-[14px] font-bold text-[#939393] leading-[1.4] rounded-none opacity-100">
              본문 제외 키워드
            </span>
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="본문에서 제외할 키워드 입력"
                    className="w-full  bg-white self-center min-h-[30px] h-[30px] m-0 z-[4] border-solid border border-[#ebebeb] rounded-[5px] font-[var(--font_default)] text-xs font-semibold text-[#423F3F] p-[6px] pr-10 opacity-100"
                    value={excludeContentInput}
                    onChange={e => setExcludeContentInput(e.target.value)}
                    onKeyPress={e => handleKeyPress(e, 'content')}
                  />
                  <Button
                    variant="ghost"
                    className="absolute right-0 mr-[-5px] self-center min-w-[30px] max-w-[30px] order-5 min-h-[30px] max-h-[30px] w-[30px] flex-grow h-[30px] ml-[5px] z-[2] rounded-[5px]"
                    onClick={handleAddExcludeContentKeyword}
                  >
                    <Image
                      src={IMAGES.PLUS_BUTTON}
                      width={24}
                      height={24}
                      alt="추가"
                      className="h-6 w-6"
                    />
                  </Button>
                </div>
              </div>

              {excludeContentKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {excludeContentKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="bg-[#F2989E] self-start min-w-0 order-2 min-h-0 w-max flex-none h-max mr-[5px] z-[4] overflow-visible justify-start rounded-[20px] opacity-100 py-[4px] px-[10px] text-white flex items-center"
                    >
                      <span className="text-xs font-medium">{keyword}</span>
                      <button
                        className="ml-1.5 p-0.5 text-white hover:text-gray-100 rounded-full"
                        onClick={() => removeExcludeContentKeyword(keyword)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 금액 필터 */}
        <div className="flex items-center gap-2 !mb-4">
          <span className="self-center min-w-[120px] max-w-[120px] order-1 h-[30px] m-0 z-[4] whitespace-pre-wrap overflow-visible font-[var(--font_default)] text-[14px] font-bold text-[#939393] leading-[1.4] rounded-none opacity-100">
            사업 금액
          </span>
          <Input
            type="number"
            value={minAmount}
            onChange={e => setAmountRange(Number(e.target.value), maxAmount)}
            className="w-36 "
          />
          <span className="">~</span>
          <Input
            type="number"
            value={maxAmount}
            onChange={e => setAmountRange(minAmount, Number(e.target.value))}
            className="w-36 "
          />
          <div className="flex items-center ml-4">
            <Checkbox
              id="exclude-amount"
              checked={excludeAmount}
              onCheckedChange={() => toggleExcludeAmount()}
              className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
            />
            <label htmlFor="exclude-amount" className="ml-2 text-sm text-gray-700 ">
              금액 제한 없음
            </label>
          </div>
        </div>

        {/* 날짜 필터 */}
        <div className="flex items-center gap-2 !mb-4">
          <span className="self-center min-w-[120px] max-w-[120px] order-1 h-[30px] m-0 z-[4] whitespace-pre-wrap overflow-visible font-[var(--font_default)] text-[14px] font-bold text-[#939393] leading-[1.4] rounded-none opacity-100">
            공고일
          </span>
          <Input
            type="date"
            value={startDate}
            onChange={e => {
              setStartDate(e.target.value);
              setTimeFilter('custom'); // 날짜 직접 입력하면 custom으로 변경
            }}
            className="w-40 bg-gray-50 "
          />
          <span className="">~</span>
          <Input
            type="date"
            value={endDate}
            onChange={e => {
              setEndDate(e.target.value);
              setTimeFilter('custom'); // 날짜 직접 입력하면 custom으로 변경
            }}
            className="w-40 bg-gray-50 "
          />
          <div className="flex items-center ml-4">
            <Checkbox
              id="include-expired"
              checked={includeExpired}
              onCheckedChange={() => toggleIncludeExpired()}
              className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
            />
            <label htmlFor="include-expired" className="ml-2 text-sm text-gray-700 ">
              마감일 지난 공고 포함
            </label>
          </div>
        </div>

        {/* 시간 필터 */}
        <div className="flex items-center mb-4">
          <div className="flex gap-8">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="day"
                name="timeFilter"
                value="day"
                checked={timeFilter === 'day'}
                onChange={() => {
                  setTimeFilter('day');
                }}
                className="w-4 h-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="day" className="text-sm text-gray-700 ">
                하루 전
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="week"
                name="timeFilter"
                value="week"
                checked={timeFilter === 'week'}
                onChange={() => {
                  setTimeFilter('week');
                }}
                className="w-4 h-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="week" className="text-sm text-gray-700 ">
                일주일 전
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="month"
                name="timeFilter"
                value="month"
                checked={timeFilter === 'month'}
                onChange={() => {
                  setTimeFilter('month');
                }}
                className="w-4 h-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="month" className="text-sm text-gray-700 ">
                한 달 전
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="all"
                name="timeFilter"
                value="all"
                checked={timeFilter === 'all'}
                onChange={() => {
                  setTimeFilter('all');
                }}
                className="w-4 h-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="all" className="text-sm text-gray-700 ">
                전체 기간
              </label>
            </div>
          </div>
        </div>

        {/* 사업 구분 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="self-center min-w-[120px] max-w-[120px] order-1 h-[30px] m-0 z-[4] whitespace-pre-wrap overflow-visible font-[var(--font_default)] text-[14px] font-bold text-[#939393] leading-[1.4] rounded-none opacity-100">
            사업 구분
          </span>
          <select className="border rounded-md px-3 py-2 w-48 text-sm bg-gray-50 ">
            <option value="all">전체</option>
            <option value="current">현재</option>
            <option value="company">기업 제한</option>
          </select>
          <span className="text-gray-600 w-24 ml-8 text-sm font-medium ">정렬 기준</span>
          <select className="border rounded-md px-3 py-2 w-48 text-sm bg-gray-50 ">
            <option value="relevance">정확도 순</option>
            <option value="date">날짜 순</option>
            <option value="amount">금액 순</option>
          </select>
        </div>

        {/* 조건 체크박스 */}
        <div className="flex items-start mb-6">
          <span className="self-center min-w-[120px] max-w-[120px] order-1 h-[30px] m-0 z-[4] whitespace-pre-wrap overflow-visible font-[var(--font_default)] text-[14px] font-bold text-[#939393] leading-[1.4] rounded-none opacity-100">
            조건
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-center">
              <Checkbox
                id="condition1"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition1" className="ml-2 text-sm text-gray-700 ">
                업종조건 충족
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="condition2"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition2" className="ml-2 text-sm text-gray-700 ">
                물품조건 충족
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="condition3"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition3" className="ml-2 text-sm text-gray-700 ">
                공동수급 허용
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="condition4"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition4" className="ml-2 text-sm text-gray-700 ">
                실적제한 없음
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="condition5"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition5" className="ml-2 text-sm text-gray-700 ">
                인증제한 없음
              </label>
            </div>
          </div>
        </div>

        {/* 검색 버튼 */}
        <div className="flex justify-center mt-8 mb-4">
          <Button
            className="bg-[rgb(166,161,219)] hover:bg-[rgb(146,141,199)] px-10 py-2.5 flex items-center gap-2 rounded-md transition-all duration-200  cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02]"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
            <span className="font-medium">검색하기</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
