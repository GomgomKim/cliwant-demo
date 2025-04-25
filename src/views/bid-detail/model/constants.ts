import { InfoItem, RestrictionItem } from './types';

export const GUIDE_BUTTON_LABELS = ['업종 등록 가이드', '직접생산 절차', '상세 요건'];

export const TAB_LABELS = [
  '공고 상세',
  '문서 보기',
  '리스크 분석',
  '투찰 가격 산출',
  '공고 원문',
  'Proposal AI',
];

export const COMMON_RESTRICTIONS: InfoItem[] = [
  { label: '공동수급', value: '공고서 참조' },
  { label: '지역제한', value: '없음' },
  { label: '제출 방법', value: '공고 문서 참조.' },
  { label: '제출 확약서', value: '없음' },
  { label: '기업 제한', value: '공고문 참조' },
  { label: '실적 제한', value: '공고문 참조' },
  { label: '인적 제한', value: '공고문 참조' },
];

export const RESTRICTION_ITEMS: RestrictionItem[] = [
  {
    title: '업종제한',
    certificationLabel: '입찰 요구 인증서',
    certificationCount: 0,
    statusText: '참여 제한 없음',
    guideButtons: [GUIDE_BUTTON_LABELS[0]],
  },
  {
    title: '직접생산 분석',
    certificationLabel: '입찰 요구 직접생산',
    certificationCount: 0,
    statusText: '참여 제한 없음',
    guideButtons: [GUIDE_BUTTON_LABELS[1], GUIDE_BUTTON_LABELS[2]],
  },
];
