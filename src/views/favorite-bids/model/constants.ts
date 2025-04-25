import { TableHeader } from './types';

export const TABLE_HEADERS: TableHeader[] = [
  { id: 'bidType', label: '공고 단계', sortable: false },
  { id: 'status', label: '구분', sortable: false },
  { id: 'title', label: '공고명', sortable: false },
  { id: 'budget', label: '금액', sortable: true, key: 'budget' },
  { id: 'organization', label: '공고기관', sortable: false },
  { id: 'publishedDate', label: '게시일', sortable: true, key: 'publishedDate' },
  { id: 'deadline', label: '마감일', sortable: true, key: 'deadline' },
  { id: 'delete', label: '삭제', sortable: false },
];

export const ITEMS_PER_PAGE = 10;

// Filter options
export const BID_TYPE_OPTIONS = ['입찰 공고', '사전 규격', '발주 계획', '유찰 공고'];
export const STATUS_OPTIONS = ['용역', '물품', '공사', '외자', '기타'];
export const BUDGET_OPTIONS = [
  { label: '금액', value: 0 },
  { label: '1억원 이상', value: 100000000 },
  { label: '3억원 이상', value: 300000000 },
  { label: '5억원 이상', value: 500000000 },
  { label: '10억원 이상', value: 1000000000 },
];

// Memo row 제안 상태 옵션
export const REVIEW_STATUS_OPTIONS: string[] = [
  '검토 중',
  '검토 완료 - 제안 가능',
  '검토 완료 - 제안 불가',
  '검토 완료 - 제안 유보',
  '입찰 - 진행',
  '결과 - 수주',
  '결과 - 실주',
  '결과 - 유찰',
];
