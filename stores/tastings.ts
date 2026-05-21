import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Tasting } from '@/lib/types';

type State = {
  tastings: Tasting[];
  add: (t: Omit<Tasting, 'id' | 'userId'>) => Tasting;
  update: (id: string, patch: Partial<Tasting>) => void;
  remove: (id: string) => void;
  byBottle: (bottleId: string) => Tasting[];
  get: (id: string) => Tasting | undefined;
};

// Persisted tasting store. Hydrated from AsyncStorage on app start.
// Phase 2 will sync these rows to Supabase when configured.
export const useTastings = create<State>()(
  persist(
    (set, get) => ({
      tastings: [],
      add: (input) => {
        const t: Tasting = {
          id: `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
          userId: 'demo-user',
          ...input,
        };
        set((s) => ({ tastings: [t, ...s.tastings] }));
        return t;
      },
      update: (id, patch) =>
        set((s) => ({
          tastings: s.tastings.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      remove: (id) => set((s) => ({ tastings: s.tastings.filter((t) => t.id !== id) })),
      byBottle: (bottleId) => get().tastings.filter((t) => t.bottleId === bottleId),
      get: (id) => get().tastings.find((t) => t.id === id),
    }),
    {
      name: 'trove-cellar:tastings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ tastings: s.tastings }),
    }
  )
);
