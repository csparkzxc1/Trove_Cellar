import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crest } from '@/components/Crest';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { getBottleSvg } from '@/components/icons/bottles';
import { useWishlist } from '@/stores/wishlist';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import { colors } from '@/constants/tokens';

export default function WishlistScreen() {
  const router = useRouter();
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 80 }}>
        <View
          style={{
            paddingVertical: 22,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text variant="serifKr" tone="parchment" style={{ fontSize: 20 }}>위시리스트</Text>
            <Text variant="displayEnItalic" tone="brassLight" style={{ fontSize: 16, marginLeft: 8 }}>
              the next pour
            </Text>
          </View>
          <MonoLabel size={10} tracking={1.5}>{`${items.length} · waiting`}</MonoLabel>
        </View>

        {items.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 96 }}>
            <Crest size={36} color={colors.brass} />
            <View style={{ marginTop: 20 }}>
              <Text variant="serifKr" tone="parchment" style={{ fontSize: 18, lineHeight: 28, textAlign: 'center' }}>
                {`다음 한 병을\n기다리는 중.`}
              </Text>
            </View>
            <View style={{ marginTop: 12, paddingHorizontal: 22 }}>
              <Text variant="displayEnItalic" tone="inkMuted" style={{ fontSize: 14, textAlign: 'center' }}>
                Add bottles you want to taste next.
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ marginTop: 18, gap: 10 }}>
            {items.map((entry) => {
              const bottle = BOTTLES_SEED.find((b) => b.id === entry.bottleId);
              const dist = bottle && DISTILLERIES_SEED.find((d) => d.slug === bottle.distillerySlug);
              if (!bottle || !dist) return null;
              const Svg = getBottleSvg(bottle.bottleStyle);

              return (
                <Pressable
                  key={entry.bottleId}
                  onPress={() => router.push(`/bottle/${bottle.id}`)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    backgroundColor: pressed ? 'rgba(184, 149, 78, 0.10)' : colors.bourbon,
                    borderWidth: 1,
                    borderColor: colors.line,
                    borderRadius: 2,
                  })}
                >
                  <View style={{ width: 44, alignItems: 'center' }}>
                    <Svg width={36} height={76} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                      <Text variant="displayEnBold" tone="parchment" style={{ fontSize: 16 }}>
                        {dist.name}
                      </Text>
                      <Text variant="mono" tone="brass" style={{ fontSize: 9, letterSpacing: 1.5, marginLeft: 8 }}>
                        {bottle.ageYears ? `${bottle.ageYears} YR` : 'NAS'}
                      </Text>
                    </View>
                    <View style={{ marginTop: 4 }}>
                      <MonoLabel size={8} tracking={1.5}>
                        {`${bottle.region} · ${bottle.caskType}`}
                      </MonoLabel>
                    </View>
                    {bottle.msrpKrw && (
                      <View style={{ marginTop: 4 }}>
                        <Text variant="mono" tone="brassLight" style={{ fontSize: 10, letterSpacing: 1 }}>
                          ₩{formatKrw(bottle.msrpKrw)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Pressable
                    onPress={() => remove(entry.bottleId)}
                    hitSlop={12}
                    style={{ paddingHorizontal: 8, paddingVertical: 12 }}
                  >
                    <Text variant="mono" tone="inkDeep" style={{ fontSize: 16 }}>×</Text>
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatKrw(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 10_000)}만`;
  return n.toLocaleString('ko-KR');
}
