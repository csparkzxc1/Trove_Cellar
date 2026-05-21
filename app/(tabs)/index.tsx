import { useMemo } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BrandWordmark } from '@/components/BrandWordmark';
import { Crest } from '@/components/Crest';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { TastingNoteCard } from '@/components/TastingNoteCard';
import { StarRating } from '@/components/StarRating';
import { RecommendationRow } from '@/components/RecommendationRow';
import { colors } from '@/constants/tokens';
import { useAuth } from '@/stores/auth';
import { useTastings } from '@/stores/tastings';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import { recommendNext } from '@/lib/recommendations';
import type { Tasting } from '@/lib/types';

export default function DiaryScreen() {
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const cask = session?.caskNumber ?? 'CASK 001';
  const tastings = useTastings((s) => s.tastings);
  const ownedIds = useMemo(() => new Set(tastings.map((t) => t.bottleId)), [tastings]);
  const recs = useMemo(() => recommendNext(tastings, ownedIds, 3), [tastings, ownedIds]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingVertical: 22,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
          }}
        >
          <BrandWordmark />
          <View style={{ alignItems: 'flex-end' }}>
            <MonoLabel size={9} tracking={1.5}>{`MEMBER · ${cask}`}</MonoLabel>
            <View style={{ marginTop: 2, opacity: 0.65 }}>
              <MonoLabel size={9} tracking={1.5}>Est. 2026</MonoLabel>
            </View>
          </View>
        </View>

        {/* Intro */}
        <View style={{ alignItems: 'center', paddingTop: 48, paddingBottom: 24 }}>
          <Crest size={36} />
          <View style={{ marginTop: 20 }}>
            <MonoLabel size={10} tracking={3.5} tone="brass">
              The Tasting Diary
            </MonoLabel>
          </View>
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <Text
              variant="serifKr"
              tone="parchment"
              style={{ fontSize: 26, lineHeight: 40, textAlign: 'center', letterSpacing: -0.3 }}
            >
              오늘 한 잔의
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text
                variant="displayEnItalic"
                tone="brassLight"
                style={{ fontSize: 26, lineHeight: 40 }}
              >
                기록
              </Text>
              <Text
                variant="serifKr"
                tone="parchment"
                style={{ fontSize: 26, lineHeight: 40 }}
              >
                을 남겨주세요.
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 12 }}>
            <Text variant="displayEnItalic" tone="inkMuted" style={{ fontSize: 15, letterSpacing: 0.3 }}>
              One dram, one memory.
            </Text>
          </View>
        </View>

        {/* Primary CTA */}
        <View style={{ marginTop: 14, marginBottom: 40 }}>
          <Pressable
            onPress={() => router.push('/tasting/new')}
            style={({ pressed }) => ({
              paddingVertical: 18,
              alignItems: 'center',
              backgroundColor: pressed ? colors.amberDeep : colors.brass,
              borderRadius: 2,
              shadowColor: '#C8761F',
              shadowOpacity: 0.3,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 4,
            })}
          >
            <Text
              variant="displayEn"
              tone="bourbon"
              style={{ fontSize: 14, letterSpacing: 3.5, textTransform: 'uppercase' }}
            >
              시음 노트 남기기
            </Text>
            <View style={{ marginTop: 4 }}>
              <Text
                variant="displayEnItalic"
                tone="amberDeep"
                style={{ fontSize: 12, opacity: 0.8 }}
              >
                Record a tasting
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Section divider */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingBottom: 12,
            marginBottom: 22,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text variant="serifKr" tone="parchment" style={{ fontSize: 17 }}>
              내 노트
            </Text>
            <Text
              variant="displayEnItalic"
              tone="brassLight"
              style={{ fontSize: 15, marginLeft: 8 }}
            >
              your notes
            </Text>
          </View>
          <MonoLabel size={10} tracking={1.5}>{`${tastings.length} · entries`}</MonoLabel>
        </View>

        {tastings.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={{ gap: 14 }}>
            {tastings.map((t) => (
              <TastingListRow
                key={t.id}
                tasting={t}
                onPress={() => router.push(`/tasting/${t.id}`)}
              />
            ))}
          </View>
        )}

        {/* Recommendations */}
        {recs.length > 0 && (
          <View style={{ marginTop: 44 }}>
            <RecommendationRow items={recs} />
          </View>
        )}

        {/* Manifesto */}
        <View
          style={{
            paddingTop: 56,
            paddingBottom: 36,
            paddingHorizontal: 12,
            marginTop: 36,
            borderTopWidth: 1,
            borderTopColor: colors.line,
            alignItems: 'center',
          }}
        >
          <Text
            variant="displayEnItalic"
            tone="parchment"
            style={{ fontSize: 21, lineHeight: 31, textAlign: 'center', marginBottom: 14 }}
          >
            {`"Some bottles are meant to be drunk.\nOthers, remembered."`}
          </Text>
          <View style={{ alignItems: 'center' }}>
            <Text variant="serifKr" tone="inkMuted" style={{ fontSize: 15, lineHeight: 26 }}>
              어떤 잔은 비우기 위해,
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text variant="serifKr" tone="inkMuted" style={{ fontSize: 15, lineHeight: 26 }}>
                어떤 잔은{' '}
              </Text>
              <Text variant="displayEn" tone="brassLight" style={{ fontSize: 15 }}>
                기억하기 위해.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState() {
  return (
    <>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text variant="displayEnItalic" tone="brassLight" style={{ fontSize: 15 }}>
          — preview of your first note —
        </Text>
      </View>
      <TastingNoteCard distillery="" placeholder="invitation" />
      <View style={{ alignItems: 'center', marginTop: 22 }}>
        <Text variant="serifKr" tone="inkMuted" style={{ fontSize: 13, lineHeight: 22, textAlign: 'center' }}>
          {`한 잔의 향과 맛, 피니쉬를 남기면\n이런 양피지 카드 한 장으로 보관됩니다.`}
        </Text>
      </View>
    </>
  );
}

function TastingListRow({ tasting, onPress }: { tasting: Tasting; onPress: () => void }) {
  const bottle = BOTTLES_SEED.find((b) => b.id === tasting.bottleId);
  const dist = bottle && DISTILLERIES_SEED.find((d) => d.slug === bottle.distillerySlug);
  if (!bottle || !dist) return null;

  const date = formatDate(tasting.tastedAt);
  const preview = tasting.nose || tasting.palate || tasting.finish || '— 노트 없이 평점만 남김 —';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        padding: 18,
        backgroundColor: pressed ? 'rgba(184, 149, 78, 0.08)' : colors.bourbon,
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: 2,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text variant="displayEnBold" tone="parchment" style={{ fontSize: 18, letterSpacing: 0.3 }}>
              {dist.name}
            </Text>
            <Text variant="mono" tone="brass" style={{ fontSize: 10, letterSpacing: 1.5, marginLeft: 8 }}>
              {bottle.ageYears ? `${bottle.ageYears} YR` : 'NAS'}
            </Text>
          </View>
          <View style={{ marginTop: 4 }}>
            <MonoLabel size={8} tracking={2} tone="inkMuted">{bottle.region}</MonoLabel>
          </View>
        </View>
        <MonoLabel size={9} tracking={1.5} tone="inkDeep">{date}</MonoLabel>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text
          variant="serifKr"
          tone="ink"
          style={{ fontSize: 13, lineHeight: 21, opacity: 0.85 }}
          numberOfLines={2}
        >
          {preview}
        </Text>
      </View>
      {(tasting.ratingStars ?? 0) > 0 && (
        <View style={{ marginTop: 10, opacity: 0.85 }}>
          <StarRating value={tasting.ratingStars ?? 0} size={14} tone="brass" />
        </View>
      )}
    </Pressable>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
