export interface FavoriteFilterProps {
  filterBidType: string;
  filterTitle: string;
  filterOrg: string;
  filterBudget: number;
  filterStatus: string;
  showMemo: boolean;
  onFilterBidTypeChange: (value: string) => void;
  onFilterTitleChange: (value: string) => void;
  onFilterOrgChange: (value: string) => void;
  onFilterBudgetChange: (value: number) => void;
  onFilterStatusChange: (value: string) => void;
  onToggleMemo: (value: boolean) => void;
}
