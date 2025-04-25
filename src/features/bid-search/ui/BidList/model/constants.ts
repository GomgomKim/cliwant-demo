export const TABLE_HEADER_DEFAULT_CLASS =
  'px-6 py-4 text-left text-xs font-medium tracking-wider text-white uppercase h-8';
export const TABLE_HEADER_BG_CLASS = 'bg-[rgb(166,161,219)]';
export const TABLE_DATA_CLASS = 'px-6 py-4 text-sm whitespace-nowrap text-gray-700';

export interface BidTableHeader {
  id: string;
  label: string;
  width?: string;
  className?: string;
}

export const BID_TABLE_HEADERS: BidTableHeader[] = [
  {
    id: 'favorite',
    label: '',
    width: 'w-10',
    className: 'w-10 px-6 py-4',
  },
  {
    id: 'bidType',
    label: '상태',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'title',
    label: '공고명',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'budget',
    label: '금액(원)',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'status',
    label: '구분',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'organization',
    label: '공고기관',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'publishedDate',
    label: '게시일',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'deadline',
    label: '마감일',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'industryCondition',
    label: '업종 조건',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'manufacturingItem',
    label: '제조 물품',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'supplyItem',
    label: '공급 물품',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'locationRestriction',
    label: '지역 제한',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'jointSupply',
    label: '공동수급',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'winnerSelection',
    label: '낙찰자 선정 방식',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'businessRestriction',
    label: '기업 제한',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
  {
    id: 'priceSelection',
    label: '가격 선정 방식',
    className: TABLE_HEADER_DEFAULT_CLASS,
  },
];
