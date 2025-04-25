'use client';

import { ArrowLeft, Star, StarOff, Share2, ArrowRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { DUMMY_BID_DATA_WITH_COST } from '@/features/bid-search/model/data';
import { Button } from '@/shared/ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/Select';

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

  useEffect(() => {
    if (bid) {
      const saved = localStorage.getItem(`bid-note-${bid.id}`);
      if (saved) setQualificationNote(saved);
    }
  }, [bid]);

  const handleSave = () => {
    if (bid) {
      localStorage.setItem(`bid-note-${bid.id}`, qualificationNote);
      alert('저장되었습니다.');
    }
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
    <div className="!container !mx-auto !px-6 !py-10">
      <Button
        variant="unstyled"
        size="none"
        onClick={() => router.back()}
        className="!hover:opacity-70 !mb-4 !flex !items-center !text-[#5851A8]"
      >
        <ArrowLeft size={16} /> 뒤로가기
      </Button>

      <h1 className="mb-2 !inline-block !border-b-2 !border-[#5851A8] !pb-2 text-2xl font-bold !text-[#5851A8]">
        {bid.title}
      </h1>
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="unstyled"
          size="none"
          onClick={() => setIsFavorite(f => !f)}
          className="!text-[#5851A8] hover:opacity-70"
        >
          {isFavorite ? <Star size={20} /> : <StarOff size={20} />}
        </Button>
        <span className="text-sm">{isFavorite ? '보관중' : '보관'}</span>
        <Button variant="unstyled" size="none" className="!text-[#5851A8] hover:opacity-70">
          <Share2 size={20} />
        </Button>
      </div>

      <div className="!mb-10 !flex !flex-wrap !gap-4">
        {TAB_LABELS.map(label => (
          <Button
            key={label}
            variant="unstyled"
            size="none"
            className={`!rounded !px-4 !py-2 ${
              label === '공고 상세'
                ? '!bg-[#5851A8] !text-white hover:opacity-90'
                : '!border !border-[#5851A8] !text-[#5851A8] hover:opacity-70'
            }`}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="!mb-10 !grid !grid-cols-3 !gap-8">
        <div className="!col-span-2 !rounded-lg !border !border-gray-200 !bg-white !p-8 !shadow-sm">
          <div className="mb-4 !inline-block !border-b-2 !border-[#5851A8] !pb-2 font-semibold !text-[#5851A8]">
            자격 분석 노트
          </div>
          <textarea
            className="!h-40 !w-full !rounded-lg !border !border-gray-200 !p-4"
            value={qualificationNote}
            onChange={e => setQualificationNote(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button
              variant="unstyled"
              size="none"
              onClick={handleSave}
              className="!hover:opacity-90 !rounded !bg-[#5851A8] !px-6 !py-2 !text-white"
            >
              저장
            </Button>
          </div>
        </div>

        <div className="!rounded-lg !border !border-gray-200 !bg-white !p-8 !shadow-sm">
          <div className="mb-4 !inline-block !border-b-2 !border-[#5851A8] !pb-2 font-semibold !text-[#5851A8]">
            프로젝트 정보
          </div>
          <ul>
            {infoItems.map(item => (
              <li
                key={item.label}
                className="!last:border-none !flex !justify-between !border-b !py-1"
              >
                <span className="font-medium !text-[#5851A8]">{item.label}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="!grid !grid-cols-3 !gap-8">
        <div className="!col-span-1 !rounded-lg !border !border-gray-200 !bg-white !p-8 !shadow-sm">
          <div className="mb-4 !inline-block !border-b-2 !border-[#5851A8] !pb-2 font-semibold !text-[#5851A8]">
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
            className="!col-span-1 !rounded-lg !border !border-gray-200 !bg-white !p-6 !shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
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
            <div className="mb-2 text-sm text-gray-600">
              {`${r.certificationLabel} (${r.certificationCount})`}
            </div>
            <div className="mb-4 font-medium !text-[#5851A8]">{r.statusText}</div>
            <div className="flex flex-wrap gap-2">
              {r.guideButtons.map(btn => (
                <Button
                  key={btn}
                  variant="unstyled"
                  size="none"
                  className="!hover:opacity-90 !flex !items-center !gap-1 !rounded !bg-[#5851A8] !px-4 !py-2 !text-sm !text-white"
                >
                  {btn} <ArrowRight size={14} />
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
