'use client';

import { ArrowLeft, Star, StarOff, Share2, ArrowRight } from 'lucide-react';
import { Check, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { DUMMY_BID_DATA_WITH_COST } from '@/features/bid-search/model/data';
import { Button } from '@/shared/ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/Select';
import { Toast } from '@/shared/ui/Toast';

import {
  GUIDE_BUTTON_LABELS,
  TAB_LABELS,
  COMMON_RESTRICTIONS,
  RESTRICTION_ITEMS,
} from './model/constants';
import { InfoItem, RestrictionItem } from './model/types';

export function BidDetailView() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const bid = DUMMY_BID_DATA_WITH_COST.find(b => b.id === id);

  const [qualificationNote, setQualificationNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(bid?.isFavorite ?? false);
  const [scope, setScope] = useState<string>('본 공고');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showUCToast, setShowUCToast] = useState(false);
  const [showLinkToast, setShowLinkToast] = useState(false);

  useEffect(() => {
    if (bid) {
      const saved = localStorage.getItem(`bid-note-${bid.id}`);
      if (saved) setQualificationNote(saved);
    }
  }, [bid]);

  const handleSave = () => {
    if (bid) {
      localStorage.setItem(`bid-note-${bid.id}`, qualificationNote);
      setShowSaveToast(true);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowLinkToast(true);
  };

  if (!bid) {
    return <div className="container mx-auto py-8">공고를 찾을 수 없습니다.</div>;
  }

  const infoItems: InfoItem[] = [
    { label: '공고 유형', value: bid.bidType },
    { label: '수요 기관', value: bid.organization },
    { label: '금액', value: `${bid.cost.toLocaleString('ko-KR')}원` },
    { label: '시작일', value: bid.publishedDate },
    { label: '마감일', value: bid.deadline },
  ];

  const commonRestrictions = COMMON_RESTRICTIONS;
  const restrictionItems = RESTRICTION_ITEMS;

  return (
    <div className="!container !mx-auto !p-18 !py-10">
      <h4
        onClick={() => router.back()}
        className="!bubble-element !Text !baTbzaS !clickable-element !bubble-r-vertical-center !z-[2] !order-1 !m-0 !mb-4 !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-[100px] !max-w-[100px] !min-w-[100px] !flex-grow !cursor-pointer !items-center !justify-center !self-start !overflow-visible !rounded-[20px] !border-2 !border-[rgb(235,235,235)] !bg-white !text-center !text-base !leading-none !font-[var(--font_default)] !font-medium !whitespace-pre-wrap !text-[#676FE7] !opacity-100"
      >
        <div className="!flex !items-center !justify-center !gap-1">
          <Image src="/arrow-left.svg" alt="뒤로가기" width={20} height={20} />
          <span>뒤로가기</span>
        </div>
      </h4>

      <div className="!mb-6 !flex !items-center">
        <h4 className="!bubble-element !Text !baTaLsm2 !z-[2] !m-0 !h-max !min-h-0 !w-max !min-w-0 !flex-grow-0 !self-center !overflow-visible !rounded-none !text-lg !leading-none !font-[var(--font_default)] !font-bold !whitespace-pre-wrap !text-[var(--color_primary_contrast_default)] !opacity-100">
          {bid.title}
        </h4>

        <div className="!ml-4 !flex !items-center !gap-1">
          <Button
            variant="unstyled"
            size="none"
            onClick={() => setIsFavorite(f => !f)}
            className="!hover:opacity-70 !flex !cursor-pointer !items-center !gap-1"
          >
            {isFavorite ? (
              <Image src="/star-yellow.svg" alt="보관중" width={20} height={20} />
            ) : (
              <Image src="/star-gray.svg" alt="관심 공고 추가" width={20} height={20} />
            )}
            <span className={`text-sm ${isFavorite ? '!text-[#FED602]' : '!text-[#676FE7]'}`}>
              {isFavorite ? '보관중' : '관심 공고 추가'}
            </span>
          </Button>

          <Button
            variant="unstyled"
            size="none"
            onClick={handleShare}
            className="!ml-2 !flex !cursor-pointer !items-center !gap-1 hover:opacity-70"
          >
            <Image src="/share.svg" alt="공유하기" width={20} height={20} />
            <span className="!text-sm !text-[#747474]">공유하기</span>
          </Button>
        </div>
      </div>

      <div className="!mb-10 !flex !flex-wrap !gap-3">
        {/* 공고 상세 버튼 */}
        <div className="!clickable-element !bubble-element !Group !baTaMaFh0 !bubble-r-container !row !z-[4] !m-0 !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-[100px] !max-w-[100px] !min-w-[100px] !cursor-pointer !justify-center !gap-[0px_5px] !self-center !overflow-visible !rounded-[5px] !bg-[rgb(104,111,232)] !opacity-100">
          <div className="!bubble-element !Image !baTaMaFj0 !rounded-0 !relative !z-[2] !m-0 !h-[20px] !max-h-[20px] !min-h-[20px] !w-[20px] !max-w-[20px] !min-w-[20px] !self-center !opacity-100">
            <Image
              src="https://542682c8b17017789cc2e977902e8281.cdn.bubble.io/cdn-cgi/image/w=24,h=24,f=auto,dpr=2,fit=contain/f1713516909737x425803449466263500/%E1%84%83%E1%85%A2%E1%84%8C%E1%85%B5%201%403x.png"
              alt="공고 상세"
              width={20}
              height={20}
              className="!rounded-0 !absolute !top-0 !left-0 !block !h-full !w-full"
            />
          </div>
          <h4 className="!bubble-element !Text !baTaMaFn0 !rounded-0 !z-[2] !m-0 !h-max !min-h-0 !w-max !min-w-0 !self-center !overflow-visible !text-[14px] !leading-none !font-[var(--font_default)] !font-bold !whitespace-pre-wrap !text-white !opacity-100">
            공고 상세
          </h4>
        </div>

        {/* 문서 보기 버튼 */}
        <div
          onClick={() => setShowUCToast(true)}
          className="!clickable-element !bubble-element !Group !baUkge0 !bubble-r-container !row !z-[4] !m-0 !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-[105px] !max-w-[105px] !min-w-[105px] !cursor-pointer !justify-center !gap-[0px_5px] !self-center !overflow-visible !rounded-[5px] !bg-[rgb(234,234,234)] !opacity-100"
        >
          <div className="!bubble-element !rounded-0 !z-[3] !m-0 !flex !h-[18px] !max-h-[18px] !min-h-[18px] !w-[18px] !max-w-[18px] !min-w-[18px] !self-center !text-[rgb(104,111,232)] !opacity-100">
            <Image
              src="/show-doc.svg"
              alt="문서 보기"
              width={18}
              height={18}
              className="!h-full !w-full"
            />
          </div>
          <h4 className="!bubble-element !Text !baUkgj0 !rounded-0 !z-[2] !m-0 !h-max !min-h-0 !w-max !min-w-0 !self-center !overflow-visible !text-[14px] !leading-none !font-[var(--font_default)] !font-semibold !whitespace-pre-wrap !text-[rgb(102,102,102)] !opacity-100">
            문서 보기
          </h4>
        </div>

        {/* 리스크 분석 버튼 */}
        <div
          onClick={() => setShowUCToast(true)}
          className="!clickable-element !bubble-element !Group !baTrdr !bubble-r-container !row !z-[4] !m-0 !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-[115px] !max-w-[115px] !min-w-[115px] !cursor-pointer !justify-center !gap-[0px_5px] !self-center !overflow-visible !rounded-[5px] !bg-[rgb(234,234,234)] !opacity-100"
        >
          <div className="!bubble-element !Image !baTrdx !rounded-0 !relative !z-[2] !m-0 !h-[18px] !max-h-[18px] !min-h-[18px] !w-[18px] !max-w-[18px] !min-w-[18px] !self-center !opacity-100">
            <Image
              src="/risk-analysis-icon.png"
              alt="리스크 분석"
              width={18}
              height={18}
              className="!rounded-0 !absolute !top-0 !left-0 !block !h-full !w-full"
            />
          </div>
          <h4 className="!bubble-element !Text !baTrdw !rounded-0 !z-[2] !m-0 !h-max !min-h-0 !w-max !min-w-0 !self-center !overflow-visible !text-[14px] !leading-none !font-[var(--font_default)] !font-semibold !whitespace-pre-wrap !text-[rgb(102,102,102)] !opacity-100">
            리스크 분석
          </h4>
        </div>

        {/* 투찰 가격 산출 버튼 */}
        <div
          onClick={() => setShowUCToast(true)}
          className="!clickable-element !bubble-element !Group !baTraVaB !bubble-r-container !row !z-[4] !m-0 !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-[130px] !max-w-[130px] !min-w-[130px] !cursor-pointer !justify-center !gap-[0px_5px] !self-center !overflow-visible !rounded-[5px] !bg-[rgb(234,234,234)] !opacity-100"
        >
          <div className="!bubble-element !Image !baTraVaH !rounded-0 !relative !z-[2] !m-0 !h-[18px] !max-h-[18px] !min-h-[18px] !w-[18px] !max-w-[18px] !min-w-[18px] !self-center !opacity-100">
            <Image
              src="/price-icon.png"
              alt="투찰 가격 산출"
              width={18}
              height={18}
              className="!rounded-0 !absolute !top-0 !left-0 !block !h-full !w-full"
            />
          </div>
          <h4 className="!bubble-element !Text !baTraVaD !rounded-0 !z-[2] !m-0 !h-max !min-h-0 !w-max !min-w-0 !self-center !overflow-visible !text-[14px] !leading-none !font-[var(--font_default)] !font-semibold !whitespace-pre-wrap !text-[rgb(102,102,102)] !opacity-100">
            투찰 가격 산출
          </h4>
        </div>

        {/* 공고 원문 버튼 */}
        <div
          onClick={() => setShowUCToast(true)}
          className="!clickable-element !bubble-element !Group !baTaMaEs0 !bubble-r-container !row !z-[4] !m-0 !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-[100px] !max-w-[100px] !min-w-[100px] !cursor-pointer !justify-center !gap-[0px_5px] !self-center !overflow-visible !rounded-[5px] !bg-[rgb(234,234,234)] !opacity-100"
        >
          <div className="!bubble-element !Image !baTaMaEx0 !rounded-0 !relative !z-[2] !m-0 !h-[20px] !max-h-[20px] !min-h-[20px] !w-[20px] !max-w-[20px] !min-w-[20px] !self-center !opacity-100">
            <Image
              src="/original-doc-icon.png"
              alt="공고 원문"
              width={20}
              height={20}
              className="!rounded-0 !absolute !top-0 !left-0 !block !h-full !w-full"
            />
          </div>
          <h4 className="!bubble-element !Text !baTaMaEy0 !rounded-0 !z-[2] !m-0 !h-max !min-h-0 !w-max !min-w-0 !self-center !overflow-visible !text-[14px] !leading-none !font-[var(--font_default)] !font-medium !whitespace-pre-wrap !text-[rgb(102,102,102)] !opacity-100">
            공고 원문
          </h4>
        </div>

        {/* Proposal AI 버튼 */}
        <div className="!flex !items-center">
          <div
            onClick={() => setShowUCToast(true)}
            className="!clickable-element !bubble-element !Group !baUiaLaC !bubble-r-container !row !z-[4] !m-0 !flex !h-[30px] !max-h-[30px] !min-h-[30px] !w-[115px] !max-w-[115px] !min-w-[115px] !cursor-pointer !justify-center !gap-[0px_5px] !self-center !overflow-visible !rounded-[5px] !bg-[rgb(234,234,234)] !opacity-100"
          >
            <div className="!bubble-element !Image !rounded-0 !relative !z-[2] !m-0 !h-[18px] !max-h-[18px] !min-h-[18px] !w-[18px] !max-w-[18px] !min-w-[18px] !self-center !opacity-100">
              <Image
                src="/ai-icon.png"
                alt="Proposal AI"
                width={18}
                height={18}
                className="!rounded-0 !absolute !top-0 !left-0 !block !h-full !w-full"
              />
            </div>
            <h4 className="!bubble-element !Text !rounded-0 !z-[2] !m-0 !h-max !min-h-0 !w-max !min-w-0 !self-center !overflow-visible !text-[14px] !leading-none !font-[var(--font_default)] !font-medium !whitespace-pre-wrap !text-[rgb(102,102,102)] !opacity-100">
              Proposal AI
            </h4>
          </div>
          <div className="!bubble-element !Text !rounded-0 !z-[6] !m-0 !ml-2 !h-max !min-h-0 !w-max !min-w-0 !self-center !overflow-visible !text-[14px] !leading-[1.4] !font-[var(--font_default)] !font-bold !whitespace-pre-wrap !text-[rgb(104,111,232)] !opacity-100">
            BETA
          </div>
        </div>
      </div>

      <div className="!mb-10 !grid !grid-cols-2 !gap-8">
        <div className="!col-span-1 !h-[330px] !rounded-lg !border !border-gray-200 !bg-white !shadow-sm">
          <div className="mb-2 !inline-block font-semibold !text-[#FAB513]">
            <div className="!flex !items-center !gap-2 !px-[18px] !py-4">
              <Image src="/note-icon.jpg" alt="자격 분석 노트" width={30} height={30} />
              자격 분석 노트
            </div>
          </div>
          <div className="flex h-[calc(100%-70px)] flex-col">
            <textarea
              className="!w-full !flex-grow !border-x-0 !border-t !border-b-0 !border-t-gray-200 !bg-transparent !p-5 !text-[14px] !leading-[1.5] !font-medium !text-[var(--color_primary_contrast_default)] placeholder:!text-[#DADADA] focus:!border-t-gray-200 focus:!ring-0 focus:!outline-none"
              value={qualificationNote}
              onChange={e => setQualificationNote(e.target.value)}
              placeholder="필요한 메모를 하세요.."
            />
            <div className="mb-3 flex justify-end">
              <Button
                variant="unstyled"
                size="none"
                onClick={handleSave}
                className="!hover:opacity-90 !mx-3 !mb-3 !w-full !cursor-pointer !rounded !bg-[#999999] !py-2 !text-white"
              >
                저장
              </Button>
            </div>
          </div>
        </div>

        <div className="!col-span-1 !rounded-lg !border !border-gray-200 !bg-white !shadow-sm">
          <div className="mb-2 !inline-block font-semibold !text-[#111111]">
            <div className="!flex !items-center !gap-2 !px-[18px] !py-4">
              <Image src="/project-info-icon.jpg" alt="프로젝트 정보" width={30} height={30} />
              프로젝트 정보
            </div>
          </div>
          <div className="flex h-[calc(100%-70px)] flex-col">
            <div className="!w-full !flex-grow !border-x-0 !border-t !border-b-0 !border-t-gray-200 !p-5">
              {infoItems.map(item => (
                <div key={item.label} className="!mb-4 !flex !items-center !gap-0">
                  <span className="!w-[100px] !text-[14px] !text-[#999999]">{item.label}</span>
                  <span className="!text-[14px] !text-[#111111]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="!grid !grid-cols-3 !gap-8">
        <div className="!col-span-1 !rounded-lg !border !border-gray-200 !bg-white !p-8 !shadow-sm">
          <div className="!mb-4 !inline-block !border-b-2 !border-[#5851A8] !pb-2 font-semibold !text-[#5851A8]">
            공동수급 · 지역제한 · 선정방식
          </div>
          <table className="!w-full !divide-y !divide-gray-100">
            <tbody>
              {commonRestrictions.map(r => (
                <tr key={r.label} className="border-t">
                  <td className="w-1/4 py-2 font-medium !text-[#5851A8]">{r.label}</td>
                  <td className="py-2">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {restrictionItems.map((r, i) => (
          <div
            key={i}
            className="!col-span-1 !flex !flex-col !rounded-lg !border !border-gray-200 !bg-white !p-6 !shadow-sm"
          >
            <div className="!mb-4 flex items-center justify-between">
              <span className="font-semibold !text-[#5851A8]">{r.title}</span>
              <Select defaultValue={scope} onValueChange={val => setScope(val)}>
                <SelectTrigger className="!w-48 !rounded-md !border !border-gray-200 !bg-gray-50 !px-4 !py-2 !text-sm !text-gray-900 !shadow-sm hover:!border-[rgb(166,161,219)]">
                  <SelectValue className="!text-gray-900" />
                </SelectTrigger>
                <SelectContent className="!rounded-md !border !border-gray-200 !bg-white !shadow-md">
                  <SelectItem value="본 공고" className="!px-4 !py-2.5 !text-gray-900">
                    본 공고
                  </SelectItem>
                  <SelectItem value="우리 회사" className="!px-4 !py-2.5 !text-gray-900">
                    우리 회사
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="!mb-10 !text-sm !text-gray-600">
              {`${r.certificationLabel} (${r.certificationCount})`}
            </div>
            <div className="!mb-4 !flex justify-center font-medium !text-green-400">
              {r.statusText}
            </div>
            <div className="!mt-7 !flex !flex-wrap !justify-center gap-2">
              {r.guideButtons.map(btn => (
                <Button
                  key={btn}
                  variant="unstyled"
                  size="none"
                  onClick={() => setShowUCToast(true)}
                  className="!hover:opacity-90 !flex !cursor-pointer !items-center !gap-1 !rounded !bg-[#5851A8] !px-4 !py-2 !text-sm !text-white"
                >
                  {btn} <ArrowRight size={14} />
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Toast
        title="저장되었습니다."
        isVisible={showSaveToast}
        onClose={() => setShowSaveToast(false)}
        icon={<Check className="size-5 text-green-600" />}
        position="top"
      />
      <Toast
        title="준비중입니다."
        isVisible={showUCToast}
        onClose={() => setShowUCToast(false)}
        icon={<AlertTriangle className="size-5 text-yellow-600" />}
        position="top"
      />
      <Toast
        title="링크가 클립보드에 복사되었습니다."
        isVisible={showLinkToast}
        onClose={() => setShowLinkToast(false)}
        icon={<Check className="size-5 text-green-600" />}
        position="top"
      />
    </div>
  );
}
