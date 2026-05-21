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

const apiKey =
  process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
export const isOcrConfigured = apiKey.length > 0;

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

function stubGuess(): OcrGuess {
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

export async function identifyLabel(imageUri: string): Promise<OcrGuess> {
  if (!isOcrConfigured) {
    await new Promise((r) => setTimeout(r, 1100));
    return stubGuess();
  }

  // Real Claude Vision call — only enabled when key is set.
  // The image needs to be fetched and converted to base64 first.
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const r = reader.result;
      if (typeof r === 'string') resolve(r.split(',')[1] ?? '');
      else reject(new Error('Failed to read image'));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const known = BOTTLES_SEED.map((b) => {
    const d = DISTILLERIES_SEED.find((x) => x.slug === b.distillerySlug);
    return `${b.id}: ${d?.name} ${b.name} (${b.ageYears ?? 'NAS'}yr, ${b.abv}%, ${b.caskType})`;
  }).join('\n');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-opus-4-7',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
            },
            {
              type: 'text',
              text: `Read this whisky bottle label and identify which catalog entry it matches.
Return ONLY a JSON object: {"bottleId": "<id>", "confidence": 0.0-1.0, "distillery": "<text>", "age": "<text>", "abv": "<text>"}.
If no good match, set bottleId to null.

Catalog:
${known}`,
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    return stubGuess();
  }

  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return stubGuess();

  try {
    const parsed = JSON.parse(match[0]) as {
      bottleId?: string | null;
      confidence?: number;
      distillery?: string;
      age?: string;
      abv?: string;
    };
    const bottle = parsed.bottleId
      ? BOTTLES_SEED.find((b) => b.id === parsed.bottleId)
      : undefined;
    if (!bottle) return stubGuess();
    return {
      bottle,
      confidence: parsed.confidence ?? 0.7,
      rawDistilleryText: parsed.distillery,
      rawAgeText: parsed.age,
      rawAbvText: parsed.abv,
    };
  } catch {
    return stubGuess();
  }
}
