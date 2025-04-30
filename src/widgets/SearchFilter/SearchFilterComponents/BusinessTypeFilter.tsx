import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';

export function BusinessTypeFilter() {
  return (
    <div className="!mb-6 !flex !flex-wrap !items-center">
      <div className="!flex !items-center">
        <span className="!w-[120px] !max-w-[120px] !min-w-[120px] !flex-grow-1 !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
          사업 구분
        </span>
        <Select defaultValue="all">
          <SelectTrigger className="!w-[75px] !rounded !border !border-gray-200 !bg-white !px-2 !py-1 !text-sm !text-gray-900">
            <SelectValue placeholder="사업 구분" className="!text-gray-900" />
          </SelectTrigger>
          <SelectContent className="!rounded !border !border-gray-200 !bg-white">
            <SelectItem value="all" className="!px-2 !py-1 !text-gray-900">
              전체
            </SelectItem>
            <SelectItem value="service" className="!px-2 !py-1 !text-gray-900">
              용역
            </SelectItem>
            <SelectItem value="goods" className="!px-2 !py-1 !text-gray-900">
              물품
            </SelectItem>
            <SelectItem value="construction" className="!px-2 !py-1 !text-gray-900">
              공사
            </SelectItem>
            <SelectItem value="foreign" className="!px-2 !py-1 !text-gray-900">
              외자
            </SelectItem>
            <SelectItem value="other" className="!px-2 !py-1 !text-gray-900">
              기타
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="!ml-[25px] !flex !items-center">
        <span className="!w-[120px] !max-w-[120px] !min-w-[120px] !flex-grow-1 !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
          기업 제한
        </span>
        <Select defaultValue="all">
          <SelectTrigger className="!w-[120px] !rounded !border !border-gray-200 !bg-white !px-2 !py-1 !text-sm !text-gray-900">
            <SelectValue placeholder="기업 제한" className="!text-gray-900" />
          </SelectTrigger>
          <SelectContent className="!rounded !border !border-gray-200 !bg-white">
            <SelectItem value="all" className="!px-2 !py-1 !text-gray-900">
              전체 보기
            </SelectItem>
            <SelectItem value="doc_reference" className="!px-2 !py-1 !text-gray-900">
              문서 참조 필요
            </SelectItem>
            <SelectItem value="large_company_restricted" className="!px-2 !py-1 !text-gray-900">
              대기업 참여 불가
            </SelectItem>
            <SelectItem value="large_company_allowed" className="!px-2 !py-1 !text-gray-900">
              대기업 참여 가능
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="!ml-[5px] !flex !items-center">
        <span className="!w-[120px] !max-w-[120px] !min-w-[120px] !flex-grow-1 !overflow-visible !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[rgb(147,147,147)]">
          정렬 기준
        </span>
        <Select defaultValue="accuracy">
          <SelectTrigger className="!w-[140px] !rounded !border !border-gray-200 !bg-white !px-2 !py-1 !text-sm !text-gray-900">
            <SelectValue placeholder="정렬 기준" className="!text-gray-900" />
          </SelectTrigger>
          <SelectContent className="!rounded !border !border-gray-200 !bg-white">
            <SelectItem value="accuracy" className="!px-2 !py-1 !text-gray-900">
              정확도
            </SelectItem>
            <SelectItem value="published_desc" className="!px-2 !py-1 !text-gray-900">
              게시일 내림차순
            </SelectItem>
            <SelectItem value="published_asc" className="!px-2 !py-1 !text-gray-900">
              게시일 오름차순
            </SelectItem>
            <SelectItem value="deadline_desc" className="!px-2 !py-1 !text-gray-900">
              마감일 내림차순
            </SelectItem>
            <SelectItem value="deadline_asc" className="!px-2 !py-1 !text-gray-900">
              마감일 오름차순
            </SelectItem>
            <SelectItem value="amount_desc" className="!px-2 !py-1 !text-gray-900">
              금액 내림차순
            </SelectItem>
            <SelectItem value="amount_asc" className="!px-2 !py-1 !text-gray-900">
              금액 오름차순
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
