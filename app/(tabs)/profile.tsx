import { useState } from 'react';
import { View, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crest } from '@/components/Crest';
import { BrandWordmark } from '@/components/BrandWordmark';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Card } from '@/components/ui/Card';
import { InsightsPanel } from '@/components/InsightsPanel';
import { colors } from '@/constants/tokens';
import { useAuth } from '@/stores/auth';
import { useTastings } from '@/stores/tastings';
import { useWishlist } from '@/stores/wishlist';
import { exportTastingsPdf } from '@/lib/pdfExport';
import { BOTTLES_SEED } from '@/constants/bottles-seed';

export default function ProfileScreen() {
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const signOut = useAuth((s) => s.signOut);
  const tastings = useTastings((s) => s.tastings);
  const wishlistItems = useWishlist((s) => s.items);
  const [exporting, setExporting] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Leave the cellar?', '저장된 노트는 다음 로그인 시 그대로 남습니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '나가기',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleExport = async () => {
    if (tastings.length === 0) {
      Alert.alert('아직 시음 노트가 없습니다', '첫 잔의 기록부터 남겨주세요.');
      return;
    }
    setExporting(true);
    try {
      await exportTastingsPdf(tastings);
    } catch (e) {
      Alert.alert('Export failed', String(e));
    } finally {
      setExporting(false);
    }
  };

  // Derived stats
  const ownedCount = new Set(tastings.map((t) => t.bottleId)).size;
  const estValue = tastings.reduce((acc, t) => {
    const b = BOTTLES_SEED.find((x) => x.id === t.bottleId);
    return acc + (b?.msrpKrw ?? 0);
  }, 0);
  const ratings = tastings.filter((t) => (t.ratingStars ?? 0) > 0);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((acc, t) => acc + (t.ratingStars ?? 0), 0) / ratings.length
      : 0;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 80 }}>
        <View
          style={{
            paddingVertical: 22,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
            alignItems: 'center',
          }}
        >
          <BrandWordmark />
          <View style={{ marginTop: 8 }}>
            <MonoLabel size={9} tracking={2.2}>{`private member · ${session?.caskNumber ?? '—'}`}</MonoLabel>
          </View>
        </View>

        <View style={{ alignItems: 'center', paddingTop: 36, paddingBottom: 28 }}>
          <Crest size={42} color={colors.brass} />
          <View style={{ marginTop: 18 }}>
            <Text variant="serifKr" tone="parchment" style={{ fontSize: 18 }}>
              {session?.email ?? 'cellar.member@trove.kr'}
            </Text>
          </View>
        </View>

        {/* Personal stats */}
        <Card variant="flat" style={{ paddingVertical: 18, paddingHorizontal: 22, marginBottom: 18 }}>
          <View style={{ flexDirection: 'row' }}>
            <StatItem label="Tastings" value={String(tastings.length)} />
            <StatItem label="Bottles" value={String(ownedCount)} />
            <StatItem label="Avg. ★" value={avgRating > 0 ? avgRating.toFixed(1) : '—'} />
          </View>
          <View style={{ height: 14 }} />
          <View style={{ flexDirection: 'row' }}>
            <StatItem
              label="Est. Value"
              value={estValue > 0 ? `₩${formatKrw(estValue)}` : '—'}
            />
            <StatItem label="Wishlist" value={String(wishlistItems.length)} />
            <StatItem label="Since" value="2026" />
          </View>
        </Card>

        {/* Insights */}
        {tastings.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <InsightsPanel tastings={tastings} />
          </View>
        )}

        {/* Actions */}
        <Pressable
          onPress={handleExport}
          disabled={exporting}
          style={({ pressed }) => ({
            paddingVertical: 16,
            paddingHorizontal: 18,
            backgroundColor: pressed ? 'rgba(184, 149, 78, 0.10)' : colors.bourbon,
            borderWidth: 1,
            borderColor: pressed ? colors.brass : colors.line,
            borderRadius: 2,
            marginBottom: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: exporting ? 0.6 : 1,
          })}
        >
          <View style={{ flex: 1 }}>
            <MonoLabel size={10} tracking={2.5} tone="brass">PDF Catalog · 카탈로그 PDF</MonoLabel>
            <View style={{ marginTop: 4 }}>
              <Text variant="serifAged" tone="inkMuted" style={{ fontSize: 12 }}>
                모든 시음 노트를 양피지 카탈로그로 저장
              </Text>
            </View>
          </View>
          {exporting && <ActivityIndicator color={colors.brass} />}
        </Pressable>

        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => ({
            paddingVertical: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: pressed ? colors.amberDeep : colors.line,
            borderRadius: 2,
            marginTop: 24,
          })}
        >
          <Text variant="mono" tone="inkMuted" upper tracking={2.5} style={{ fontSize: 11 }}>
            Leave the cellar
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text variant="displayEn" tone="parchment" style={{ fontSize: 20, letterSpacing: -0.2 }}>
        {value}
      </Text>
      <View style={{ marginTop: 4 }}>
        <MonoLabel size={8} tracking={1.8}>{label}</MonoLabel>
      </View>
    </View>
  );
}

function formatKrw(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 10_000)}만`;
  return n.toLocaleString('ko-KR');
}
