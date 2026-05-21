import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from './ui/Text';
import { MonoLabel } from './ui/MonoLabel';
import { getBottleSvg } from './icons/bottles';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import { colors } from '@/constants/tokens';
import type { Recommendation } from '@/lib/recommendations';

type Props = {
  items: Recommendation[];
};

export function RecommendationRow({ items }: Props) {
  const router = useRouter();
  if (items.length === 0) return null;

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 14,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text variant="serifKr" tone="parchment" style={{ fontSize: 16 }}>
            다음 한 잔
          </Text>
          <Text variant="displayEnItalic" tone="brassLight" style={{ fontSize: 14, marginLeft: 8 }}>
            for you
          </Text>
        </View>
        <MonoLabel size={9} tracking={1.8}>curated</MonoLabel>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingRight: 22 }}
      >
        {items.map(({ bottle, reason }) => {
          const dist = DISTILLERIES_SEED.find((d) => d.slug === bottle.distillerySlug);
          const Svg = getBottleSvg(bottle.bottleStyle);
          return (
            <Pressable
              key={bottle.id}
              onPress={() => router.push(`/bottle/${bottle.id}`)}
              style={({ pressed }) => ({
                width: 156,
                padding: 14,
                backgroundColor: pressed ? 'rgba(184, 149, 78, 0.10)' : colors.bourbon,
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 2,
              })}
            >
              <View style={{ alignItems: 'center' }}>
                <Svg width={48} height={100} />
              </View>
              <View style={{ marginTop: 10 }}>
                <Text variant="displayEnBold" tone="parchment" style={{ fontSize: 14, textAlign: 'center' }} numberOfLines={1}>
                  {dist?.name ?? bottle.fullName}
                </Text>
                <View style={{ marginTop: 4, alignItems: 'center' }}>
                  <MonoLabel size={8} tracking={1.6}>
                    {`${bottle.ageYears ? bottle.ageYears + ' YR · ' : ''}${bottle.region}`}
                  </MonoLabel>
                </View>
                <View style={{ marginTop: 8 }}>
                  <Text
                    variant="serifAgedItalic"
                    tone="inkMuted"
                    style={{ fontSize: 11, lineHeight: 16, textAlign: 'center' }}
                    numberOfLines={2}
                  >
                    {reason}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
