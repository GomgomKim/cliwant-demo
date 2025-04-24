import { X } from 'lucide-react';
import Image from 'next/image';

import { IMAGES } from '@/features/bidSearch/model/constants';
import { KeywordRow } from '@/features/bidSearch/model/searchStore';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';

interface KeywordRowComponentProps {
  row: KeywordRow;
  updateKeywordRow: (id: string, data: Partial<KeywordRow>) => void;
  addKeywordTag: (rowId: string) => void;
  keywordTags: string[];
  removeKeywordTag: (rowId: string, tag: string) => void;
}

export function KeywordRowComponent({
  row,
  updateKeywordRow,
  addKeywordTag,
  keywordTags,
  removeKeywordTag,
}: KeywordRowComponentProps) {
  return (
    <div className="!flex !items-center">
      <Select
        value={row.searchField || 'title'}
        onValueChange={value =>
          updateKeywordRow(row.id, { searchField: value as 'title' | 'content' })
        }
      >
        <SelectTrigger className="!z-10 !mr-[10px] !h-[30px] !w-[130px] !border-none !text-xs !font-semibold">
          <SelectValue>{row.searchField === 'title' ? '공고 제목' : '첨부파일 본문'}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#505050] !px-2 !py-1">
          <SelectItem value="title">
            <span className="pl-4">공고 제목</span>
          </SelectItem>
          <SelectItem value="content">
            <span className="pl-4">첨부파일 본문</span>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* 개별 conjunction 선택 컴포넌트 */}
      <Select
        value={row.conjunction}
        onValueChange={value => updateKeywordRow(row.id, { conjunction: value as any })}
      >
        <SelectTrigger className="!z-10 !mx-[20px] !h-[30px] !w-[55px] !border-none !text-xs">
          <SelectValue placeholder="조건" />
        </SelectTrigger>
        <SelectContent className="bg-[#505050]!px-2 !py-1">
          <SelectItem value="AND">
            <span className="pl-4">AND</span>
          </SelectItem>
          <SelectItem value="OR">
            <span className="pl-4">OR</span>
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="relative flex items-center">
        <Input
          value={row.keyword}
          onChange={e => updateKeywordRow(row.id, { keyword: e.target.value })}
          placeholder="키워드를 입력해보세요"
          className="!z-[4] !mr-4 !flex !h-[30px] !min-h-[30px] !w-[180px] !self-center !rounded-[5px] !border !border-solid !border-[#ebebeb] !bg-white !p-[6px] !pr-10 !text-xs !font-[var(--font_default)] !font-semibold !text-[#423F3F] !opacity-100"
        />
        <Button
          variant="ghost"
          className="!ml-1 !flex !cursor-pointer !rounded-[5px]"
          onClick={() => addKeywordTag(row.id)}
          title="키워드 추가"
        >
          <Image src={IMAGES.PLUS_BUTTON} width={24} height={24} alt="추가" className="!h-6 !w-6" />
        </Button>
      </div>

      {/* 각 행별 태그 표시 영역 */}
      {keywordTags.length > 0 && (
        <div className="!ml-4 !flex !flex-wrap !gap-2">
          {keywordTags.map((tag, tagIndex) => (
            <div
              key={tagIndex}
              className="!flex !items-center !self-center !rounded-[20px] !bg-[#a6a1db] !px-4 !py-1 !text-white !opacity-100"
            >
              <span className="!text-xs !font-medium">{tag}</span>
              <Button
                variant="ghost"
                size="sm"
                className="!hover:text-gray-100 !ml-1.5 !h-auto !cursor-pointer !rounded-full !p-0 !text-white"
                onClick={() => removeKeywordTag(row.id, tag)}
                aria-label={`태그 삭제: ${tag}`}
              >
                <X className="!h-3.5 !w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
