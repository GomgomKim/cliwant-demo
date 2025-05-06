export const TABLE_HEADER_DEFAULT_CLASS =
  'background-color: rgb(104, 111, 232); overflow: visible; justify-content: space-between; gap: 0px 20px; padding: 10px 20px; opacity: 1; align-self: flex-start; min-width: 1850px; order: 9; min-height: 0px; height: 53.59px; flex-grow: 0; flex-shrink: 0; width: calc(100% + 0px); margin: 0px; z-index: 3; text-left text-xs font-medium tracking-wider text-white uppercase';
export const TABLE_HEADER_BG_CLASS = 'bg-[rgb(104,111,232)]';
export const TABLE_DATA_CLASS =
  'white-space: pre-wrap; overflow: visible; font-family: var(--font_default); font-size: 14px; font-weight: 400; color: #202020; line-height: 1.4; opacity: 1; align-self: center; min-width: 35px; max-width: 35px; order: 8; min-height: 24px; max-height: 24px; width: 35px; flex-grow: 1; height: 24px; margin: 0px; z-index: 2; padding: 10px 20px';

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
    id: 'index',
    label: '',
    className: TABLE_HEADER_DEFAULT_CLASS,
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
