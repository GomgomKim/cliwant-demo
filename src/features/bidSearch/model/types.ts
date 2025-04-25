export interface BidItem {
  id: number;
  title: string;
  organization: string;
  budget: string;
  deadline: string;
  publishedDate: string;
  status: string; // 용역, 물품, 공사, 기타 등
  bidType: string; // 입찰, 제한입찰 등
  isFavorite?: boolean;
  description?: string; // 첨부파일 본문에 해당하는 상세 설명
}
