'use client';

import { ChevronDown, Plus, Search, Settings2, Star, X, Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

import { IMAGES } from '@/features/bidSearch/model/constants';
import { useSearchStore, KeywordRow } from '@/features/bidSearch/model/searchStore';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Toast } from '@/shared/ui/Toast';

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

    // Show toast notification
    setShowResetToast(true);
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

  // 그룹 복사 핸들러
  const copyGroup = () => {
    if (!selectedKeywordSetId) return;
    const currentSet = savedKeywordSets.find(set => set.id === selectedKeywordSetId);
    if (!currentSet) return;
    // 같은 이름 사용 (복사 표시 삭제)
    const newName = currentSet.name;
    // isShared 반대로 설정하여 복사
    saveCurrentSet(newName, !currentSet.isShared);

    // Set toast message based on current filter type
    const toastMessage =
      filterType === 'shared' ? '개인 그룹으로 복사되었습니다' : '공용 그룹으로 복사되었습니다';
    setCopyToastMessage(toastMessage);
    setShowCopyToast(true);
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
          <div className="flex">
            <Button
              variant="unstyled"
              size="none"
              className={cn(
                '!h-[30px] !cursor-pointer !rounded-full !px-[10px] !text-xs !font-bold',
                filterType === 'shared'
                  ? '!z-[4] !bg-[rgb(166,161,219)] !text-white'
                  : '!z-[3] !bg-[rgb(234,234,234)] !text-[rgb(102,102,102)]'
              )}
              onClick={() => handleFilterTypeChange('shared')}
            >
              공유
            </Button>
            <Button
              variant="unstyled"
              size="none"
              className={cn(
                '!ml-2 !h-[30px] !cursor-pointer !rounded-full !px-[10px] !text-xs !font-bold',
                filterType === 'personal'
                  ? '!z-[4] !bg-[rgb(166,161,219)] !text-white'
                  : '!z-[3] !bg-[rgb(234,234,234)] !text-[rgb(102,102,102)]'
              )}
              onClick={() => handleFilterTypeChange('personal')}
            >
              개인
            </Button>
          </div>

          <div className="relative ml-4">
            <div
              className="flex min-w-[180px] cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white p-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{selectedSet?.name || '키워드 그룹 선택'}</span>
              <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
            </div>

            {isDropdownOpen && (
              <div className="!absolute !top-full !left-0 !z-50 !mt-1 !w-64 !rounded-md !border !border-gray-200 !bg-white !shadow-lg !backdrop-blur-sm">
                <div className="py-1">
                  {filteredKeywordSets.length > 0 ? (
                    filteredKeywordSets.map(set => (
                      <div
                        key={set.id}
                        className={cn(
                          '!flex !cursor-pointer !items-center !gap-2 !px-3 !py-2 !font-["Pretendard"] !transition-colors !duration-150 hover:!bg-gray-100',
                          selectedKeywordSetId === set.id ? '!bg-gray-50' : ''
                        )}
                        onClick={() => {
                          selectKeywordSet(set.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Star
                          className={cn(
                            '!h-4 !w-4',
                            selectedKeywordSetId === set.id
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          )}
                        />
                        <span className="text-sm">{set.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {filterType === 'shared'
                        ? '공유된 키워드 세트가 없습니다'
                        : '개인 키워드 세트가 없습니다'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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
          {keywordRows.map((row, _) => (
            <div key={row.id} className="!flex !items-center">
              <Select
                value={row.searchField || 'title'}
                onValueChange={value =>
                  updateKeywordRow(row.id, { searchField: value as 'title' | 'content' })
                }
              >
                <SelectTrigger className="!z-10 !mr-[10px] !h-[30px] !w-[130px] !border-none !text-xs !font-semibold">
                  <SelectValue>
                    {row.searchField === 'title' ? '공고 제목' : '첨부파일 본문'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#505050] !px-2 !py-1">
                  <SelectItem value="title">
                    <span className="pl-4">공고 제목</span>
                  </SelectItem>
                  <SelectItem value="content">
                    <span className="pl-4">첨부파일 본문</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* 개별 conjunction 선택 컴포넌트 복원 */}
              <Select
                value={row.conjunction}
                onValueChange={value => updateKeywordRow(row.id, { conjunction: value as any })}
              >
                <SelectTrigger className="!z-10 !mx-[20px] !h-[30px] !w-[55px] !border-none !text-xs">
                  <SelectValue placeholder="조건" />
                </SelectTrigger>
                <SelectContent className="bg-[#505050]!px-2 !py-1">
                  <SelectItem value="AND">
                    <span className="pl-4">AND</span>
                  </SelectItem>
                  <SelectItem value="OR">
                    <span className="pl-4">OR</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="relative flex items-center">
                <Input
                  value={row.keyword}
                  onChange={e => updateKeywordRow(row.id, { keyword: e.target.value })}
                  placeholder="키워드를 입력해보세요"
                  className="!z-[4] !mr-4 !flex !h-[30px] !min-h-[30px] !w-[180px] !self-center !rounded-[5px] !border !border-solid !border-[#ebebeb] !bg-white !p-[6px] !pr-10 !text-xs !font-[var(--font_default)] !font-semibold !text-[#423F3F] !opacity-100"
                />
                <Button
                  variant="ghost"
                  className="!ml-1 !flex !cursor-pointer !rounded-[5px]"
                  onClick={() => addKeywordTag(row.id)}
                  title="키워드 추가"
                >
                  <Image
                    src={IMAGES.PLUS_BUTTON}
                    width={24}
                    height={24}
                    alt="추가"
                    className="!h-6 !w-6"
                  />
                </Button>
              </div>

              {/* 각 행별 태그 표시 영역을 같은 줄에 배치 */}
              {keywordTagsByRow[row.id] && keywordTagsByRow[row.id].length > 0 && (
                <div className="!ml-4 !flex !flex-wrap !gap-2">
                  {keywordTagsByRow[row.id].map((tag, tagIndex) => (
                    <div
                      key={tagIndex}
                      className="!flex !items-center !self-center !rounded-[20px] !bg-[#a6a1db] !px-4 !py-1 !text-white !opacity-100"
                    >
                      <span className="!text-xs !font-medium">{tag}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!hover:text-gray-100 !ml-1.5 !h-auto !cursor-pointer !rounded-full !p-0 !text-white"
                        onClick={() => removeKeywordTag(row.id, tag)}
                        aria-label={`태그 삭제: ${tag}`}
                      >
                        <X className="!h-3.5 !w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 제외 키워드 영역 */}
        <div className="!mb-6 space-y-4">
          <div className="flex flex-col pb-3">
            <span className="!z-[4] !mb-2 !h-[30px] !max-w-[120px] !min-w-[120px] !self-start !overflow-visible !rounded-none !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[#939393] !opacity-100">
              제목 제외 키워드
            </span>
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="relative max-w-md flex-1">
                  <Input
                    placeholder="제목에서 제외할 키워드 입력"
                    className="!z-[4] !m-0 !h-[30px] !min-h-[30px] !w-full !self-center !rounded-[5px] !border !border-solid !border-[#ebebeb] !bg-white !p-[6px] !pr-10 !text-xs !font-[var(--font_default)] !font-semibold !text-[#423F3F] !opacity-100"
                    value={excludeTitleInput}
                    onChange={e => setExcludeTitleInput(e.target.value)}
                    onKeyPress={e => handleKeyPress(e, 'title')}
                  />
                  <Button
                    variant="ghost"
                    className="!absolute !right-0 !z-[2] !order-5 !mr-[-5px] !ml-[5px] !h-[30px] !max-h-[30px] !min-h-[30px] !w-[30px] !max-w-[30px] !min-w-[30px] !flex-grow !self-center !rounded-[5px]"
                    onClick={handleAddExcludeTitleKeyword}
                  >
                    <Image
                      src={IMAGES.PLUS_BUTTON}
                      width={24}
                      height={24}
                      alt="추가"
                      className="!h-6 !w-6"
                    />
                  </Button>
                </div>
              </div>

              {excludeTitleKeywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {excludeTitleKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="!z-[4] !order-2 !mr-[5px] !flex !h-max !min-h-0 !w-max !min-w-0 !flex-none !items-center !justify-start !self-start !overflow-visible !rounded-[20px] !bg-[#F2989E] !px-[10px] !py-[4px] !text-white !opacity-100"
                    >
                      <span className="!text-xs !font-medium">{keyword}</span>
                      <button
                        className="!hover:text-gray-100 !ml-1.5 !rounded-full !p-0.5 !text-white"
                        onClick={() => removeExcludeTitleKeyword(keyword)}
                      >
                        <X className="!h-3.5 !w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col pb-3">
            <span className="!z-[4] !mb-2 !h-[30px] !max-w-[120px] !min-w-[120px] !self-start !overflow-visible !rounded-none !text-[14px] !leading-[1.4] !font-[var(--font_default)] !font-bold !whitespace-pre-wrap !text-[#939393] !opacity-100">
              본문 제외 키워드
            </span>
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="relative max-w-md flex-1">
                  <Input
                    placeholder="본문에서 제외할 키워드 입력"
                    className="!z-[4] !m-0 !h-[30px] !min-h-[30px] !w-full !self-center !rounded-[5px] !border !border-solid !border-[#ebebeb] !bg-white !p-[6px] !pr-10 !text-xs !font-[var(--font_default)] !font-semibold !text-[#423F3F] !opacity-100"
                    value={excludeContentInput}
                    onChange={e => setExcludeContentInput(e.target.value)}
                    onKeyPress={e => handleKeyPress(e, 'content')}
                  />
                  <Button
                    variant="ghost"
                    className="!absolute !right-0 !z-[2] !order-5 !mr-[-5px] !ml-[5px] !h-[30px] !max-h-[30px] !min-h-[30px] !w-[30px] !max-w-[30px] !min-w-[30px] !flex-grow !self-center !rounded-[5px]"
                    onClick={handleAddExcludeContentKeyword}
                  >
                    <Image
                      src={IMAGES.PLUS_BUTTON}
                      width={24}
                      height={24}
                      alt="추가"
                      className="!h-6 !w-6"
                    />
                  </Button>
                </div>
              </div>

              {excludeContentKeywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {excludeContentKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="!z-[4] !order-2 !mr-[5px] !flex !h-max !min-h-0 !w-max !min-w-0 !flex-none !items-center !justify-start !self-start !overflow-visible !rounded-[20px] !bg-[#F2989E] !px-[10px] !py-[4px] !text-white !opacity-100"
                    >
                      <span className="!text-xs !font-medium">{keyword}</span>
                      <button
                        className="!hover:text-gray-100 !ml-1.5 !rounded-full !p-0.5 !text-white"
                        onClick={() => removeExcludeContentKeyword(keyword)}
                      >
                        <X className="!h-3.5 !w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 금액 필터 */}
        <div className="!mb-4 flex items-center gap-2">
          <span className="z-[4] order-1 m-0 h-[30px] max-w-[120px] min-w-[120px] self-center overflow-visible rounded-none text-[14px] leading-[1.4] font-[var(--font_default)] font-bold whitespace-pre-wrap text-[#939393] opacity-100">
            사업 금액
          </span>
          <Input
            type="number"
            value={minAmount}
            onChange={e => setAmountRange(Number(e.target.value), maxAmount)}
            className="w-36"
          />
          <span className="">~</span>
          <Input
            type="number"
            value={maxAmount}
            onChange={e => setAmountRange(minAmount, Number(e.target.value))}
            className="w-36"
          />
          <div className="ml-4 flex items-center">
            <Checkbox
              id="exclude-amount"
              checked={excludeAmount}
              onCheckedChange={() => toggleExcludeAmount()}
              className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
            />
            <label htmlFor="exclude-amount" className="!ml-2 !text-sm !text-gray-700">
              금액 제한 없음
            </label>
          </div>
        </div>

        {/* 날짜 필터 */}
        <div className="!mb-4 flex items-center gap-2">
          <span className="z-[4] order-1 m-0 h-[30px] max-w-[120px] min-w-[120px] self-center overflow-visible rounded-none text-[14px] leading-[1.4] font-[var(--font_default)] font-bold whitespace-pre-wrap text-[#939393] opacity-100">
            공고일
          </span>
          <Input
            type="date"
            value={startDate}
            onChange={e => {
              setStartDate(e.target.value);
              setTimeFilter('custom'); // 날짜 직접 입력하면 custom으로 변경
            }}
            className="w-40 bg-gray-50"
          />
          <span className="">~</span>
          <Input
            type="date"
            value={endDate}
            onChange={e => {
              setEndDate(e.target.value);
              setTimeFilter('custom'); // 날짜 직접 입력하면 custom으로 변경
            }}
            className="w-40 bg-gray-50"
          />
          <div className="ml-4 flex items-center">
            <Checkbox
              id="include-expired"
              checked={includeExpired}
              onCheckedChange={() => toggleIncludeExpired()}
              className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
            />
            <label htmlFor="include-expired" className="!ml-2 !text-sm !text-gray-700">
              마감일 지난 공고 포함
            </label>
          </div>
        </div>

        {/* 시간 필터 */}
        <div className="mb-4 flex items-center">
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
                className="h-4 w-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="day" className="text-sm text-gray-700">
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
                className="h-4 w-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="week" className="text-sm text-gray-700">
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
                className="h-4 w-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="month" className="text-sm text-gray-700">
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
                className="h-4 w-4 text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="all" className="text-sm text-gray-700">
                전체 기간
              </label>
            </div>
          </div>
        </div>

        {/* 사업 구분 */}
        <div className="mb-4 flex items-center gap-2">
          <span className="z-[4] order-1 m-0 h-[30px] max-w-[120px] min-w-[120px] self-center overflow-visible rounded-none text-[14px] leading-[1.4] font-[var(--font_default)] font-bold whitespace-pre-wrap text-[#939393] opacity-100">
            사업 구분
          </span>
          <select className="w-48 rounded-md border bg-gray-50 px-3 py-2 text-sm">
            <option value="all">전체</option>
            <option value="current">현재</option>
            <option value="company">기업 제한</option>
          </select>
          <span className="ml-8 w-24 text-sm font-medium text-gray-600">정렬 기준</span>
          <select className="w-48 rounded-md border bg-gray-50 px-3 py-2 text-sm">
            <option value="relevance">정확도 순</option>
            <option value="date">날짜 순</option>
            <option value="amount">금액 순</option>
          </select>
        </div>

        {/* 조건 체크박스 */}
        <div className="mb-6 flex items-start">
          <span className="z-[4] order-1 m-0 h-[30px] max-w-[120px] min-w-[120px] self-center overflow-visible rounded-none text-[14px] leading-[1.4] font-[var(--font_default)] font-bold whitespace-pre-wrap text-[#939393] opacity-100">
            조건
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-center">
              <Checkbox
                id="condition1"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition1" className="!ml-2 !text-sm !text-gray-700">
                업종조건 충족
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="condition2"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition2" className="!ml-2 !text-sm !text-gray-700">
                물품조건 충족
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="condition3"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition3" className="!ml-2 !text-sm !text-gray-700">
                공동수급 허용
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="condition4"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition4" className="!ml-2 !text-sm !text-gray-700">
                실적제한 없음
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="condition5"
                className="text-[rgb(166,161,219)] focus:ring-[rgb(166,161,219)]"
              />
              <label htmlFor="condition5" className="!ml-2 !text-sm !text-gray-700">
                인증제한 없음
              </label>
            </div>
          </div>
        </div>

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
