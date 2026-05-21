import { useMemo } from 'react';
import { ScrollView, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { TastingNoteCard } from '@/components/TastingNoteCard';
import { useTastings } from '@/stores/tastings';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import { colors } from '@/constants/tokens';

export default function TastingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tastings = useTastings((s) => s.tastings);
  const tasting = tastings.find((t) => t.id === id);
  const remove = useTastings((s) => s.remove);
  // Sequence number = position in user's diary, oldest = 1
  const seq = tasting
    ? String(tastings.length - tastings.findIndex((t) => t.id === id)).padStart(2, '0')
    : '00';

  const bottle = useMemo(
    () => tasting && BOTTLES_SEED.find((b) => b.id === tasting.bottleId),
    [tasting]
  );
  const distillery = useMemo(
    () => bottle && DISTILLERIES_SEED.find((d) => d.slug === bottle.distillerySlug),
    [bottle]
  );

  if (!tasting || !bottle || !distillery) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.espresso }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text variant="serifKr" tone="inkMuted" style={{ fontSize: 16 }}>
            해당 시음 노트를 찾을 수 없습니다.
          </Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <MonoLabel tracking={2.5} tone="brass">Go back</MonoLabel>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const tastedDate = formatDate(tasting.tastedAt);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 80 }}>
        {/* Top nav */}
        <View style={{ paddingTop: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text variant="mono" tone="brass" upper tracking={2.5} style={{ fontSize: 11 }}>
              ← Diary
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Alert.alert('삭제하시겠습니까?', '이 시음 노트는 복구할 수 없습니다.', [
                { text: '취소', style: 'cancel' },
                {
                  text: '삭제',
                  style: 'destructive',
                  onPress: () => {
                    remove(tasting.id);
                    router.back();
                  },
                },
              ]);
            }}
            hitSlop={12}
          >
            <Text variant="mono" tone="inkDeep" upper tracking={2.5} style={{ fontSize: 10 }}>
              Discard
            </Text>
          </Pressable>
        </View>

        {/* Caption */}
        <View style={{ alignItems: 'center', paddingVertical: 22 }}>
          <Text variant="displayEnItalic" tone="brassLight" style={{ fontSize: 17 }}>
            Tasting №{seq}
          </Text>
          <View style={{ marginTop: 4 }}>
            <MonoLabel size={9} tracking={2.7}>{tastedDate}</MonoLabel>
          </View>
        </View>

        {/* The actual tasting card */}
        <TastingNoteCard
          number={seq}
          region={bottle.region}
          distillery={distillery.name}
          expression={bottle.expression}
          age={bottle.ageYears}
          nose={tasting.nose}
          palate={tasting.palate}
          finish={tasting.finish}
          cask={bottle.caskType}
          abv={bottle.abv}
          ratingStars={tasting.ratingStars}
          acquiredAt={tastedDate}
        />

        {/* Share + edit */}
        <View style={{ marginTop: 28, gap: 12 }}>
          <Pressable
            onPress={() => router.push(`/tasting/share/${tasting.id}`)}
            style={({ pressed }) => ({
              paddingVertical: 14,
              alignItems: 'center',
              backgroundColor: pressed ? colors.amberDeep : colors.brass,
              borderRadius: 2,
            })}
          >
            <Text
              variant="displayEn"
              tone="bourbon"
              style={{ fontSize: 13, letterSpacing: 3.5, textTransform: 'uppercase' }}
            >
              인스타로 보내기
            </Text>
            <View style={{ marginTop: 3 }}>
              <Text variant="displayEnItalic" tone="amberDeep" style={{ fontSize: 11, opacity: 0.85 }}>
                Share card
              </Text>
            </View>
          </Pressable>
        </View>

        {tasting.setting && (
          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <MonoLabel tracking={2.5} tone="inkMuted">자리</MonoLabel>
            <View style={{ marginTop: 4 }}>
              <Text variant="serifKr" tone="parchment" style={{ fontSize: 14 }}>
                {tasting.setting}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}
