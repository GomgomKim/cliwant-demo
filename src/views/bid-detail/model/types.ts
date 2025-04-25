import { BidItem } from '@/features/bid-search/model/types';

export interface InfoItem {
  label: string;
  value: string;
}

export interface RestrictionItem {
  title: string;
  certificationLabel: string;
  certificationCount: number;
  statusText: string;
  guideButtons: string[];
}

export interface BidDetail {
  data: BidItem & { cost: number };
  qualificationsNote: string;
}
