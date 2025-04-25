import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';

export function BusinessTypeFilter() {
  return (
    <div className="!mb-6 !rounded-lg !bg-white !p-4 !shadow-sm">
      <div className="!grid !grid-cols-1 !gap-6 md:!grid-cols-2">
        <div className="!flex !items-center !gap-4">
          <span className="!min-w-[80px] !text-sm !font-semibold !text-gray-700">사업 구분</span>
          <Select defaultValue="all">
            <SelectTrigger className="!flex-1 !rounded-md !border !border-gray-200 !bg-gray-50 !px-4 !py-2 !text-sm !shadow-sm hover:!border-[rgb(166,161,219)]">
              <SelectValue placeholder="사업 구분" />
            </SelectTrigger>
            <SelectContent className="!rounded-md !border !border-gray-200 !shadow-md">
              <SelectItem value="all" className="!px-4 !py-2.5">
                전체
              </SelectItem>
              <SelectItem value="current" className="!px-4 !py-2.5">
                현재
              </SelectItem>
              <SelectItem value="company" className="!px-4 !py-2.5">
                기업 제한
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="!flex !items-center !gap-4">
          <span className="!min-w-[80px] !text-sm !font-semibold !text-gray-700">정렬 기준</span>
          <Select defaultValue="relevance">
            <SelectTrigger className="!flex-1 !rounded-md !border !border-gray-200 !bg-gray-50 !px-4 !py-2 !text-sm !shadow-sm hover:!border-[rgb(166,161,219)]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent className="!rounded-md !border !border-gray-200 !shadow-md">
              <SelectItem value="relevance" className="!px-4 !py-2.5">
                정확도 순
              </SelectItem>
              <SelectItem value="date" className="!px-4 !py-2.5">
                날짜 순
              </SelectItem>
              <SelectItem value="amount" className="!px-4 !py-2.5">
                금액 순
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
