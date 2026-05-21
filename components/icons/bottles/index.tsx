import type { BottleStyle } from '@/lib/types';
import { BottleMalt } from './BottleMalt';
import { BottleBourbon } from './BottleBourbon';
import { BottleJapan } from './BottleJapan';
import { BottleIslay } from './BottleIslay';
import { BottleHighland } from './BottleHighland';
import { BottleEmpty } from './BottleEmpty';

export { BottleMalt, BottleBourbon, BottleJapan, BottleIslay, BottleHighland, BottleEmpty };

const map = {
  malt: BottleMalt,
  bourbon: BottleBourbon,
  japan: BottleJapan,
  islay: BottleIslay,
  highland: BottleHighland,
} as const;

export function getBottleSvg(style: BottleStyle) {
  return map[style];
}
