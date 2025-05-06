'use client';

import { Check, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useFavoriteStore } from '@/features/favorites/model/favoriteStore';

import { BidItem } from '../../model/types';

import { BID_TABLE_HEADERS, TABLE_DATA_CLASS, TABLE_HEADER_BG_CLASS } from './model/constants';

interface BidListProps {
  bids: BidItem[];
}

export function BidList({ bids }: BidListProps) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const tableRef = useRef<HTMLDivElement>(null);

  // 상세페이지 이동
  const handleBidClick = (bidId: number) => {
    router.push(`/bids/${bidId}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent, bidId: number) => {
    e.stopPropagation();
    toggleFavorite(bidId);
  };

  // Set up the horizontal scroll event listener
  useEffect(() => {
    const tableElement = tableRef.current;

    if (!tableElement) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if shift key is pressed
      if (e.shiftKey) {
        e.preventDefault();
        tableElement.scrollLeft += e.deltaY;
      }
    };

    // Using capture phase for better event handling
    tableElement.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      tableElement.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, []);

  const renderCheckbox = () => (
    <div className="flex items-center justify-center">
      <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-[rgba(0,182,27,1)]">
        <Check className="h-4 w-4 text-white" />
      </div>
    </div>
  );

  // Column width settings
  const columnWidths = {
    favorite: '60px',
    index: '60px',
    bidType: '100px',
    title: '350px',
    budget: '150px',
    status: '100px',
    organization: '200px',
    publishedDate: '120px',
    deadline: '120px',
    industryCondition: '120px',
    manufacturingItem: '120px',
    supplyItem: '120px',
    locationRestriction: '120px',
    jointSupply: '100px',
    winnerSelection: '150px',
    businessRestriction: '120px',
    priceSelection: '150px',
  };

  // Common cell style with #202020 text color
  const cellStyle = (columnKey: string) => ({
    whiteSpace: 'pre-wrap' as const,
    overflow: 'visible' as const,
    fontFamily: 'var(--font_default)',
    fontSize: '14px',
    fontWeight: 400,
    color: '#202020',
    lineHeight: 1.4,
    opacity: 1,
    alignSelf: 'center',
    minWidth: columnWidths[columnKey as keyof typeof columnWidths],
    width: columnWidths[columnKey as keyof typeof columnWidths],
    order: 8,
    minHeight: '24px',
    maxHeight: 'none',
    flexGrow: 1,
    height: '24px',
    margin: '0px',
    zIndex: 2,
    padding: '10px 20px',
  });

  return (
    <div
      ref={tableRef}
      className="overflow-x-auto bg-white font-['Pretendard']"
      style={{ maxWidth: '100%', position: 'relative' }}
      onWheel={e => {
        if (e.shiftKey) {
          e.preventDefault();
          if (tableRef.current) {
            tableRef.current.scrollLeft += e.deltaY;
          }
        }
      }}
    >
      {bids.length === 0 ? (
        <div className="flex h-40 w-full items-center justify-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="min-w-max">
          <table className="min-w-full divide-y divide-gray-200" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr
                className={TABLE_HEADER_BG_CLASS}
                style={{
                  background: 'rgb(104, 111, 232)',
                  overflow: 'visible',
                  justifyContent: 'space-between',
                  gap: '0px 20px',
                  padding: '10px 20px',
                  opacity: 1,
                  alignSelf: 'flex-start',
                  minWidth: '1850px',
                  order: 9,
                  minHeight: '0px',
                  height: 53.59,
                  flexGrow: 0,
                  flexShrink: 0,
                  width: 'calc(100% + 0px)',
                  margin: '0px',
                  zIndex: 3,
                }}
              >
                {BID_TABLE_HEADERS.map(header => (
                  <th
                    key={header.id}
                    className={header.className}
                    style={{
                      backgroundColor: 'rgb(104, 111, 232)',
                      overflow: 'visible',
                      justifyContent: 'space-between',
                      gap: '0px 20px',
                      padding: '10px 20px',
                      opacity: 1,
                      alignSelf: 'flex-start',
                      minHeight: '0px',
                      height: 53.59,
                      flexGrow: 0,
                      flexShrink: 0,
                      margin: '0px',
                      zIndex: 3,
                      width: columnWidths[header.id as keyof typeof columnWidths] || '120px',
                      minWidth: columnWidths[header.id as keyof typeof columnWidths] || '120px',
                    }}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bids.map((bid, index) => (
                <tr
                  key={bid.id}
                  className="cursor-pointer transition-colors duration-150 odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                  onClick={() => handleBidClick(bid.id)}
                >
                  {/* Favorite column */}
                  <td style={cellStyle('favorite')}>
                    <Star
                      className={`h-5 w-5 cursor-pointer ${isFavorite(bid.id) ? 'fill-yellow-500 text-yellow-500' : 'fill-gray-300 text-gray-300 hover:fill-yellow-300 hover:text-yellow-300'}`}
                      onClick={e => handleFavoriteClick(e, bid.id)}
                      aria-label={isFavorite(bid.id) ? '관심공고 해제' : '관심공고 등록'}
                    />
                  </td>

                  {/* Index column */}
                  <td style={cellStyle('index')}>{index + 1}</td>

                  {/* Bid Type - now as plain text instead of badge */}
                  <td style={cellStyle('bidType')}>{bid.bidType}</td>

                  {/* Title */}
                  <td style={cellStyle('title')}>
                    <div className="text-sm font-medium">{bid.title}</div>
                  </td>

                  {/* Budget */}
                  <td style={cellStyle('budget')}>{bid.budget}</td>

                  {/* Status - all set to '일반' */}
                  <td style={cellStyle('status')}>일반</td>

                  {/* Other cells with appropriate widths */}
                  {['organization', 'publishedDate', 'deadline'].map(key => (
                    <td key={key} style={cellStyle(key)}>
                      {bid[key as keyof BidItem]}
                    </td>
                  ))}

                  {/* Checkbox columns */}
                  {[
                    'industryCondition',
                    'manufacturingItem',
                    'supplyItem',
                    'locationRestriction',
                  ].map(key => (
                    <td key={key} style={cellStyle(key)}>
                      {renderCheckbox()}
                    </td>
                  ))}

                  {/* Reference columns */}
                  {['jointSupply', 'winnerSelection', 'businessRestriction', 'priceSelection'].map(
                    (key, index) => (
                      <td key={key} style={cellStyle(key)}>
                        {index % 2 === 0 ? '문서 참조' : '공고서 참조'}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
