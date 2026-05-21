import { useMemo } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Divider } from '@/components/ui/Divider';
import { Card } from '@/components/ui/Card';
import { BottleCard } from '@/components/BottleCard';
import { TastingNoteCard } from '@/components/TastingNoteCard';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import { colors } from '@/constants/tokens';

export default function BottleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const bottle = useMemo(() => BOTTLES_SEED.find((b) => b.id === id), [id]);
  const distillery = useMemo(
    () => bottle && DISTILLERIES_SEED.find((d) => d.slug === bottle.distillerySlug),
    [bottle]
  );

  if (!bottle || !distillery) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.espresso }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text variant="serifKr" tone="inkMuted" style={{ fontSize: 16 }}>
            해당 위스키를 찾을 수 없습니다.
          </Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <MonoLabel tracking={2.5} tone="brass">Go back</MonoLabel>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 80 }}>
        {/* Back nav */}
        <View style={{ paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text variant="mono" tone="brass" upper tracking={2.5} style={{ fontSize: 11 }}>
              ← Cellar
            </Text>
          </Pressable>
        </View>

        {/* Hero — single bottle with full pin light */}
        <View
          style={{
            alignItems: 'center',
            paddingTop: 40,
            paddingBottom: 36,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
          }}
        >
          <View style={{ width: 120, alignItems: 'center' }}>
            <BottleCard
              bottle={{
                id: bottle.id,
                distillerySlug: bottle.distillerySlug,
                bottleStyle: bottle.bottleStyle,
                region: bottle.region,
                ageYears: bottle.ageYears,
                displayName: distillery.name,
                metaLine: bottle.ageYears
                  ? `${bottle.ageYears} · ${bottle.region}`
                  : bottle.region,
              }}
              isOwned
              isFeatured
            />
          </View>
        </View>

        {/* Distillery info */}
        <View style={{ marginTop: 28, alignItems: 'center' }}>
          <MonoLabel tracking={2.7} tone="brass">{distillery.region}</MonoLabel>
          <View style={{ marginTop: 8 }}>
            <Text variant="displayEnBold" tone="parchment" style={{ fontSize: 28, letterSpacing: 0.4 }}>
              {distillery.name}
            </Text>
          </View>
          <View style={{ marginTop: 4 }}>
            <Text variant="serifKr" tone="inkMuted" style={{ fontSize: 14 }}>
              {distillery.nameKo}
            </Text>
          </View>
          {bottle.expression && (
            <View style={{ marginTop: 10, paddingHorizontal: 24 }}>
              <Text
                variant="displayEnItalic"
                tone="brassLight"
                style={{ fontSize: 16, textAlign: 'center', lineHeight: 22 }}
              >
                {bottle.expression}
              </Text>
            </View>
          )}
        </View>

        <Divider />

        {/* Specs grid */}
        <Card variant="flat" style={{ paddingVertical: 22 }}>
          <View style={{ flexDirection: 'row' }}>
            <SpecCell label="Age" value={bottle.ageYears ? `${bottle.ageYears} YR` : 'NAS'} />
            <SpecCell label="ABV" value={`${bottle.abv}%`} />
            <SpecCell label="Cask" value={bottle.caskType} />
          </View>
          <View style={{ height: 14 }} />
          <View style={{ flexDirection: 'row' }}>
            <SpecCell label="Region" value={bottle.region} />
            <SpecCell
              label="MSRP"
              value={bottle.msrpKrw ? `₩${formatKrw(bottle.msrpKrw)}` : '—'}
            />
            <SpecCell label="Country" value={distillery.country} />
          </View>
        </Card>

        {/* Tasting note placeholder */}
        <View style={{ marginTop: 36, marginBottom: 22, alignItems: 'center' }}>
          <Text variant="displayEnItalic" tone="brassLight" style={{ fontSize: 17 }}>
            Latest tasting
          </Text>
          <View style={{ marginTop: 4 }}>
            <MonoLabel size={9} tracking={2.7}>note №000</MonoLabel>
          </View>
        </View>

        <TastingNoteCard
          number="01"
          region={bottle.region}
          distillery={distillery.name}
          expression={bottle.expression}
          age={bottle.ageYears}
          cask={bottle.caskType}
          abv={bottle.abv}
          placeholder="detail"
        />

        {/* Actions — tasting is primary; cellar is a side effect */}
        <View style={{ marginTop: 28, gap: 12 }}>
          <Pressable
            style={({ pressed }) => ({
              paddingVertical: 16,
              alignItems: 'center',
              backgroundColor: pressed ? colors.amberDeep : colors.brass,
              borderRadius: 2,
              shadowColor: '#C8761F',
              shadowOpacity: 0.3,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            })}
          >
            <Text
              variant="displayEn"
              tone="bourbon"
              style={{ fontSize: 13, letterSpacing: 3.5, textTransform: 'uppercase' }}
            >
              시음 노트 남기기
            </Text>
            <View style={{ marginTop: 3 }}>
              <Text
                variant="displayEnItalic"
                tone="amberDeep"
                style={{ fontSize: 11, opacity: 0.85 }}
              >
                Record a tasting
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => ({
              paddingVertical: 13,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: pressed ? colors.brass : colors.line,
              borderRadius: 2,
            })}
          >
            <Text
              variant="mono"
              tone="inkMuted"
              upper
              tracking={2.5}
              style={{ fontSize: 10 }}
            >
              Add to cellar
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => ({
              paddingVertical: 10,
              alignItems: 'center',
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Text
              variant="mono"
              tone="inkDeep"
              upper
              tracking={2.5}
              style={{ fontSize: 9 }}
            >
              + Save to wishlist
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <MonoLabel size={8} tracking={2.2}>{label}</MonoLabel>
      <View style={{ marginTop: 6 }}>
        <Text
          variant="displayEn"
          tone="parchment"
          style={{ fontSize: 14, letterSpacing: 0.4, textAlign: 'center' }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function formatKrw(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 10_000)}만`;
  return n.toLocaleString('ko-KR');
}
