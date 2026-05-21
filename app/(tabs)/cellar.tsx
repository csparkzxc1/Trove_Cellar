import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BrandWordmark } from '@/components/BrandWordmark';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { StatsBar } from '@/components/StatsBar';
import { CabinetView } from '@/components/CabinetView';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { colors } from '@/constants/tokens';
import { useAuth } from '@/stores/auth';
import { useTastings } from '@/stores/tastings';

// Cellar — secondary surface. The diary (tab 1) is the primary experience;
// the cabinet here is collection support: see what you have, what's coming.
export default function CellarScreen() {
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const cask = session?.caskNumber ?? 'CASK 001';
  const tastings = useTastings((s) => s.tastings);

  const ownedIds = new Set(tastings.map((t) => t.bottleId));

  // Top-rated tasting per bottle (a user can have multiple tastings of one bottle).
  const bestStarsByBottle = new Map<string, number>();
  for (const t of tastings) {
    const stars = t.ratingStars ?? 0;
    const prev = bestStarsByBottle.get(t.bottleId) ?? 0;
    if (stars > prev) bestStarsByBottle.set(t.bottleId, stars);
  }

  // Owned bottles sorted by best rating (desc), then alpha by name
  const ownedBottles = BOTTLES_SEED.filter((b) => ownedIds.has(b.id)).sort((a, b) => {
    const ra = bestStarsByBottle.get(a.id) ?? 0;
    const rb = bestStarsByBottle.get(b.id) ?? 0;
    if (ra !== rb) return rb - ra;
    return a.fullName.localeCompare(b.fullName);
  });

  const totalRating =
    tastings.reduce((acc, t) => acc + (t.ratingStars ?? 0), 0) /
    Math.max(1, tastings.filter((t) => (t.ratingStars ?? 0) > 0).length);
  const estValue = ownedBottles.reduce((acc, b) => acc + (b.msrpKrw ?? 0), 0);

  // Lit owned bottles first, then unowned. Top-rated owned bottle is featured.
  const bottlesInOrder = [
    ...ownedBottles,
    ...BOTTLES_SEED.filter((b) => !ownedIds.has(b.id)),
  ];
  const total = bottlesInOrder.length;
  const featuredId = ownedBottles[0]?.id ?? null;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
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
          <BrandWordmark size="sm" />
          <View style={{ alignItems: 'flex-end' }}>
            <MonoLabel size={9} tracking={1.5}>{`MEMBER · ${cask}`}</MonoLabel>
          </View>
        </View>

        <View style={{ paddingTop: 32, paddingBottom: 18, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text variant="serifKr" tone="parchment" style={{ fontSize: 22 }}>
              내 셀러
            </Text>
            <Text
              variant="displayEnItalic"
              tone="brassLight"
              style={{ fontSize: 19, marginLeft: 10 }}
            >
              the cabinet
            </Text>
          </View>
          <View style={{ marginTop: 6 }}>
            <Text variant="displayEnItalic" tone="inkMuted" style={{ fontSize: 14 }}>
              Bottles I keep & bottles I chase.
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 36 }}>
          <StatsBar
            stats={[
              { key: 'Bottles', value: String(ownedBottles.length) },
              {
                key: 'Est. Value',
                value: estValue > 0 ? formatValue(estValue).num : '—',
                suffix: estValue > 0 ? formatValue(estValue).unit : undefined,
                prefix: '₩',
              },
              {
                key: 'Avg. Score',
                value: Number.isFinite(totalRating) && totalRating > 0 ? totalRating.toFixed(1) : '—',
                suffix: Number.isFinite(totalRating) && totalRating > 0 ? '/5' : undefined,
              },
            ]}
          />
        </View>

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
              진열대
            </Text>
            <Text
              variant="displayEnItalic"
              tone="brassLight"
              style={{ fontSize: 15, marginLeft: 8 }}
            >
              on display
            </Text>
          </View>
          <MonoLabel size={10} tracking={1.5}>{`${total} · curated`}</MonoLabel>
        </View>

        <CabinetView
          bottles={bottlesInOrder}
          ownedIds={ownedIds}
          featuredId={featuredId}
          perShelf={4}
          onBottlePress={(b) => router.push(`/bottle/${b.id}`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function formatValue(n: number): { num: string; unit?: string } {
  if (n >= 1_000_000) return { num: (n / 1_000_000).toFixed(1), unit: 'M' };
  if (n >= 10_000) return { num: String(Math.round(n / 10_000)), unit: '만' };
  return { num: n.toLocaleString('ko-KR') };
}
