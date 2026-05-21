import { ScrollView, Pressable, View } from 'react-native';
import { Text } from './ui/Text';
import { MonoLabel } from './ui/MonoLabel';
import { getBottleSvg } from './icons/bottles';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import { colors } from '@/constants/tokens';
import type { Bottle } from '@/lib/types';

type Props = {
  selectedId?: string;
  onSelect: (b: Bottle) => void;
};

// Horizontal scroll of seed bottles. Tapping one selects it for the tasting.
export function BottlePicker({ selectedId, onSelect }: Props) {
  return (
    <View>
      <View style={{ marginBottom: 8 }}>
        <MonoLabel tracking={2.5} tone="brass">시음한 위스키</MonoLabel>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8, gap: 12, paddingRight: 22 }}
      >
        {BOTTLES_SEED.map((b) => {
          const selected = selectedId === b.id;
          const dist = DISTILLERIES_SEED.find((d) => d.slug === b.distillerySlug);
          const Svg = getBottleSvg(b.bottleStyle);
          return (
            <Pressable
              key={b.id}
              onPress={() => onSelect(b)}
              style={{
                width: 78,
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 4,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: selected ? colors.brass : 'transparent',
                backgroundColor: selected ? 'rgba(184, 149, 78, 0.10)' : 'transparent',
              }}
            >
              <View style={{ opacity: selected ? 1 : 0.6 }}>
                <Svg width={42} height={88} />
              </View>
              <View style={{ marginTop: 8 }}>
                <Text
                  variant="displayEn"
                  tone={selected ? 'parchment' : 'inkMuted'}
                  style={{ fontSize: 10, textAlign: 'center', letterSpacing: 0.2 }}
                  numberOfLines={1}
                >
                  {dist?.name ?? b.fullName}
                </Text>
              </View>
              <View style={{ marginTop: 2 }}>
                <MonoLabel size={7} tracking={1} tone={selected ? 'brass' : 'inkDeep'}>
                  {b.ageYears ? `${b.ageYears} YR` : 'NAS'}
                </MonoLabel>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
