import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WishlistEntry = {
  bottleId: string;
  addedAt: string;
  notes?: string;
  priority: number;
};

type State = {
  items: WishlistEntry[];
  add: (bottleId: string, notes?: string) => void;
  remove: (bottleId: string) => void;
  toggle: (bottleId: string) => void;
  has: (bottleId: string) => boolean;
};

export const useWishlist = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      add: (bottleId, notes) => {
        if (get().has(bottleId)) return;
        set((s) => ({
          items: [
            { bottleId, addedAt: new Date().toISOString(), notes, priority: 0 },
            ...s.items,
          ],
        }));
      },
      remove: (bottleId) =>
        set((s) => ({ items: s.items.filter((i) => i.bottleId !== bottleId) })),
      toggle: (bottleId) => {
        if (get().has(bottleId)) get().remove(bottleId);
        else get().add(bottleId);
      },
      has: (bottleId) => get().items.some((i) => i.bottleId === bottleId),
    }),
    {
      name: 'trove-cellar:wishlist',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);
