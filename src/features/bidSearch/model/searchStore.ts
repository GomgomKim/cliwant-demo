import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type FilterType = 'personal' | 'shared';
export type SearchMode = 'simple' | 'ai' | 'advanced';
export type FilterConjunction = 'AND' | 'OR';
export type TimeFilter = 'day' | 'week' | 'month' | 'all' | 'custom';

export interface KeywordRow {
  id: string;
  conjunction: FilterConjunction;
  keyword: string;
  searchField?: 'title' | 'content';
}

export interface SavedKeywordSet {
  id: string;
  name: string;
  keywordRows: KeywordRow[];
  isShared: boolean;
}

interface SearchState {
  // UI 상태
  filterType: FilterType;
  searchMode: SearchMode;
  selectedKeywordSetId: string | null;
  isFiltersExpanded: boolean;

  // 필터 조건
  keywordRows: KeywordRow[];
  excludeTitleKeywords: string[];
  excludeContentKeywords: string[];
  minAmount: number;
  maxAmount: number;
  excludeAmount: boolean;
  startDate: string | null;
  endDate: string | null;
  includeExpired: boolean;
  timeFilter: TimeFilter;

  // 추가 필터
  projectCategory: string;
  companyLimit: string;
  sortOrder: string;
  conditions: {
    bidConditionMet: boolean;
    itemConditionMet: boolean;
    jointSupplyAllowed: boolean;
    noPerformanceLimit: boolean;
    noCertificationLimit: boolean;
  };

  // 저장된 키워드
  savedKeywordSets: SavedKeywordSet[];

  // 액션
  setSearchMode: (mode: SearchMode) => void;
  setFilterType: (type: FilterType) => void;
  selectKeywordSet: (id: string | null) => void;
  toggleFiltersExpanded: () => void;

  updateKeywordRow: (id: string, changes: Partial<KeywordRow>) => void;
  removeKeywordRow: (id: string) => void;

  addExcludeTitleKeyword: (keyword: string) => void;
  removeExcludeTitleKeyword: (keyword: string) => void;

  addExcludeContentKeyword: (keyword: string) => void;
  removeExcludeContentKeyword: (keyword: string) => void;

  setAmountRange: (min: number, max: number) => void;
  toggleExcludeAmount: () => void;

  setDateRange: (start: string | null, end: string | null) => void;
  toggleIncludeExpired: () => void;

  setTimeFilter: (filter: TimeFilter) => void;

  setProjectCategory: (category: string) => void;
  setCompanyLimit: (limit: string) => void;
  setSortOrder: (order: string) => void;

  setCondition: (key: keyof SearchState['conditions'], value: boolean) => void;

  // 키워드 세트 관리
  saveKeywordSet: (name: string) => void;
  updateKeywordSet: (id: string, data: Partial<SavedKeywordSet>) => void;
  deleteKeywordSet: (id: string) => void;

  // 필터 리셋
  resetFilters: () => void;

  // 저장된 키워드 세트
  currentSetId: string | null;
  setCurrentSet: (id: string | null) => void;
  saveCurrentSet: (name: string, isShared: boolean) => void;
}

// 초기 키워드 행을 5개로 설정
const initialKeywordRows: KeywordRow[] = [
  { id: uuidv4(), conjunction: 'AND', keyword: '', searchField: 'title' },
  { id: uuidv4(), conjunction: 'AND', keyword: '', searchField: 'title' },
  { id: uuidv4(), conjunction: 'AND', keyword: '', searchField: 'title' },
  { id: uuidv4(), conjunction: 'AND', keyword: '', searchField: 'title' },
  { id: uuidv4(), conjunction: 'AND', keyword: '', searchField: 'title' },
];

// Create sample keyword sets for testing
const createSampleKeywordSets = () => {
  // 그룹 키워드셋
  const groupSets = [
    {
      id: 'group1',
      name: '신규_공용_그룹_2024_04_15',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'AND' as const,
          keyword: '인공지능',
          searchField: 'title' as const,
        },
      ],
      isShared: true,
    },
    {
      id: 'group2',
      name: '신규_공용_그룹_2024_06_22',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'AND' as const,
          keyword: '빅데이터',
          searchField: 'title' as const,
        },
      ],
      isShared: true,
    },
    {
      id: 'group3',
      name: '신규_공용_그룹_2024_09_10',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'OR' as const,
          keyword: '클라우드',
          searchField: 'content' as const,
        },
      ],
      isShared: true,
    },
    {
      id: 'group4',
      name: '신규_공용_그룹_2025_01_04',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'AND' as const,
          keyword: '핀테크',
          searchField: 'title' as const,
        },
        {
          id: uuidv4(),
          conjunction: 'OR' as const,
          keyword: '금융',
          searchField: 'content' as const,
        },
      ],
      isShared: true,
    },
    {
      id: 'group5',
      name: '신규_공용_그룹_2025_03_15',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'AND' as const,
          keyword: '보안',
          searchField: 'title' as const,
        },
        {
          id: uuidv4(),
          conjunction: 'AND' as const,
          keyword: '인증',
          searchField: 'content' as const,
        },
      ],
      isShared: true,
    },
  ];

  // 개인 키워드셋
  const personalSets = [
    {
      id: 'personal1',
      name: '신규_공용_개인_2024_03_12',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'AND' as const,
          keyword: '통신',
          searchField: 'title' as const,
        },
      ],
      isShared: false,
    },
    {
      id: 'personal2',
      name: '신규_공용_개인_2024_05_20',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'AND' as const,
          keyword: '네트워크',
          searchField: 'title' as const,
        },
      ],
      isShared: false,
    },
    {
      id: 'personal3',
      name: '신규_공용_개인_2024_08_15',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'AND' as const,
          keyword: '가상현실',
          searchField: 'title' as const,
        },
        {
          id: uuidv4(),
          conjunction: 'OR' as const,
          keyword: 'VR',
          searchField: 'content' as const,
        },
      ],
      isShared: false,
    },
    {
      id: 'personal4',
      name: '신규_공용_개인_2024_11_30',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'AND' as const,
          keyword: '블록체인',
          searchField: 'title' as const,
        },
        {
          id: uuidv4(),
          conjunction: 'OR' as const,
          keyword: '암호화폐',
          searchField: 'content' as const,
        },
      ],
      isShared: false,
    },
    {
      id: 'personal5',
      name: '신규_공용_개인_2025_02_18',
      keywordRows: [
        {
          id: uuidv4(),
          conjunction: 'OR' as const,
          keyword: '로봇',
          searchField: 'title' as const,
        },
        {
          id: uuidv4(),
          conjunction: 'OR' as const,
          keyword: '자동화',
          searchField: 'content' as const,
        },
      ],
      isShared: false,
    },
  ];

  return [...groupSets, ...personalSets];
};

export const useSearchStore = create<SearchState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기값
        filterType: 'shared',
        searchMode: 'advanced',
        selectedKeywordSetId: 'group1', // Default to first group
        isFiltersExpanded: true,

        keywordRows: initialKeywordRows,
        excludeTitleKeywords: [],
        excludeContentKeywords: [],
        minAmount: 0,
        maxAmount: 5000,
        excludeAmount: false,
        startDate: null,
        endDate: null,
        includeExpired: false,
        timeFilter: 'week',

        projectCategory: 'all',
        companyLimit: 'none',
        sortOrder: 'relevance',
        conditions: {
          bidConditionMet: false,
          itemConditionMet: false,
          jointSupplyAllowed: false,
          noPerformanceLimit: false,
          noCertificationLimit: false,
        },

        savedKeywordSets: createSampleKeywordSets(),

        // 액션 구현
        setSearchMode: mode => set({ searchMode: mode }),
        setFilterType: type => {
          console.log('Setting filter type to:', type);
          set({ filterType: type });

          // 필터 타입 변경 시 첫 번째 세트 선택 (키워드 행은 변경하지 않음)
          const allSets = get().savedKeywordSets;
          const filteredSets = allSets.filter(set =>
            type === 'shared' ? set.isShared : !set.isShared
          );

          if (filteredSets.length > 0) {
            set({ selectedKeywordSetId: filteredSets[0].id });
          }
        },
        selectKeywordSet: (id: string | null) => {
          // 키워드셋 ID 저장
          set({ selectedKeywordSetId: id });

          // 키워드셋이 선택되어도 사용자가 직접 입력한 키워드 행은 유지
          if (id) {
            const selectedSet = get().savedKeywordSets.find(set => set.id === id);
            if (selectedSet) {
              console.log('Selected keyword set:', selectedSet.name);
            }
          }
        },
        toggleFiltersExpanded: () =>
          set(state => ({ isFiltersExpanded: !state.isFiltersExpanded })),

        updateKeywordRow: (id, data) =>
          set(state => ({
            keywordRows: state.keywordRows.map(row => (row.id === id ? { ...row, ...data } : row)),
          })),

        // 키워드 행 삭제 시 빈 행을 자동으로 추가하여 항상 5개 유지
        removeKeywordRow: id =>
          set(state => {
            const filteredRows = state.keywordRows.filter(row => row.id !== id);

            // 이미 5개 이상이면 그대로 유지
            if (filteredRows.length >= 5) {
              return { keywordRows: filteredRows.slice(0, 5) };
            }

            // 5개 미만이면 빈 행을 추가하여 5개 맞춤
            const rowsToAdd = 5 - filteredRows.length;
            const newRows = [...filteredRows];

            for (let i = 0; i < rowsToAdd; i++) {
              newRows.push({
                id: uuidv4(),
                conjunction: 'AND',
                keyword: '',
                searchField: 'title',
              });
            }

            return { keywordRows: newRows };
          }),

        addExcludeTitleKeyword: keyword =>
          set(state => ({
            excludeTitleKeywords: [...state.excludeTitleKeywords, keyword],
          })),

        removeExcludeTitleKeyword: keyword =>
          set(state => ({
            excludeTitleKeywords: state.excludeTitleKeywords.filter(k => k !== keyword),
          })),

        addExcludeContentKeyword: keyword =>
          set(state => ({
            excludeContentKeywords: [...state.excludeContentKeywords, keyword],
          })),

        removeExcludeContentKeyword: keyword =>
          set(state => ({
            excludeContentKeywords: state.excludeContentKeywords.filter(k => k !== keyword),
          })),

        setAmountRange: (min, max) => set({ minAmount: min, maxAmount: max }),
        toggleExcludeAmount: () => set(state => ({ excludeAmount: !state.excludeAmount })),

        setDateRange: (start, end) => set({ startDate: start, endDate: end }),
        toggleIncludeExpired: () => set(state => ({ includeExpired: !state.includeExpired })),

        setTimeFilter: filter => set({ timeFilter: filter }),

        setProjectCategory: category => set({ projectCategory: category }),
        setCompanyLimit: limit => set({ companyLimit: limit }),
        setSortOrder: order => set({ sortOrder: order }),

        setCondition: (key, value) =>
          set(state => ({
            conditions: {
              ...state.conditions,
              [key]: value,
            },
          })),

        saveKeywordSet: name =>
          set(state => {
            const newSet = {
              id: uuidv4(),
              name,
              keywordRows: [...state.keywordRows],
              isShared: true,
            };

            return {
              savedKeywordSets: [...state.savedKeywordSets, newSet],
              selectedKeywordSetId: newSet.id,
            };
          }),

        updateKeywordSet: (id, data) =>
          set(state => ({
            savedKeywordSets: state.savedKeywordSets.map(set =>
              set.id === id ? { ...set, ...data } : set
            ),
          })),

        deleteKeywordSet: id =>
          set(state => ({
            savedKeywordSets: state.savedKeywordSets.filter(set => set.id !== id),
            selectedKeywordSetId:
              state.selectedKeywordSetId === id ? null : state.selectedKeywordSetId,
          })),

        resetFilters: () =>
          set({
            keywordRows: [...initialKeywordRows],
            excludeTitleKeywords: [],
            excludeContentKeywords: [],
            minAmount: 0,
            maxAmount: 5000,
            excludeAmount: false,
            startDate: null,
            endDate: null,
            includeExpired: false,
            timeFilter: 'week',
            projectCategory: 'all',
            companyLimit: 'none',
            sortOrder: 'relevance',
            conditions: {
              bidConditionMet: false,
              itemConditionMet: false,
              jointSupplyAllowed: false,
              noPerformanceLimit: false,
              noCertificationLimit: false,
            },
          }),

        currentSetId: null,
        setCurrentSet: id => set({ currentSetId: id }),
        saveCurrentSet: (name, isShared) =>
          set(state => {
            const newSet: SavedKeywordSet = {
              id: uuidv4(),
              name,
              keywordRows: [...state.keywordRows],
              isShared,
            };

            return {
              savedKeywordSets: [...state.savedKeywordSets, newSet],
              selectedKeywordSetId: newSet.id,
            };
          }),
      }),
      {
        name: 'bid-search-storage',
        version: 1, // Add version to force clean state if needed
      }
    )
  )
);
