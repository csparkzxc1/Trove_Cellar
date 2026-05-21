import { BOTTLES_SEED } from '@/constants/bottles-seed';
import type { Bottle, Tasting } from '@/lib/types';

// Lightweight recommendation: rank unseen bottles by overlap of region + cask
// with the user's higher-rated tastings.

export type Recommendation = {
  bottle: Bottle;
  score: number;
  reason: string;        // "Speyside · Sherry — based on Glenfiddich 18"
};

export function recommendNext(
  tastings: Tasting[],
  ownedBottleIds: Set<string>,
  limit = 3,
): Recommendation[] {
  if (tastings.length === 0) {
    // No taste profile yet — show three approachable starters across styles
    return [
      'glenfiddich-12',
      'ardbeg-10',
      'yamazaki-12',
    ]
      .map((id) => BOTTLES_SEED.find((b) => b.id === id))
      .filter((b): b is Bottle => !!b)
      .map((bottle) => ({
        bottle,
        score: 0.5,
        reason: `${bottle.region} · ${bottle.caskType} — 첫 한 잔으로 추천`,
      }));
  }

  // Build a weighted preference map.
  const regionWeight = new Map<string, number>();
  const caskWeight = new Map<string, number>();
  const styleWeight = new Map<string, number>();

  for (const t of tastings) {
    const b = BOTTLES_SEED.find((x) => x.id === t.bottleId);
    if (!b) continue;
    // Star rating weights the preference (default to 3 if no rating).
    const w = (t.ratingStars ?? 3) / 5;
    regionWeight.set(b.region, (regionWeight.get(b.region) ?? 0) + w);
    if (b.caskType) {
      // Cask string can be "Mizunara/Sherry/Bourbon" — split and weight each.
      for (const part of b.caskType.split('/')) {
        const k = part.trim();
        caskWeight.set(k, (caskWeight.get(k) ?? 0) + w);
      }
    }
    styleWeight.set(b.bottleStyle, (styleWeight.get(b.bottleStyle) ?? 0) + w);
  }

  // Score each unseen bottle.
  const candidates = BOTTLES_SEED.filter(
    (b) => !ownedBottleIds.has(b.id) && !tastings.some((t) => t.bottleId === b.id)
  );

  const scored = candidates.map((b) => {
    const r = regionWeight.get(b.region) ?? 0;
    const caskParts = b.caskType.split('/').map((s) => s.trim());
    const c = caskParts.reduce((acc, p) => acc + (caskWeight.get(p) ?? 0), 0) / Math.max(1, caskParts.length);
    const s = styleWeight.get(b.bottleStyle) ?? 0;
    const score = r * 1.0 + c * 0.7 + s * 0.4;

    // Reason: pick the strongest contributor.
    const topRegion = [...regionWeight.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const topCask = [...caskWeight.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const reasonBits: string[] = [];
    if (b.region === topRegion) reasonBits.push(b.region);
    if (caskParts.some((p) => p === topCask)) reasonBits.push(topCask!);
    const reason = reasonBits.length
      ? `${reasonBits.join(' · ')} 취향과 잘 맞습니다`
      : `${b.region} · ${b.caskType}`;

    return { bottle: b, score, reason };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter((r) => r.score > 0);
}
