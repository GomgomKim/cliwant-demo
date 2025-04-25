// Common className for all headers (except the first one which has width)
export const TABLE_HEADER_DEFAULT_CLASS =
  'px-6 py-4 text-left text-xs font-medium tracking-wider text-white uppercase';

// Background color for the header row
export const TABLE_HEADER_BG_CLASS = 'bg-[rgb(166,161,219)]';

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
];
