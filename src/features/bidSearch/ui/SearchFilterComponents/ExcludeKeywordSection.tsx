import { X } from 'lucide-react';
import Image from 'next/image';

import { IMAGES } from '@/features/bidSearch/model/constants';
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
    <div className="!mb-6 !space-y-4">
      <div className="!flex !items-center !gap-4 !rounded-lg !bg-white !p-4 !shadow-sm">
        <span className="!min-w-[120px] !text-sm !font-semibold !text-gray-700">
          제목 제외 키워드
        </span>
        <div className="!flex !flex-1 !items-center !gap-2">
          <Input
            placeholder="제목에서 제외할 키워드 입력"
            className="!w-full !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm"
            value={excludeTitleInput}
            onChange={e => setExcludeTitleInput(e.target.value)}
            onKeyPress={e => handleKeyPress(e, 'title')}
          />
          <Button
            variant="unstyled"
            className="!rounded-md !bg-blue-500 !p-2 !text-white hover:!bg-blue-600"
            onClick={handleAddExcludeTitleKeyword}
          >
            <Image
              src={IMAGES.PLUS_BUTTON}
              width={24}
              height={24}
              alt="추가"
              className="!h-5 !w-5"
            />
          </Button>
        </div>
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

      <div className="!flex !items-center !gap-4 !rounded-lg !bg-white !p-4 !shadow-sm">
        <span className="!min-w-[120px] !text-sm !font-semibold !text-gray-700">
          본문 제외 키워드
        </span>
        <div className="!flex !flex-1 !items-center !gap-2">
          <Input
            placeholder="본문에서 제외할 키워드 입력"
            className="!w-full !rounded-md !border !border-gray-200 !bg-gray-50 !px-3 !py-2 !text-sm"
            value={excludeContentInput}
            onChange={e => setExcludeContentInput(e.target.value)}
            onKeyPress={e => handleKeyPress(e, 'content')}
          />
          <Button
            variant="unstyled"
            className="!rounded-md !bg-blue-500 !p-2 !text-white hover:!bg-blue-600"
            onClick={handleAddExcludeContentKeyword}
          >
            <Image
              src={IMAGES.PLUS_BUTTON}
              width={24}
              height={24}
              alt="추가"
              className="!h-5 !w-5"
            />
          </Button>
        </div>
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
