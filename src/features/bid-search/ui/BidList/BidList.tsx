'use client';

import { Check, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';

import { BidItem } from '../../model/types';

import { BID_TABLE_HEADERS, TABLE_DATA_CLASS, TABLE_HEADER_BG_CLASS } from './model/constants';

interface BidListProps {
  bids: BidItem[];
}

export function BidList({ bids }: BidListProps) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  // 상세페이지 이동
  const handleBidClick = (bidId: number) => {
    router.push(`/bids/${bidId}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent, bidId: number) => {
    e.stopPropagation();
    toggleFavorite(bidId);
  };

  const renderCheckbox = () => (
    <div className="flex items-center justify-center">
      <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-[rgba(0,182,27,1)]">
        <Check className="h-4 w-4 text-white" />
      </div>
    </div>
  );

  return (
    <div className="overflow-x-auto rounded-lg bg-white font-['Pretendard'] shadow-md">
      <div className="min-w-max">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className={TABLE_HEADER_BG_CLASS}>
              {BID_TABLE_HEADERS.map(header => (
                <th key={header.id} className={header.className}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {bids.map(bid => (
              <tr
                key={bid.id}
                className="cursor-pointer transition-colors duration-150 odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                onClick={() => handleBidClick(bid.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className={`rounded-full p-1 focus:outline-none ${
                      isFavorite(bid.id) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-300'
                    }`}
                    onClick={e => handleFavoriteClick(e, bid.id)}
                    aria-label={isFavorite(bid.id) ? '관심공고 해제' : '관심공고 등록'}
                  >
                    <Star className={`h-5 w-5 ${isFavorite(bid.id) ? 'fill-yellow-500' : ''}`} />
                  </button>
                </td>
                <td className={TABLE_DATA_CLASS}>
                  <span className="inline-flex items-center rounded-full bg-indigo-100 !px-2 !py-1 text-xs font-semibold text-indigo-800">
                    {bid.bidType}
                  </span>
                </td>
                <td className={TABLE_DATA_CLASS}>
                  <div className="text-sm font-medium text-gray-900">{bid.title}</div>
                </td>
                <td className={TABLE_DATA_CLASS}>{bid.budget}</td>
                <td className={TABLE_DATA_CLASS}>{bid.status}</td>
                <td className={TABLE_DATA_CLASS}>{bid.organization}</td>
                <td className={TABLE_DATA_CLASS}>{bid.publishedDate}</td>
                <td className={TABLE_DATA_CLASS}>{bid.deadline}</td>
                <td className={TABLE_DATA_CLASS}>{renderCheckbox()}</td>
                <td className={TABLE_DATA_CLASS}>{renderCheckbox()}</td>
                <td className={TABLE_DATA_CLASS}>{renderCheckbox()}</td>
                <td className={TABLE_DATA_CLASS}>{renderCheckbox()}</td>
                <td className={TABLE_DATA_CLASS}>문서 참조</td>
                <td className={TABLE_DATA_CLASS}>공고서 참조</td>
                <td className={TABLE_DATA_CLASS}>문서 참조</td>
                <td className={TABLE_DATA_CLASS}>공고서 참조</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
