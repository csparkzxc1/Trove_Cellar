import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BrandWordmark } from '@/components/BrandWordmark';
import { Crest } from '@/components/Crest';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { StatsBar } from '@/components/StatsBar';
import { CabinetView } from '@/components/CabinetView';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { colors } from '@/constants/tokens';
import { useAuth } from '@/stores/auth';

export default function CellarScreen() {
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const cask = session?.caskNumber ?? 'CASK 001';

  // Phase 1: no owned bottles yet — render the seed as a wishlist preview.
  const ownedIds = new Set<string>();
  const total = BOTTLES_SEED.length;

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
              Private Whisky Library
            </MonoLabel>
          </View>
          <View style={{ marginTop: 14, alignItems: 'center' }}>
            <Text
              variant="serifKr"
              tone="parchment"
              style={{ fontSize: 28, lineHeight: 40, textAlign: 'center', letterSpacing: -0.3 }}
            >
              당신의 한 잔이
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text
                variant="displayEnItalic"
                tone="brassLight"
                style={{ fontSize: 28, lineHeight: 40 }}
              >
                기록
              </Text>
              <Text
                variant="serifKr"
                tone="parchment"
                style={{ fontSize: 28, lineHeight: 40 }}
              >
                이 되는 곳.
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 12 }}>
            <Text variant="displayEnItalic" tone="inkMuted" style={{ fontSize: 16, letterSpacing: 0.3 }}>
              Where every dram becomes a memory.
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{ marginTop: 16, marginBottom: 48 }}>
          <StatsBar
            stats={[
              { key: 'Bottles', value: '0' },
              { key: 'Est. Value', value: '—', prefix: '₩' },
              { key: 'Avg. Score', value: '—' },
            ]}
          />
        </View>

        {/* Section label */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingBottom: 12,
            marginBottom: 18,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text variant="serifKr" tone="parchment" style={{ fontSize: 17 }}>
              내 셀러
            </Text>
            <Text
              variant="displayEnItalic"
              tone="brassLight"
              style={{ fontSize: 15, marginLeft: 8 }}
            >
              the cabinet
            </Text>
          </View>
          <MonoLabel size={10} tracking={1.5}>{`${total} · curated`}</MonoLabel>
        </View>

        {/* Cabinet (12 seed bottles, all wishlist state for Phase 1) */}
        <CabinetView
          bottles={BOTTLES_SEED}
          ownedIds={ownedIds}
          featuredId={null}
          perShelf={4}
          onBottlePress={(b) => router.push(`/bottle/${b.id}`)}
        />

        {/* Manifesto */}
        <View
          style={{
            paddingTop: 56,
            paddingBottom: 36,
            paddingHorizontal: 12,
            marginTop: 24,
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
