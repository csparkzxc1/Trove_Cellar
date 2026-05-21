import { create } from 'zustand';
import type { Tasting } from '@/lib/types';

type State = {
  tastings: Tasting[];
  add: (t: Omit<Tasting, 'id' | 'userId'>) => Tasting;
  update: (id: string, patch: Partial<Tasting>) => void;
  remove: (id: string) => void;
  byBottle: (bottleId: string) => Tasting[];
  get: (id: string) => Tasting | undefined;
};

// In-memory tasting store. Phase 2 will swap to Supabase + AsyncStorage hydration.
export const useTastings = create<State>((set, get) => ({
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
}));
