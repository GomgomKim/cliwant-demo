import { Star, ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface KeywordSetDropdownProps {
  selectedSet: any;
  filteredKeywordSets: any[];
  isDropdownOpen: boolean;
  selectedKeywordSetId: string | null;
  setIsDropdownOpen: (isOpen: boolean) => void;
  selectKeywordSet: (id: string) => void;
  filterType: 'shared' | 'personal';
}

export function KeywordSetDropdown({
  selectedSet,
  filteredKeywordSets,
  isDropdownOpen,
  selectedKeywordSetId,
  setIsDropdownOpen,
  selectKeywordSet,
  filterType,
}: KeywordSetDropdownProps) {
  return (
    <div className="relative ml-4">
      <div
        className="flex min-w-[180px] cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white p-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{selectedSet?.name || '키워드 그룹 선택'}</span>
        <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
      </div>

      {isDropdownOpen && (
        <div className="!absolute !top-full !left-0 !z-50 !mt-1 !w-64 !rounded-md !border !border-gray-200 !bg-white !shadow-lg !backdrop-blur-sm">
          <div className="py-1">
            {filteredKeywordSets.length > 0 ? (
              filteredKeywordSets.map(set => (
                <div
                  key={set.id}
                  className={cn(
                    '!flex !cursor-pointer !items-center !gap-2 !px-3 !py-2 !font-["Pretendard"] !transition-colors !duration-150 hover:!bg-gray-100',
                    selectedKeywordSetId === set.id ? '!bg-gray-50' : ''
                  )}
                  onClick={() => {
                    selectKeywordSet(set.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Star
                    className={cn(
                      '!h-4 !w-4',
                      selectedKeywordSetId === set.id
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                  <span className="text-sm">{set.name}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {filterType === 'shared'
                  ? '공유된 키워드 세트가 없습니다'
                  : '개인 키워드 세트가 없습니다'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
