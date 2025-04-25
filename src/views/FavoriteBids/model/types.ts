import { BidItem } from '@/features/bidSearch/model/types';

export type FavoriteBid = BidItem;

export type SortKey = 'budget' | 'publishedDate' | 'deadline';

export interface TableHeader {
  id: string;
  label: string;
  sortable: boolean;
  key?: SortKey;
}

export interface FavoriteBidsTableProps {
  bids: FavoriteBid[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortKey: SortKey | null;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
  onDelete: (id: number) => void;
}
