// Phase 1: returns seed data directly. Phase 2 will hit Supabase.
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import type { Bottle } from '@/lib/types';

export function useBottles(): { data: Bottle[]; isLoading: boolean } {
  return { data: BOTTLES_SEED, isLoading: false };
}

export function useBottle(id: string | undefined): { data: Bottle | undefined; isLoading: boolean } {
  if (!id) return { data: undefined, isLoading: false };
  return { data: BOTTLES_SEED.find((b) => b.id === id), isLoading: false };
}
