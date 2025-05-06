import { Plus, Trash2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Toast } from '@/shared/ui/Toast';

import { REVIEW_STATUS_OPTIONS, TABLE_HEADERS } from '../model/constants';
import { FavoriteBidsTableProps } from '../model/types';

export function FavoriteBidsTable({
  bids,
  sortKey,
  sortAsc,
  onSort,
  onDelete,
  showMemo,
}: Omit<FavoriteBidsTableProps, 'currentPage' | 'totalPages' | 'onPageChange'>) {
  const router = useRouter();
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

  // Toast 상태 관리
  const [showToast, setShowToast] = useState(false);

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

  const handleEdit = (id: number) => {
    console.log('수정', memoData[id]);
    setShowToast(true);
  };

  return (
    <div className="!overflow-x-auto !shadow-sm">
      <Toast
        title="수정되었습니다"
        icon={<CheckCircle className="!h-5 !w-5 !text-green-600" />}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        position="top"
        autoCloseTime={2000}
      />

      {bids.length > 0 ? (
        <div className="!max-h-[600px] !overflow-y-auto">
          <table className="!min-w-full !divide-y !divide-gray-200">
            <thead className="!sticky !top-0 !z-10 !h-8 !bg-[#676FE7]">
              <tr className="!text-white">
                {TABLE_HEADERS.map(header => (
                  <th
                    key={header.id}
                    className={`!px-6 !py-3 !text-left !text-xs !font-medium !uppercase${
                      header.sortable ? '!hover:bg-[#5A63D1] !cursor-pointer' : ''
                    }`}
                  >
                    <div className="!flex !items-center !gap-1">
                      {header.label}
                      {header.sortable && (
                        <div className="!flex !flex-col !items-center">
                          <button
                            onClick={() => onSort(header.key!)}
                            className={`!cursor-pointer !p-0.5 !text-white hover:!text-gray-200 ${
                              sortKey === header.key && sortAsc ? '!text-gray-200' : ''
                            }`}
                          >
                            <div className="!h-0 !w-0 !cursor-pointer !border-r-[3px] !border-b-[4px] !border-l-[3px] !border-r-transparent !border-b-white !border-l-transparent"></div>
                          </button>
                          <button
                            onClick={() => onSort(header.key!)}
                            className={`!cursor-pointer !p-0.5 !text-white hover:!text-gray-200 ${
                              sortKey === header.key && !sortAsc ? '!text-gray-200' : ''
                            }`}
                          >
                            <div className="!h-0 !w-0 !cursor-pointer !border-t-[4px] !border-r-[3px] !border-l-[3px] !border-t-white !border-r-transparent !border-l-transparent"></div>
                          </button>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="!divide-y !divide-gray-200 !bg-white">
              {bids.map(bid => (
                <React.Fragment key={bid.id}>
                  <tr
                    onClick={() => router.push(`/bids/${bid.id}`)}
                    className="!hover:bg-gray-50 !cursor-pointer"
                  >
                    {TABLE_HEADERS.map(header => {
                      switch (header.id) {
                        case 'bidType':
                          return (
                            <td key="bidType" className="!px-6 !py-4 !text-sm !text-gray-700">
                              {bid.bidType}
                            </td>
                          );
                        case 'status':
                          return (
                            <td key="status" className="!px-6 !py-4 !text-sm !text-gray-700">
                              {bid.status}
                            </td>
                          );
                        case 'title':
                          return (
                            <td key="title" className="!px-6 !py-4 !text-sm !text-gray-900">
                              {bid.title}
                            </td>
                          );
                        case 'budget':
                          return (
                            <td key="budget" className="!px-6 !py-4 !text-sm !text-gray-700">
                              {bid.budget}
                            </td>
                          );
                        case 'organization':
                          return (
                            <td key="organization" className="!px-6 !py-4 !text-sm !text-gray-700">
                              {bid.organization}
                            </td>
                          );
                        case 'publishedDate':
                          return (
                            <td key="publishedDate" className="!px-6 !py-4 !text-sm !text-gray-700">
                              {bid.publishedDate}
                            </td>
                          );
                        case 'deadline':
                          return (
                            <td key="deadline" className="!px-6 !py-4 !text-sm !text-gray-700">
                              {bid.deadline}
                            </td>
                          );
                        case 'delete':
                          return (
                            <td key="delete" className="!px-6 !py-4 !text-sm !text-gray-700">
                              <Button
                                variant="unstyled"
                                onClick={e => {
                                  e.stopPropagation();
                                  onDelete(bid.id);
                                }}
                                className="!p-0"
                              >
                                <Trash2 className="!h-5 !w-5 !text-black" />
                              </Button>
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}
                  </tr>
                  {showMemo && (
                    <tr>
                      <td colSpan={TABLE_HEADERS.length} className="!px-6 !py-4">
                        <div className="!flex !flex-wrap !items-center !gap-4">
                          <button
                            onClick={() => handleAddTag(bid.id)}
                            className="!flex !h-[35px] !w-[35px] !cursor-pointer !items-center !justify-center !rounded !bg-white !p-1.5"
                          >
                            <Image src="/pencil.svg" alt="태그 추가" width={12} height={12} />
                          </button>
                          <div className="!flex !min-w-[180px] !gap-2">
                            {memoData[bid.id]?.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="!rounded-full !bg-indigo-100 !px-2 !py-1 !text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="!flex !items-center !gap-1">
                            <span className="!mr-2 !text-sm !text-gray-700">담당</span>
                            <Input
                              className="!w-32"
                              value={memoData[bid.id]?.담당 || ''}
                              onChange={e => handleChange(bid.id, '담당', e.target.value)}
                            />
                          </div>
                          <Select
                            value={memoData[bid.id]?.reviewStatus || ''}
                            onValueChange={val => handleChange(bid.id, 'reviewStatus', val)}
                          >
                            <SelectTrigger className="!w-40">
                              <SelectValue placeholder="제안 상태" />
                            </SelectTrigger>
                            <SelectContent className="!border !border-gray-200 !bg-white !text-black !shadow-md">
                              {REVIEW_STATUS_OPTIONS.map(opt => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="!flex !flex-1 !items-center !gap-1">
                            <span className="!mr-2 !text-sm !text-gray-700">비고</span>
                            <Input
                              className="!flex-1"
                              value={memoData[bid.id]?.note || ''}
                              onChange={e => handleChange(bid.id, 'note', e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={() => handleEdit(bid.id)}
                            className="!cursor-pointer !px-3 !py-1"
                            variant="purple"
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
        </div>
      ) : (
        <div className="!py-8 !text-center !text-gray-500">
          <div className="!mb-2">관심 공고가 없습니다.</div>
          <div className="!text-sm">
            입찰 검색에서 관심 있는 공고를 찾아 별표 아이콘을 클릭하여 추가하세요.
          </div>
        </div>
      )}
    </div>
  );
}
