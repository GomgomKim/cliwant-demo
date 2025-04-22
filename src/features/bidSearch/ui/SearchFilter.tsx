'use client';

import { ChevronUp, Plus, Search, Settings } from 'lucide-react';
import { useState } from 'react';

import { useSearchStore } from '@/features/bidSearch/model/searchStore';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Tag } from '@/shared/ui/tag';

export const SearchFilter = () => {
  const {
    searchMode,
    setSearchMode,
    filterType,
    setFilterType,
    keywordRows,
    addKeywordRow,
    updateKeywordRow,
    minAmount,
    maxAmount,
    setAmountRange,
    excludeAmount,
    toggleExcludeAmount,
    timeFilter,
    setTimeFilter,
    savedKeywordSets,
    conditions,
    setCondition,
    projectCategory,
    setProjectCategory,
    companyLimit,
    setCompanyLimit,
    sortOrder,
    setSortOrder,
  } = useSearchStore();

  const [startDateStr, setStartDateStr] = useState<string>('2025-04-15');
  const [endDateStr, setEndDateStr] = useState<string>('2025-04-22');

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* 탭 메뉴 */}
      <div className="flex gap-6 mb-6 border-b">
        <button className="text-blue-600 font-medium pb-2 border-b-2 border-blue-600">
          입찰 공고
        </button>
        <button className="text-gray-500 pb-2">사전 규격</button>
        <button className="text-gray-500 pb-2">발주 계획</button>
        <button className="text-gray-500 pb-2">유찰 공고</button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm">검색 결과 개수</span>
          <select className="border rounded px-2 py-1 w-20 text-sm">
            <option value="10">10</option>
            <option value="20" selected>
              20
            </option>
            <option value="50">50</option>
          </select>
          <Button className="bg-blue-600">저장</Button>
        </div>
      </div>

      {/* 검색 모드 토글 */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={searchMode === 'simple' ? 'default' : 'outline'}
          className={
            searchMode === 'simple' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''
          }
          onClick={() => setSearchMode('simple')}
        >
          간편 검색
        </Button>
        <Button
          variant={searchMode === 'ai' ? 'default' : 'outline'}
          className={searchMode === 'ai' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
          onClick={() => setSearchMode('ai')}
        >
          AI 검색
        </Button>
        <Button
          variant={searchMode === 'advanced' ? 'default' : 'outline'}
          className={searchMode === 'advanced' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
          onClick={() => setSearchMode('advanced')}
        >
          고급 검색
        </Button>
      </div>

      {/* 검색 필터 영역 */}
      <div className="space-y-4">
        {/* 검색 조건 선택 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className={`rounded-full ${filterType === 'shared' ? 'bg-blue-100' : ''}`}
            onClick={() => setFilterType('shared')}
          >
            공유
          </Button>
          <Button
            variant="outline"
            className={`rounded-full ${filterType === 'personal' ? 'bg-blue-100' : ''}`}
            onClick={() => setFilterType('personal')}
          >
            개인
          </Button>

          <div className="flex items-center gap-2 ml-4 border rounded-md p-2">
            <span className="text-blue-800">⭐</span>
            <span>
              {savedKeywordSets.find(set => set.id === 'default')?.name ||
                '신규_그룹_요즘_2024_11_15'}
            </span>
            <span className="text-gray-400">▼</span>
          </div>

          <Button variant="outline" className="ml-2">
            임시 조건 저장
          </Button>

          <Button variant="ghost" className="ml-2 p-1">
            <Settings size={18} />
          </Button>
        </div>

        {/* 키워드 행 */}
        {keywordRows.map((row, index) => (
          <div key={row.id} className="flex items-center gap-2">
            <select
              className="border rounded px-2 py-2 w-32"
              value={row.conjunction}
              onChange={e => updateKeywordRow(row.id, { conjunction: e.target.value as any })}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>

            <Input
              value={row.keyword}
              onChange={e => updateKeywordRow(row.id, { keyword: e.target.value })}
              placeholder="키워드를 입력해보세요"
              className="flex-1"
            />

            <Button variant="ghost" className="p-1" onClick={() => addKeywordRow()}>
              <Plus className="text-blue-600" size={20} />
            </Button>

            {index === 0 && (
              <Tag
                variant="primary"
                className="bg-blue-100 text-blue-800"
                onRemove={() => updateKeywordRow(row.id, { keyword: '' })}
              >
                인증지능
              </Tag>
            )}
          </div>
        ))}

        {/* 추가 키워드 영역 */}
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <span className="text-gray-600">제목 제외 키워드</span>
            <Input placeholder="제목에서 제외할 키워드 입력" className="mt-1 w-96" />
            <Button variant="ghost" className="p-1">
              <Plus className="text-blue-600" size={20} />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <span className="text-gray-600">본문 제외 키워드</span>
            <Input placeholder="본문에서 제외할 키워드 입력" className="mt-1 w-96" />
            <Button variant="ghost" className="p-1">
              <Plus className="text-blue-600" size={20} />
            </Button>
          </div>
        </div>

        {/* 금액 필터 */}
        <div className="flex items-center gap-2">
          <div className="w-24">사업 금액</div>
          <Input
            type="number"
            value={minAmount}
            onChange={e => setAmountRange(Number(e.target.value), maxAmount)}
            className="w-32"
          />
          <span>~</span>
          <Input
            type="number"
            value={maxAmount}
            onChange={e => setAmountRange(minAmount, Number(e.target.value))}
            className="w-32"
          />
          <input
            type="checkbox"
            id="excludeAmount"
            checked={excludeAmount}
            onChange={() => toggleExcludeAmount()}
          />
          <label htmlFor="excludeAmount" className="text-sm">
            금액 제한 없음
          </label>
        </div>

        {/* 날짜 필터 */}
        <div className="flex items-center gap-2">
          <div className="w-24">공고일</div>
          <Input
            type="date"
            value={startDateStr}
            onChange={e => setStartDateStr(e.target.value)}
            className="w-44"
          />
          <span>~</span>
          <Input
            type="date"
            value={endDateStr}
            onChange={e => setEndDateStr(e.target.value)}
            className="w-44"
          />
          <input type="checkbox" id="excludeExpired" />
          <label htmlFor="excludeExpired" className="text-sm">
            마감일 지난 공고 포함
          </label>
        </div>

        {/* 시간 필터 */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="timeFilter"
                id="day"
                value="day"
                checked={timeFilter === 'day'}
                onChange={() => setTimeFilter('day')}
              />
              <label htmlFor="day" className="ml-2">
                하루 전
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="timeFilter"
                id="week"
                value="week"
                checked={timeFilter === 'week'}
                onChange={() => setTimeFilter('week')}
              />
              <label htmlFor="week" className="ml-2">
                일주일 전
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="timeFilter"
                id="month"
                value="month"
                checked={timeFilter === 'month'}
                onChange={() => setTimeFilter('month')}
              />
              <label htmlFor="month" className="ml-2">
                한 달 전
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="timeFilter"
                id="year"
                value="year"
                checked={timeFilter === 'year'}
                onChange={() => setTimeFilter('year')}
              />
              <label htmlFor="year" className="ml-2">
                일 년 전
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="timeFilter"
                id="all"
                value="all"
                checked={timeFilter === 'all'}
                onChange={() => setTimeFilter('all')}
              />
              <label htmlFor="all" className="ml-2">
                전체 조회
              </label>
            </div>
          </div>
        </div>

        {/* 추가 필터 */}
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-24">사업 구분</div>
            <select
              className="border rounded px-2 py-2 w-full"
              value={projectCategory}
              onChange={e => setProjectCategory(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="goods">물품</option>
              <option value="construction">공사</option>
              <option value="service">용역</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-24">기업 체한</div>
            <select
              className="border rounded px-2 py-2 w-full"
              value={companyLimit}
              onChange={e => setCompanyLimit(e.target.value)}
            >
              <option value="none">전체 보기</option>
              <option value="small">중소기업</option>
              <option value="medium">중견기업</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-24">정렬 기준</div>
            <select
              className="border rounded px-2 py-2 w-full"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="relevance">정확도</option>
              <option value="latest">최신순</option>
              <option value="deadline">마감임박순</option>
            </select>
          </div>
        </div>

        {/* 조건 체크박스 */}
        <div className="flex items-center gap-4 mt-4">
          <div className="w-24">조건</div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bidConditionMet"
                checked={conditions.bidConditionMet}
                onChange={e => setCondition('bidConditionMet', e.target.checked)}
              />
              <label htmlFor="bidConditionMet" className="ml-2">
                입찰조건 충족
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="itemConditionMet"
                checked={conditions.itemConditionMet}
                onChange={e => setCondition('itemConditionMet', e.target.checked)}
              />
              <label htmlFor="itemConditionMet" className="ml-2">
                물품조건 충족
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="jointSupplyAllowed"
                checked={conditions.jointSupplyAllowed}
                onChange={e => setCondition('jointSupplyAllowed', e.target.checked)}
              />
              <label htmlFor="jointSupplyAllowed" className="ml-2">
                공동수급 허용
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="noPerformanceLimit"
                checked={conditions.noPerformanceLimit}
                onChange={e => setCondition('noPerformanceLimit', e.target.checked)}
              />
              <label htmlFor="noPerformanceLimit" className="ml-2">
                실적제한 없음
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="noCertificationLimit"
                checked={conditions.noCertificationLimit}
                onChange={e => setCondition('noCertificationLimit', e.target.checked)}
              />
              <label htmlFor="noCertificationLimit" className="ml-2">
                인증제한 없음
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 버튼 영역 */}
      <div className="flex justify-center mt-6">
        <Button className="flex items-center gap-2 bg-white text-gray-500 border shadow">
          상세 필터 접기 <ChevronUp size={16} />
        </Button>
      </div>

      <div className="flex justify-end mt-6">
        <Button className="bg-blue-900 hover:bg-blue-800 text-white px-10">
          <Search size={16} className="mr-2" /> 검색하기
        </Button>
      </div>
    </div>
  );
};
