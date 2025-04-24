import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { BidItem } from '@/features/bidSearch/model/types';

interface FavoriteState {
  favorites: number[]; // 관심 공고 ID 배열
  toggleFavorite: (bidId: number) => void;
  isFavorite: (bidId: number) => boolean;
  getFavorites: () => number[];
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (bidId: number) => {
        const { favorites } = get();
        const isFavorited = favorites.includes(bidId);

        if (isFavorited) {
          // 이미 즐겨찾기된 경우 제거
          set({ favorites: favorites.filter(id => id !== bidId) });
        } else {
          // 즐겨찾기 추가
          set({ favorites: [...favorites, bidId] });
        }
      },

      isFavorite: (bidId: number) => {
        return get().favorites.includes(bidId);
      },

      getFavorites: () => {
        return get().favorites;
      },
    }),
    {
      name: 'favorite-bids-storage', // 로컬 스토리지 키 이름
    }
  )
);
