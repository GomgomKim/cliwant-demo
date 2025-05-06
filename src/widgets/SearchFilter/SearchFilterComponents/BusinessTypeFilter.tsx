export function BusinessTypeFilter() {
  return (
    <div className="!mb-6 !flex !flex-wrap !items-center">
      <div className="!flex !items-center">
        <span className="!w-[120px] !text-[14px] !font-bold !text-[#939393]">사업 구분</span>
        <select
          className="!ml-[-40px] !h-[30px] !w-[75px] !rounded !border !border-[#EBEBEB] !py-1 !text-left !text-xs !font-semibold !text-[var(--color_primary_contrast_default)]"
          defaultValue="all"
        >
          <option value="all">전체</option>
          <option value="service">용역</option>
          <option value="goods">물품</option>
          <option value="construction">공사</option>
          <option value="foreign">외자</option>
          <option value="other">기타</option>
        </select>
      </div>

      <div className="!ml-[25px] !flex !items-center">
        <span className="!w-[120px] !text-[14px] !font-bold !text-[#939393]">기업 제한</span>
        <select
          className="!ml-[-40px] !h-[30px] !w-[120px] !rounded !border !border-[#EBEBEB] !py-1 !text-left !text-xs !font-semibold !text-[var(--color_primary_contrast_default)]"
          defaultValue="all"
        >
          <option value="all">전체 보기</option>
          <option value="doc_reference">문서 참조 필요</option>
          <option value="large_company_restricted">대기업 참여 불가</option>
          <option value="large_company_allowed">대기업 참여 가능</option>
        </select>
      </div>

      <div className="!ml-[20px] !flex !items-center">
        <span className="!w-[120px] !text-[14px] !font-bold !text-[#939393]">정렬 기준</span>
        <select
          className="!ml-[-40px] !h-[30px] !w-[140px] !rounded !border !border-[#EBEBEB] !py-1 !text-left !text-xs !font-semibold !text-[var(--color_primary_contrast_default)]"
          defaultValue="accuracy"
        >
          <option value="accuracy">정확도</option>
          <option value="published_desc">게시일 내림차순</option>
          <option value="published_asc">게시일 오름차순</option>
          <option value="deadline_desc">마감일 내림차순</option>
          <option value="deadline_asc">마감일 오름차순</option>
          <option value="amount_desc">금액 내림차순</option>
          <option value="amount_asc">금액 오름차순</option>
        </select>
      </div>
    </div>
  );
}
