import { Trash2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
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
    <div className="!overflow-x-auto">
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
                            className="!cursor-pointer!rounded !flex !h-[35px] !w-[155px] !bg-white !p-1.5"
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
                            <span className="!mr-2 !text-sm !text-[#999999]">담당</span>
                            <div
                              className="!clickable-element !bubble-element !Group !baUaZaFt !bubble-r-container !row !flex"
                              style={{
                                boxShadow: 'rgba(170, 170, 170, 0.8) 1px 1px 4px 0px',
                                overflow: 'visible',
                                justifyContent: 'center',
                                gap: '0px',
                                borderRadius: '35px',
                                opacity: '1',
                                cursor: 'pointer',
                                alignSelf: 'center',
                                minWidth: '90px',
                                maxWidth: '90px',
                                order: '2',
                                minHeight: '50px',
                                maxHeight: '50px',
                                width: '90px',
                                flexGrow: '1',
                                height: '50px',
                                margin: '0px',
                                zIndex: '3',
                              }}
                            >
                              <div
                                className="!bubble-element !Group !baUaZaFz !bubble-r-container !column !flex"
                                style={{
                                  overflow: 'visible',
                                  justifyContent: 'flex-start',
                                  borderRadius: '0px',
                                  opacity: '1',
                                  alignSelf: 'flex-start',
                                  minWidth: '0px',
                                  order: '1',
                                  minHeight: '0px',
                                  width: 'max-content',
                                  flexGrow: '0',
                                  height: 'max-content',
                                  margin: '0px',
                                  zIndex: '5',
                                }}
                              ></div>
                              <div
                                className="!bubble-element !Image !baUaZaFx"
                                style={{
                                  borderRadius: '100px',
                                  opacity: '1',
                                  alignSelf: 'center',
                                  minWidth: '30px',
                                  maxWidth: '30px',
                                  order: '2',
                                  width: '30px',
                                  flexGrow: '1',
                                  height: '30px',
                                  margin: '0px',
                                  zIndex: '2',
                                  position: 'relative',
                                  overflow: 'hidden',
                                }}
                              >
                                <Image
                                  src="https://542682c8b17017789cc2e977902e8281.cdn.bubble.io/cdn-cgi/image/w=48,h=48,f=auto,dpr=2,fit=contain/f1704690014412x324776799943939100/blank-profile-picture-973460_960_720.webp"
                                  alt="프로필"
                                  width={30}
                                  height={30}
                                  className="!object-cover"
                                  style={{
                                    borderRadius: '100px',
                                  }}
                                />
                              </div>
                              <div
                                className="!bubble-element !Text !baUaZaFy"
                                style={{
                                  whiteSpace: 'pre-wrap',
                                  overflow: 'visible',
                                  fontFamily: 'var(--font_default)',
                                  fontSize: '10px',
                                  fontWeight: '400',
                                  color: 'var(--color_primary_contrast_default)',
                                  textAlign: 'center',
                                  lineHeight: '1.4',
                                  borderRadius: '0px',
                                  opacity: '1',
                                  alignSelf: 'center',
                                  minWidth: '40px',
                                  maxWidth: '40px',
                                  order: '3',
                                  minHeight: '0px',
                                  maxHeight: '48px',
                                  width: '40px',
                                  flexGrow: '1',
                                  height: 'max-content',
                                  margin: '0px 0px 0px 5px',
                                  zIndex: '4',
                                }}
                              >
                                <div>{memoData[bid.id]?.담당 || '과제클라이원트'}</div>
                              </div>
                            </div>
                          </div>
                          <div className="!flex !items-center !gap-1">
                            <span className="!mr-2 !text-sm !text-[#999999]">제안 상태</span>
                            <select
                              className="!h-[30px] !w-[150px] !rounded !border !text-xs"
                              value={memoData[bid.id]?.reviewStatus || ''}
                              onChange={e => handleChange(bid.id, 'reviewStatus', e.target.value)}
                            >
                              {REVIEW_STATUS_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="!flex !flex-1 !items-center !gap-1">
                            <span className="!mr-2 !text-sm !text-gray-700">비고</span>
                            <Input
                              className="!w-[150px] !flex-1 px-1"
                              value={memoData[bid.id]?.note || ''}
                              onChange={e => handleChange(bid.id, 'note', e.target.value)}
                              placeholder="필요한 메모를 하세요.."
                            />
                          </div>
                          <button
                            onClick={() => handleEdit(bid.id)}
                            className="!flex !h-[30px] !w-[50px] !cursor-pointer !items-center !justify-center !rounded-lg !bg-[#4D8076] !p-1.5"
                          >
                            <span className="!text-xs !font-bold !text-white">수정</span>
                          </button>
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
