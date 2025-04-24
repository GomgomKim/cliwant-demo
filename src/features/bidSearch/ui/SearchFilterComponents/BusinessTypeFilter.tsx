export function BusinessTypeFilter() {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="z-[4] order-1 m-0 h-[30px] max-w-[120px] min-w-[120px] self-center overflow-visible rounded-none text-[14px] leading-[1.4] font-[var(--font_default)] font-bold whitespace-pre-wrap text-[#939393] opacity-100">
        사업 구분
      </span>
      <select className="w-48 rounded-md border bg-gray-50 px-3 py-2 text-sm">
        <option value="all">전체</option>
        <option value="current">현재</option>
        <option value="company">기업 제한</option>
      </select>
      <span className="ml-8 w-24 text-sm font-medium text-gray-600">정렬 기준</span>
      <select className="w-48 rounded-md border bg-gray-50 px-3 py-2 text-sm">
        <option value="relevance">정확도 순</option>
        <option value="date">날짜 순</option>
        <option value="amount">금액 순</option>
      </select>
    </div>
  );
}
