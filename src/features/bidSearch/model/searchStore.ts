import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type FilterType = 'personal' | 'shared';
export type SearchMode = 'simple' | 'ai' | 'advanced';
export type FilterConjunction = 'AND' | 'OR';

export interface KeywordRow {
  id: number;
  conjunction: FilterConjunction;
  keyword: string;
}

export interface SavedKeywordSet {
  id: string;
  name: string;
  keywords: KeywordRow[];
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
  timeFilter: 'day' | 'week' | 'month' | 'year' | 'all';

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

  addKeywordRow: (conjunction?: FilterConjunction) => void;
  updateKeywordRow: (id: number, data: Partial<KeywordRow>) => void;
  removeKeywordRow: (id: number) => void;

  addExcludeTitleKeyword: (keyword: string) => void;
  removeExcludeTitleKeyword: (keyword: string) => void;

  addExcludeContentKeyword: (keyword: string) => void;
  removeExcludeContentKeyword: (keyword: string) => void;

  setAmountRange: (min: number, max: number) => void;
  toggleExcludeAmount: () => void;

  setDateRange: (start: string | null, end: string | null) => void;
  toggleIncludeExpired: () => void;

  setTimeFilter: (filter: 'day' | 'week' | 'month' | 'year' | 'all') => void;

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
}

const initialKeywordRows: KeywordRow[] = [{ id: 1, conjunction: 'AND', keyword: '' }];

export const useSearchStore = create<SearchState>()(
  devtools(
    persist(
      set => ({
        // 초기값
        filterType: 'shared',
        searchMode: 'advanced',
        selectedKeywordSetId: null,
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

        savedKeywordSets: [
          {
            id: 'default',
            name: '신규_그룹_요즘_2024_11_15',
            keywords: [{ id: 1, conjunction: 'AND', keyword: '인증지능' }],
          },
        ],

        // 액션 구현
        setSearchMode: mode => set({ searchMode: mode }),
        setFilterType: type => set({ filterType: type }),
        selectKeywordSet: id => {
          set(state => {
            if (!id) return { selectedKeywordSetId: null };

            const keywordSet = state.savedKeywordSets.find(set => set.id === id);
            if (!keywordSet) return { selectedKeywordSetId: null };

            return {
              selectedKeywordSetId: id,
              keywordRows: [...keywordSet.keywords],
            };
          });
        },
        toggleFiltersExpanded: () =>
          set(state => ({ isFiltersExpanded: !state.isFiltersExpanded })),

        addKeywordRow: (conjunction = 'OR') =>
          set(state => ({
            keywordRows: [
              ...state.keywordRows,
              {
                id: Date.now(),
                conjunction,
                keyword: '',
              },
            ],
          })),

        updateKeywordRow: (id, data) =>
          set(state => ({
            keywordRows: state.keywordRows.map(row => (row.id === id ? { ...row, ...data } : row)),
          })),

        removeKeywordRow: id =>
          set(state => ({
            keywordRows: state.keywordRows.filter(row => row.id !== id),
          })),

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
              id: `set_${Date.now()}`,
              name,
              keywords: [...state.keywordRows],
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
          }),
      }),
      {
        name: 'bid-search-storage',
      }
    )
  )
);
