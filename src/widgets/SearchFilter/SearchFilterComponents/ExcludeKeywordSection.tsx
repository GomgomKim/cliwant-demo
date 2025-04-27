import { X } from 'lucide-react';
import Image from 'next/image';

import { IMAGES } from '@/features/bid-search/model/constants';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

interface ExcludeKeywordSectionProps {
  excludeTitleInput: string;
  setExcludeTitleInput: (value: string) => void;
  excludeContentInput: string;
  setExcludeContentInput: (value: string) => void;
  excludeTitleKeywords: string[];
  excludeContentKeywords: string[];
  handleAddExcludeTitleKeyword: () => void;
  handleAddExcludeContentKeyword: () => void;
  removeExcludeTitleKeyword: (keyword: string) => void;
  removeExcludeContentKeyword: (keyword: string) => void;
  handleKeyPress: (e: React.KeyboardEvent, fieldType: 'title' | 'content') => void;
}

export function ExcludeKeywordSection({
  excludeTitleInput,
  setExcludeTitleInput,
  excludeContentInput,
  setExcludeContentInput,
  excludeTitleKeywords,
  excludeContentKeywords,
  handleAddExcludeTitleKeyword,
  handleAddExcludeContentKeyword,
  removeExcludeTitleKeyword,
  removeExcludeContentKeyword,
  handleKeyPress,
}: ExcludeKeywordSectionProps) {
  return (
    <div className="!mb-3 !space-y-4">
      <div className="!flex !items-center !gap-3">
        <span className="!min-w-[120px] !text-sm !font-semibold !text-gray-700">
          제목 제외 키워드
        </span>
        <Input
          placeholder="제목에서 제외할 키워드 입력"
          className="!h-8 !w-72 !rounded-[5px] !border !border-gray-300 !px-3 !text-sm"
          value={excludeTitleInput}
          onChange={e => setExcludeTitleInput(e.target.value)}
          onKeyPress={e => handleKeyPress(e, 'title')}
        />
        <Button
          variant="ghost"
          className="!ml-1 !flex !cursor-pointer !rounded-[5px]"
          onClick={handleAddExcludeTitleKeyword}
          title="키워드 추가"
        >
          <Image src={IMAGES.PLUS_BUTTON} width={24} height={24} alt="추가" className="!h-6 !w-6" />
        </Button>
        {excludeTitleKeywords.length > 0 && (
          <div className="!ml-auto !flex !flex-wrap !gap-2">
            {excludeTitleKeywords.map((keyword, index) => (
              <div
                key={index}
                className="!flex !items-center !gap-1 !rounded-full !bg-red-400 !px-3 !py-1"
              >
                <span className="!text-xs !font-medium !text-white">{keyword}</span>
                <button
                  className="!ml-1 !rounded-full !p-1 !text-white hover:!bg-red-500"
                  onClick={() => removeExcludeTitleKeyword(keyword)}
                >
                  <X className="!h-4 !w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="!flex !items-center !gap-3">
        <span className="!min-w-[120px] !text-sm !font-semibold !text-gray-700">
          본문 제외 키워드
        </span>
        <Input
          placeholder="본문에서 제외할 키워드 입력"
          className="!h-8 !w-72 !rounded-[5px] !border !border-gray-300 !px-3 !text-sm"
          value={excludeContentInput}
          onChange={e => setExcludeContentInput(e.target.value)}
          onKeyPress={e => handleKeyPress(e, 'content')}
        />
        <Button
          variant="ghost"
          className="!ml-1 !flex !cursor-pointer !rounded-[5px]"
          onClick={handleAddExcludeContentKeyword}
          title="키워드 추가"
        >
          <Image src={IMAGES.PLUS_BUTTON} width={24} height={24} alt="추가" className="!h-6 !w-6" />
        </Button>
        {excludeContentKeywords.length > 0 && (
          <div className="!ml-auto !flex !flex-wrap !gap-2">
            {excludeContentKeywords.map((keyword, index) => (
              <div
                key={index}
                className="!flex !items-center !gap-1 !rounded-full !bg-red-400 !px-3 !py-1"
              >
                <span className="!text-xs !font-medium !text-white">{keyword}</span>
                <button
                  className="!ml-1 !rounded-full !p-1 !text-white hover:!bg-red-500"
                  onClick={() => removeExcludeContentKeyword(keyword)}
                >
                  <X className="!h-4 !w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
