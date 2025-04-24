'use client';

import * as Tabs from '@radix-ui/react-tabs';
import {
  ArrowLeft,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Download,
  Share2,
  Printer,
  Heart,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

// 가상의 공고 상세 더미 데이터
const DUMMY_BID_DETAIL = {
  id: 1,
  title: '스마트시티 통합 관제 시스템 구축 사업',
  organization: '서울특별시',
  department: '정보화담당관',
  budget: '12억원',
  deadline: '2025-05-20',
  publishedDate: '2025-04-12',
  bidNumber: '20250412-1234',
  contractMethod: '제한경쟁입찰',
  contractType: '용역',
  location: '서울특별시 중구',
  description: `
    본 사업은 서울특별시 스마트시티 통합 관제 시스템 구축을 위한 것으로, 다음과 같은 내용을 포함합니다:

    1. 스마트시티 통합 플랫폼 개발
    2. IoT 센서 네트워크 구축 및 연동
    3. 데이터 수집, 처리, 분석 시스템 개발
    4. 시민 참여형 모바일 애플리케이션 개발
    5. 통합 관제 대시보드 구축

    참가자격:
    - 최근 3년간 유사 프로젝트 수행 실적 보유
    - 정보통신공사업 등록업체
    - 소프트웨어사업자 신고업체
  `,
  documents: [
    { id: 1, name: '입찰 공고문', size: '2.3MB', type: 'pdf' },
    { id: 2, name: '제안요청서', size: '5.1MB', type: 'pdf' },
    { id: 3, name: '과업지시서', size: '3.7MB', type: 'hwp' },
    { id: 4, name: '서식 모음', size: '1.2MB', type: 'zip' },
  ],
  requirements: [
    'Minimum 5 years experience with government IT systems',
    'CompTIA Security+ certification for all staff',
    'Experience with CJIS compliance',
    'Available for 24/7 emergency support',
  ],
  qualifications: [
    'ISO 27001 certification',
    'Experience with municipal government systems',
    'Local presence preferred but not required',
    'Demonstrated experience with similar-sized organizations',
  ],
  questions: [
    {
      question: 'Is there a preference for on-premise or cloud-based solutions?',
      answer:
        'We are open to both options, but any cloud solution must meet our security requirements and compliance standards.',
    },
    {
      question: 'What is the expected response time for critical issues?',
      answer:
        'Critical issues must have a response time of 30 minutes or less, with resolution efforts beginning immediately.',
    },
  ],
};

export function BidDetailView() {
  const [isFavorite, setIsFavorite] = useState(false);
  const bid = DUMMY_BID_DETAIL;

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to search
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{bid.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{bid.budget}</Badge>
              <Badge variant="outline">Due: {bid.deadline}</Badge>
              <Badge variant="outline">{bid.location}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Published by: {bid.organization} ({bid.department})
            </p>
          </div>

          <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs.Root defaultValue="description" className="w-full">
        <Tabs.List className="flex border-b mb-4">
          <Tabs.Trigger
            value="description"
            className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Description
          </Tabs.Trigger>
          <Tabs.Trigger
            value="requirements"
            className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Requirements
          </Tabs.Trigger>
          <Tabs.Trigger
            value="qualifications"
            className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Qualifications
          </Tabs.Trigger>
          <Tabs.Trigger
            value="q-and-a"
            className="px-4 py-2 border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Q&A
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="description" className="py-4">
          <p>{bid.description}</p>
        </Tabs.Content>

        <Tabs.Content value="requirements" className="py-4">
          <ul className="list-disc pl-5 space-y-2">
            {bid.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </Tabs.Content>

        <Tabs.Content value="qualifications" className="py-4">
          <ul className="list-disc pl-5 space-y-2">
            {bid.qualifications.map((qual, index) => (
              <li key={index}>{qual}</li>
            ))}
          </ul>
        </Tabs.Content>

        <Tabs.Content value="q-and-a" className="py-4">
          <div className="space-y-6">
            {bid.questions.map((item, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-medium mb-2">Q: {item.question}</h3>
                <p className="text-muted-foreground">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
