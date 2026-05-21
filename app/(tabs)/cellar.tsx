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

// Cellar — secondary surface. The diary (tab 1) is the primary experience;
// the cabinet here is collection support: see what you have, what's coming.
export default function CellarScreen() {
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const cask = session?.caskNumber ?? 'CASK 001';

  const ownedIds = new Set<string>();
  const total = BOTTLES_SEED.length;

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
              { key: 'Bottles', value: '0' },
              { key: 'Est. Value', value: '—', prefix: '₩' },
              { key: 'Avg. Score', value: '—' },
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
          bottles={BOTTLES_SEED}
          ownedIds={ownedIds}
          featuredId={null}
          perShelf={4}
          onBottlePress={(b) => router.push(`/bottle/${b.id}`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
