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
