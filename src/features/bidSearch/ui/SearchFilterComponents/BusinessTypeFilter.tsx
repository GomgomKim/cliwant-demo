import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';

export function BusinessTypeFilter() {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="z-[4] order-1 m-0 h-[30px] max-w-[120px] min-w-[120px] self-center overflow-visible rounded-none text-[14px] leading-[1.4] font-[var(--font_default)] font-bold whitespace-pre-wrap text-[#939393] opacity-100">
        사업 구분
      </span>
      <Select defaultValue="all">
        <SelectTrigger className="!w-48 !rounded-md !border !bg-gray-50 !px-3 !py-2 !text-sm">
          <SelectValue placeholder="사업 구분" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="current">현재</SelectItem>
          <SelectItem value="company">기업 제한</SelectItem>
        </SelectContent>
      </Select>
      <span className="ml-8 w-24 text-sm font-medium text-gray-600">정렬 기준</span>
      <Select defaultValue="relevance">
        <SelectTrigger className="!w-48 !rounded-md !border !bg-gray-50 !px-3 !py-2 !text-sm">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">정확도 순</SelectItem>
          <SelectItem value="date">날짜 순</SelectItem>
          <SelectItem value="amount">금액 순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
