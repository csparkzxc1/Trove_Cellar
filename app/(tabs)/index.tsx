import { ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandWordmark } from '@/components/BrandWordmark';
import { Crest } from '@/components/Crest';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { TastingNoteCard } from '@/components/TastingNoteCard';
import { colors } from '@/constants/tokens';
import { useAuth } from '@/stores/auth';

// Tasting Diary — primary surface.
// "위스키 시음 일기" — one pour at a time. Cellar is a side effect.
export default function DiaryScreen() {
  const session = useAuth((s) => s.session);
  const cask = session?.caskNumber ?? 'CASK 001';

  // Phase 1: no tastings yet — show invitation state.
  const tastings: never[] = [];

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
            onPress={() => {
              // Phase 2: route to tasting-note composer.
              // For now, this leads to the cellar so the user can pick a bottle.
            }}
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

        {/* Section divider — "what your first note will look like" */}
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

        {/* Invitation parchment card — sample preview */}
        {tastings.length === 0 ? (
          <>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text
                variant="displayEnItalic"
                tone="brassLight"
                style={{ fontSize: 15 }}
              >
                — preview of your first note —
              </Text>
            </View>
            <TastingNoteCard
              distillery=""
              placeholder="invitation"
            />
            <View style={{ alignItems: 'center', marginTop: 22 }}>
              <Text variant="serifKr" tone="inkMuted" style={{ fontSize: 13, lineHeight: 22, textAlign: 'center' }}>
                한 잔의 향과 맛, 피니쉬를 남기면{'\n'}이런 양피지 카드 한 장으로 보관됩니다.
              </Text>
            </View>
          </>
        ) : null}

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
