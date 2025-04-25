import { Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';

import { Pagination } from '@/features/bid-search/ui';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';

import { TABLE_HEADERS } from '../model/constants';
import { BUDGET_OPTIONS } from '../model/constants';
import { STATUS_OPTIONS, BID_TYPE_OPTIONS } from '../model/constants';
import { REVIEW_STATUS_OPTIONS } from '../model/constants';
import { FavoriteBidsTableProps } from '../model/types';

export function FavoriteBidsTable({
  bids,
  currentPage,
  totalPages,
  onPageChange,
  sortKey,
  sortAsc,
  onSort,
  onDelete,
  showMemo,
}: FavoriteBidsTableProps) {
  // memo data state
  const [memoData, setMemoData] = useState<
    Record<
      number,
      {
        tags: string[];
        담당: string;
        reviewStatus: string;
        note: string;
      }
    >
  >({});

  const handleAddTag = (id: number) => {
    const tag = prompt('추가할 태그 입력');
    if (tag) {
      setMemoData(prev => ({
        ...prev,
        [id]: {
          ...(prev[id] || { tags: [], 담당: '', reviewStatus: '', note: '' }),
          tags: [...(prev[id]?.tags || []), tag],
        },
      }));
    }
  };

  const handleChange = (id: number, field: keyof (typeof memoData)[number], value: string) => {
    setMemoData(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { tags: [], 담당: '', reviewStatus: '', note: '' }),
        [field]: value,
      },
    }));
  };

  return (
    <div className="overflow-x-auto rounded-lg bg-white p-6 shadow-sm">
      {bids.length > 0 ? (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="h-8">
              <tr className="bg-[rgb(166,161,219)] text-white">
                {TABLE_HEADERS.map(header => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase${
                      header.sortable ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => header.sortable && onSort(header.key!)}
                  >
                    {header.label}
                    {header.sortable && sortKey === header.key ? (sortAsc ? ' ▲' : ' ▼') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bids.map(bid => (
                <React.Fragment key={bid.id}>
                  <tr className="hover:bg-gray-50">
                    {TABLE_HEADERS.map(header => {
                      switch (header.id) {
                        case 'bidType':
                          return (
                            <td key="bidType" className="px-6 py-4 text-sm text-gray-700">
                              {bid.bidType}
                            </td>
                          );
                        case 'status':
                          return (
                            <td key="status" className="px-6 py-4 text-sm text-gray-700">
                              {bid.status}
                            </td>
                          );
                        case 'title':
                          return (
                            <td key="title" className="px-6 py-4 text-sm text-gray-900">
                              {bid.title}
                            </td>
                          );
                        case 'budget':
                          return (
                            <td key="budget" className="px-6 py-4 text-sm text-gray-700">
                              {bid.budget}
                            </td>
                          );
                        case 'organization':
                          return (
                            <td key="organization" className="px-6 py-4 text-sm text-gray-700">
                              {bid.organization}
                            </td>
                          );
                        case 'publishedDate':
                          return (
                            <td key="publishedDate" className="px-6 py-4 text-sm text-gray-700">
                              {bid.publishedDate}
                            </td>
                          );
                        case 'deadline':
                          return (
                            <td key="deadline" className="px-6 py-4 text-sm text-gray-700">
                              {bid.deadline}
                            </td>
                          );
                        case 'delete':
                          return (
                            <td key="delete" className="px-6 py-4 text-sm text-gray-700">
                              <button onClick={() => onDelete(bid.id)}>
                                <Trash2 className="h-5 w-5 text-black" />
                              </button>
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}
                  </tr>
                  {showMemo && (
                    <tr className="bg-gray-100">
                      <td colSpan={TABLE_HEADERS.length} className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <button
                            onClick={() => handleAddTag(bid.id)}
                            className="flex items-center gap-1 text-blue-600"
                          >
                            <Plus className="h-4 w-4" /> 태그 추가
                          </button>
                          <div className="flex gap-2">
                            {memoData[bid.id]?.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-indigo-100 px-2 py-1 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Input
                            placeholder="담당"
                            className="w-32"
                            value={memoData[bid.id]?.담당 || ''}
                            onChange={e => handleChange(bid.id, '담당', e.target.value)}
                          />
                          <Select
                            value={memoData[bid.id]?.reviewStatus || ''}
                            onValueChange={val => handleChange(bid.id, 'reviewStatus', val)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="제안 상태" />
                            </SelectTrigger>
                            <SelectContent>
                              {REVIEW_STATUS_OPTIONS.map(opt => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="비고"
                            className="flex-1"
                            value={memoData[bid.id]?.note || ''}
                            onChange={e => handleChange(bid.id, 'note', e.target.value)}
                          />
                          <Button
                            onClick={() => console.log('수정', memoData[bid.id])}
                            className="px-3 py-1"
                          >
                            수정
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <div className="mb-2">관심 공고가 없습니다.</div>
          <div className="text-sm">
            입찰 검색에서 관심 있는 공고를 찾아 별표 아이콘을 클릭하여 추가하세요.
          </div>
        </div>
      )}
    </div>
  );
}
