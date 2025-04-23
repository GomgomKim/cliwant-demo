'use client';

import { useState } from 'react';

interface SearchTabsProps {
  onTabChange: (tab: string) => void;
}

export function SearchTabs({ onTabChange }: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState('new');

  const tabs = [
    { id: 'new', label: '신규 입찰' },
    { id: 'active', label: '진행중 입찰' },
    { id: 'closed', label: '마감된 입찰' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className="mb-6 font-['Pretendard']">
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative py-4 px-8 text-sm font-medium transition-colors focus:outline-none
              ${
                activeTab === tab.id
                  ? 'text-[#5851A8] font-semibold'
                  : 'text-[#707070] hover:text-[#5851A8]'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#5851A8]"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
