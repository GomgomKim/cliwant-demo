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
    <div className="!mb-6 space-y-4">
      <div className="flex flex-col pb-3">
        <span className="!z-[4] !mb-2 !h-[30px] !max-w-[120px] !min-w-[120px] !self-start !overflow-visible !rounded-none !text-[14px] !leading-[1.4] !font-bold !whitespace-pre-wrap !text-[#939393] !opacity-100">
          제목 제외 키워드
        </span>
        <div className="flex-1">
          <div className="flex gap-2">
            <div className="relative max-w-md flex-1">
              <Input
                placeholder="제목에서 제외할 키워드 입력"
                className="!z-[4] !m-0 !h-[30px] !min-h-[30px] !w-full !self-center !rounded-[5px] !border !border-solid !border-[#ebebeb] !bg-white !p-[6px] !pr-10 !text-xs !font-[var(--font_default)] !font-semibold !text-[#423F3F] !opacity-100"
                value={excludeTitleInput}
                onChange={e => setExcludeTitleInput(e.target.value)}
                onKeyPress={e => handleKeyPress(e, 'title')}
              />
              <Button
                variant="ghost"
                className="!absolute !right-0 !z-[2] !order-5 !mr-[-5px] !ml-[5px] !h-[30px] !max-h-[30px] !min-h-[30px] !w-[30px] !max-w-[30px] !min-w-[30px] !flex-grow !self-center !rounded-[5px]"
                onClick={handleAddExcludeTitleKeyword}
              >
                <Image
                  src={IMAGES.PLUS_BUTTON}
                  width={24}
                  height={24}
                  alt="추가"
                  className="!h-6 !w-6"
                />
              </Button>
            </div>
          </div>

          {excludeTitleKeywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {excludeTitleKeywords.map((keyword, index) => (
                <div
                  key={index}
                  className="!z-[4] !order-2 !mr-[5px] !flex !h-max !min-h-0 !w-max !min-w-0 !flex-none !items-center !justify-start !self-start !overflow-visible !rounded-[20px] !bg-[#F2989E] !px-[10px] !py-[4px] !text-white !opacity-100"
                >
                  <span className="!text-xs !font-medium">{keyword}</span>
                  <button
                    className="!hover:text-gray-100 !ml-1.5 !rounded-full !p-0.5 !text-white"
                    onClick={() => removeExcludeTitleKeyword(keyword)}
                  >
                    <X className="!h-3.5 !w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col pb-3">
        <span className="!z-[4] !mb-2 !h-[30px] !max-w-[120px] !min-w-[120px] !self-start !overflow-visible !rounded-none !text-[14px] !leading-[1.4] !font-[var(--font_default)] !font-bold !whitespace-pre-wrap !text-[#939393] !opacity-100">
          본문 제외 키워드
        </span>
        <div className="flex-1">
          <div className="flex gap-2">
            <div className="relative max-w-md flex-1">
              <Input
                placeholder="본문에서 제외할 키워드 입력"
                className="!z-[4] !m-0 !h-[30px] !min-h-[30px] !w-full !self-center !rounded-[5px] !border !border-solid !border-[#ebebeb] !bg-white !p-[6px] !pr-10 !text-xs !font-[var(--font_default)] !font-semibold !text-[#423F3F] !opacity-100"
                value={excludeContentInput}
                onChange={e => setExcludeContentInput(e.target.value)}
                onKeyPress={e => handleKeyPress(e, 'content')}
              />
              <Button
                variant="ghost"
                className="!absolute !right-0 !z-[2] !order-5 !mr-[-5px] !ml-[5px] !h-[30px] !max-h-[30px] !min-h-[30px] !w-[30px] !max-w-[30px] !min-w-[30px] !flex-grow !self-center !rounded-[5px]"
                onClick={handleAddExcludeContentKeyword}
              >
                <Image
                  src={IMAGES.PLUS_BUTTON}
                  width={24}
                  height={24}
                  alt="추가"
                  className="!h-6 !w-6"
                />
              </Button>
            </div>
          </div>

          {excludeContentKeywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {excludeContentKeywords.map((keyword, index) => (
                <div
                  key={index}
                  className="!z-[4] !order-2 !mr-[5px] !flex !h-max !min-h-0 !w-max !min-w-0 !flex-none !items-center !justify-start !self-start !overflow-visible !rounded-[20px] !bg-[#F2989E] !px-[10px] !py-[4px] !text-white !opacity-100"
                >
                  <span className="!text-xs !font-medium">{keyword}</span>
                  <button
                    className="!hover:text-gray-100 !ml-1.5 !rounded-full !p-0.5 !text-white"
                    onClick={() => removeExcludeContentKeyword(keyword)}
                  >
                    <X className="!h-3.5 !w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
