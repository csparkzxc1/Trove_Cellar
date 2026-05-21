// Label OCR — Claude Vision integration (Phase 2).
//
// In production, this sends the captured photo as base64 to claude-opus-4-7
// with a structured-output prompt asking for { distillery, age, abv, cask, ... }.
// For the current build we ship a deterministic stub that picks a likely match
// from the local seed catalog so the composer can demonstrate the UX flow
// without requiring an API key.

import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import type { Bottle } from '@/lib/types';

export type OcrGuess = {
  bottle: Bottle;
  confidence: number;        // 0–1
  rawDistilleryText?: string;
  rawAgeText?: string;
  rawAbvText?: string;
};

// Stubbed identifier — rotates through seed bottles to simulate "scan another label".
let cursor = 0;
const order = [
  'glenfiddich-18',
  'ardbeg-10',
  'yamazaki-12',
  'macallan-12',
  'lagavulin-16',
  'highland-park-15',
  'hibiki-harmony',
  'talisker-10',
  'makers-mark',
  'buffalo-trace',
  'ardbeg-uigeadail',
  'glenfiddich-12',
];

export async function identifyLabel(_imageUri: string): Promise<OcrGuess> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 1100));

  const id = order[cursor % order.length];
  cursor += 1;

  const bottle = BOTTLES_SEED.find((b) => b.id === id) ?? BOTTLES_SEED[0];
  const dist = DISTILLERIES_SEED.find((d) => d.slug === bottle.distillerySlug);
  return {
    bottle,
    confidence: 0.78 + Math.random() * 0.18,
    rawDistilleryText: dist?.name,
    rawAgeText: bottle.ageYears ? `${bottle.ageYears} Years Old` : undefined,
    rawAbvText: `${bottle.abv}% Vol`,
  };
}

export const isOcrConfigured = false; // flips to true when CLAUDE_API_KEY set
