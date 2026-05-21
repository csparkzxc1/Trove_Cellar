// Aggregations for the Profile insights panel.

import { BOTTLES_SEED } from '@/constants/bottles-seed';
import type { Tasting } from '@/lib/types';

export type DistributionItem = {
  key: string;
  count: number;
  pct: number;
};

export function regionDistribution(tastings: Tasting[]): DistributionItem[] {
  const counts = new Map<string, number>();
  for (const t of tastings) {
    const b = BOTTLES_SEED.find((x) => x.id === t.bottleId);
    if (!b) continue;
    counts.set(b.region, (counts.get(b.region) ?? 0) + 1);
  }
  return finalize(counts);
}

export function caskDistribution(tastings: Tasting[]): DistributionItem[] {
  const counts = new Map<string, number>();
  for (const t of tastings) {
    const b = BOTTLES_SEED.find((x) => x.id === t.bottleId);
    if (!b?.caskType) continue;
    for (const part of b.caskType.split('/')) {
      const k = part.trim();
      if (!k) continue;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return finalize(counts);
}

function finalize(counts: Map<string, number>): DistributionItem[] {
  const entries = [...counts.entries()];
  const total = entries.reduce((acc, [, n]) => acc + n, 0);
  if (total === 0) return [];
  return entries
    .map(([key, count]) => ({ key, count, pct: count / total }))
    .sort((a, b) => b.count - a.count);
}

export type MonthBucket = {
  year: number;
  month: number; // 1-12
  count: number;
  label: string; // "5월" / "Jan"
};

// Returns the last N months including this month, oldest → newest.
export function monthlyCounts(tastings: Tasting[], months = 6): MonthBucket[] {
  const now = new Date();
  const buckets: MonthBucket[] = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      count: 0,
      label: `${d.getMonth() + 1}월`,
    });
  }
  for (const t of tastings) {
    const d = new Date(t.tastedAt);
    const bucket = buckets.find((b) => b.year === d.getFullYear() && b.month === d.getMonth() + 1);
    if (bucket) bucket.count += 1;
  }
  return buckets;
}
