import { View } from 'react-native';
import { ShelfRow } from './ShelfRow';
import { BottleCard } from './BottleCard';
import type { Bottle } from '@/lib/types';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';

type Props = {
  bottles: Bottle[];
  ownedIds?: Set<string>;
  featuredId?: string | null;
  perShelf?: number;
  onBottlePress?: (bottle: Bottle) => void;
  lighting?: 'svg' | 'linear';
};

// Slices bottles into horizontal shelves (default 4 per shelf, matches prototype).
export function CabinetView({
  bottles,
  ownedIds,
  featuredId,
  perShelf = 4,
  onBottlePress,
  lighting,
}: Props) {
  const shelves: Bottle[][] = [];
  for (let i = 0; i < bottles.length; i += perShelf) {
    shelves.push(bottles.slice(i, i + perShelf));
  }

  return (
    <View>
      {shelves.map((row, idx) => (
        <ShelfRow key={idx}>
          {row.map((b) => {
            const dist = DISTILLERIES_SEED.find((d) => d.slug === b.distillerySlug);
            const displayName = dist?.name ?? b.fullName;
            const owned = ownedIds?.has(b.id) ?? false;
            const metaLine = owned
              ? `${b.ageYears ? b.ageYears + ' · ' : ''}${b.region}`
              : 'on wishlist';
            return (
              <BottleCard
                key={b.id}
                bottle={{
                  id: b.id,
                  distillerySlug: b.distillerySlug,
                  bottleStyle: b.bottleStyle,
                  region: b.region,
                  ageYears: b.ageYears,
                  displayName,
                  metaLine,
                }}
                isOwned={owned}
                isFeatured={featuredId === b.id}
                onPress={() => onBottlePress?.(b)}
                lighting={lighting}
              />
            );
          })}
        </ShelfRow>
      ))}
    </View>
  );
}
