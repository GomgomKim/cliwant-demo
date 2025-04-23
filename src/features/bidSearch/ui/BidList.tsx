'use client';

import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';

import { BidItem } from '../model/types';

interface BidListProps {
  bids: BidItem[];
}

export function BidList({ bids }: BidListProps) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  const handleBidClick = (bidId: number) => {
    router.push(`/bids/${bidId}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent, bidId: number) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 중지
    toggleFavorite(bidId);
  };

  return (
    <div className="overflow-x-auto font-['Pretendard']">
      <table className="min-w-full">
        <thead>
          <tr className="bg-[rgb(248,248,250)] text-left border-b">
            <th className="w-10 px-4 py-3"></th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">상태</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">공고명</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">금액(원)</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">구분</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">공고기간</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">게시일</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">마감일</th>
          </tr>
        </thead>
        <tbody>
          {bids.map(bid => (
            <tr
              key={bid.id}
              className="border-b hover:bg-[rgb(248,248,250)] cursor-pointer transition-colors duration-150"
              onClick={() => handleBidClick(bid.id)}
            >
              <td className="px-4 py-3">
                <button
                  className={`p-1 rounded-full focus:outline-none ${
                    isFavorite(bid.id) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-300'
                  }`}
                  onClick={e => handleFavoriteClick(e, bid.id)}
                  aria-label={isFavorite(bid.id) ? '관심공고 해제' : '관심공고 등록'}
                >
                  <Star className={`h-5 w-5 ${isFavorite(bid.id) ? 'fill-yellow-500' : ''}`} />
                </button>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 rounded-full text-xs bg-[rgb(234,234,239)] text-[rgb(166,161,219)]">
                  {bid.bidType}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-[rgb(166,161,219)]">{bid.title}</div>
                <div className="text-xs text-gray-500 mt-1">발주처: {bid.organization}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{bid.budget}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{bid.status}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {bid.publishedDate} ~ {bid.deadline}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{bid.publishedDate}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{bid.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
