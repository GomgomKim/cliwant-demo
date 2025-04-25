import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';

export function BusinessTypeFilter() {
  return (
    <div className="!mb-6 !rounded-lg !bg-white !p-4 !shadow-sm">
      <div className="!flex !flex-col md:!flex-row md:!flex-wrap md:!items-center md:!gap-8">
        <div className="!flex !items-center">
          <span className="!min-w-[80px] !text-left !text-sm !font-semibold !text-gray-700">
            사업 구분
          </span>
          <Select defaultValue="all">
            <SelectTrigger className="!w-48 !rounded-md !border !border-gray-200 !bg-gray-50 !px-4 !py-2 !text-sm !text-gray-900 !shadow-sm hover:!border-[rgb(166,161,219)]">
              <SelectValue placeholder="사업 구분" className="!text-gray-900" />
            </SelectTrigger>
            <SelectContent className="!rounded-md !border !border-gray-200 !bg-white !shadow-md">
              <SelectItem value="all" className="!px-4 !py-2.5 !text-gray-900">
                전체
              </SelectItem>
              <SelectItem value="service" className="!px-4 !py-2.5 !text-gray-900">
                용역
              </SelectItem>
              <SelectItem value="goods" className="!px-4 !py-2.5 !text-gray-900">
                물품
              </SelectItem>
              <SelectItem value="construction" className="!px-4 !py-2.5 !text-gray-900">
                공사
              </SelectItem>
              <SelectItem value="foreign" className="!px-4 !py-2.5 !text-gray-900">
                외자
              </SelectItem>
              <SelectItem value="other" className="!px-4 !py-2.5 !text-gray-900">
                기타
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="!flex !items-center">
          <span className="!min-w-[80px] !text-left !text-sm !font-semibold !text-gray-700">
            기업 제한
          </span>
          <Select defaultValue="all">
            <SelectTrigger className="!w-48 !rounded-md !border !border-gray-200 !bg-gray-50 !px-4 !py-2 !text-sm !text-gray-900 !shadow-sm hover:!border-[rgb(166,161,219)]">
              <SelectValue placeholder="기업 제한" className="!text-gray-900" />
            </SelectTrigger>
            <SelectContent className="!rounded-md !border !border-gray-200 !bg-white !shadow-md">
              <SelectItem value="all" className="!px-4 !py-2.5 !text-gray-900">
                전체 보기
              </SelectItem>
              <SelectItem value="doc_reference" className="!px-4 !py-2.5 !text-gray-900">
                문서 참조 필요
              </SelectItem>
              <SelectItem value="large_company_restricted" className="!px-4 !py-2.5 !text-gray-900">
                대기업 참여 불가
              </SelectItem>
              <SelectItem value="large_company_allowed" className="!px-4 !py-2.5 !text-gray-900">
                대기업 참여 가능
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="!flex !items-center">
          <span className="!min-w-[80px] !text-left !text-sm !font-semibold !text-gray-700">
            정렬 기준
          </span>
          <Select defaultValue="accuracy">
            <SelectTrigger className="!w-48 !rounded-md !border !border-gray-200 !bg-gray-50 !px-4 !py-2 !text-sm !text-gray-900 !shadow-sm hover:!border-[rgb(166,161,219)]">
              <SelectValue placeholder="정렬 기준" className="!text-gray-900" />
            </SelectTrigger>
            <SelectContent className="!rounded-md !border !border-gray-200 !bg-white !shadow-md">
              <SelectItem value="accuracy" className="!px-4 !py-2.5 !text-gray-900">
                정확도
              </SelectItem>
              <SelectItem value="published_desc" className="!px-4 !py-2.5 !text-gray-900">
                게시일 내림차순
              </SelectItem>
              <SelectItem value="published_asc" className="!px-4 !py-2.5 !text-gray-900">
                게시일 오름차순
              </SelectItem>
              <SelectItem value="deadline_desc" className="!px-4 !py-2.5 !text-gray-900">
                마감일 내림차순
              </SelectItem>
              <SelectItem value="deadline_asc" className="!px-4 !py-2.5 !text-gray-900">
                마감일 오름차순
              </SelectItem>
              <SelectItem value="amount_desc" className="!px-4 !py-2.5 !text-gray-900">
                금액 내림차순
              </SelectItem>
              <SelectItem value="amount_asc" className="!px-4 !py-2.5 !text-gray-900">
                금액 오름차순
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
