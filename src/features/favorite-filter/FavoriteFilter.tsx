'use client';

import React from 'react';

import { Checkbox } from '@/shared/ui/Checkbox';

import { BID_TYPE_OPTIONS, STATUS_OPTIONS, BUDGET_OPTIONS } from './model/constants';
import { FavoriteFilterProps } from './model/types';

export function FavoriteFilter({
  filterBidType,
  filterTitle,
  filterOrg,
  filterBudget,
  filterStatus,
  showMemo,
  onFilterBidTypeChange,
  onFilterTitleChange,
  onFilterOrgChange,
  onFilterBudgetChange,
  onFilterStatusChange,
  onToggleMemo,
}: FavoriteFilterProps) {
  return (
    <div className="mb-6 grid grid-cols-6 items-center gap-4">
      {/* 공고 단계 */}
      <select
        className="border px-3 py-2"
        value={filterBidType}
        onChange={e => onFilterBidTypeChange(e.target.value)}
      >
        <option value="">공고 단계</option>
        {BID_TYPE_OPTIONS.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* 공고명 */}
      <input
        type="text"
        placeholder="공고명"
        className="border px-3 py-2"
        value={filterTitle}
        onChange={e => onFilterTitleChange(e.target.value)}
      />
      {/* 기관 */}
      <input
        type="text"
        placeholder="기관"
        className="border px-3 py-2"
        value={filterOrg}
        onChange={e => onFilterOrgChange(e.target.value)}
      />
      {/* 금액 */}
      <select
        className="border px-3 py-2"
        value={filterBudget}
        onChange={e => onFilterBudgetChange(Number(e.target.value))}
      >
        {BUDGET_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* 구분 */}
      <select
        className="border px-3 py-2"
        value={filterStatus}
        onChange={e => onFilterStatusChange(e.target.value)}
      >
        <option value="">구분</option>
        {STATUS_OPTIONS.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* 메모 표시 */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="show-memo"
          checked={showMemo}
          onCheckedChange={val => onToggleMemo(!!val)}
          className="!bg-[#0175FF]"
        />
        <label htmlFor="show-memo" className="text-sm text-gray-700">
          메모 표시
        </label>
      </div>
    </div>
  );
}
