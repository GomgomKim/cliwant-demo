import { Trash2 } from 'lucide-react';
import React from 'react';

import { Pagination } from '@/features/bidSearch/ui';

import { TABLE_HEADERS } from '../model/constants';
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
}: FavoriteBidsTableProps) {
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
                <tr key={bid.id} className="hover:bg-gray-50">
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
