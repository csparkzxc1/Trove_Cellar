import { useMemo, useRef, useState } from 'react';
import { ScrollView, View, Pressable, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ViewShot, { captureRef, type ViewShotRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { TastingNoteCard } from '@/components/TastingNoteCard';
import { BrandWordmark } from '@/components/BrandWordmark';
import { Crest } from '@/components/Crest';
import { useTastings } from '@/stores/tastings';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import { colors } from '@/constants/tokens';

// Instagram-portrait ratio (4:5 ≈ 1080x1350). Brief specified 1:1.4 — we use
// 4:5 since Instagram caps portrait at 1080x1350. The parchment card sits
// centered with brass header and wordmark footer to brand the screenshot.

// Instagram portrait — 4:5 ratio (1080×1350). Card is large; ViewShot grows to
// fit so nothing gets clipped, capturing the full parchment as a tall canvas.
const SHARE_WIDTH = 360;

export default function ShareTastingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tastings = useTastings((s) => s.tastings);
  const tasting = tastings.find((t) => t.id === id);
  const seq = tasting
    ? String(tastings.length - tastings.findIndex((t) => t.id === id)).padStart(2, '0')
    : '00';
  const ref = useRef<ViewShotRef>(null);
  const [busy, setBusy] = useState(false);

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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="serifKr" tone="inkMuted">시음 노트를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const tastedDate = formatDate(tasting.tastedAt);

  const onShare = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Web preview', '실 디바이스에서 PNG 캡처 + 공유가 가능합니다.');
      return;
    }
    setBusy(true);
    try {
      const uri = await captureRef(ref, { format: 'png', quality: 1, result: 'tmpfile' });
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share tasting' });
      } else {
        Alert.alert('Saved', `Card saved to: ${uri}`);
      }
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80, alignItems: 'center' }}>
        {/* Top nav */}
        <View style={{ width: '100%', paddingHorizontal: 22, paddingTop: 12, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text variant="mono" tone="brass" upper tracking={2.5} style={{ fontSize: 11 }}>
              ← Note
            </Text>
          </Pressable>
          <MonoLabel size={9} tracking={2.5}>share preview</MonoLabel>
        </View>

        <View style={{ paddingHorizontal: 14, marginBottom: 18, alignItems: 'center' }}>
          <Text variant="displayEnItalic" tone="brassLight" style={{ fontSize: 16 }}>
            Instagram-ready · 4:5
          </Text>
          <View style={{ marginTop: 6 }}>
            <Text variant="serifAged" tone="inkMuted" style={{ fontSize: 13, textAlign: 'center' }}>
              인스타 스토리/피드에 그대로 올릴 수 있는 양피지 카드입니다.
            </Text>
          </View>
        </View>

        {/* Capturable share canvas */}
        <ViewShot
          ref={ref}
          options={{ format: 'png', quality: 1 }}
          style={{
            width: SHARE_WIDTH,
            backgroundColor: colors.espresso,
            padding: 20,
            gap: 16,
            shadowColor: '#000',
            shadowOpacity: 0.5,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
          }}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <BrandWordmark size="sm" />
            <Crest size={20} color={colors.brass} />
          </View>

          {/* Tasting card */}
          <View>
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
          </View>

          {/* Footer */}
          <View style={{ alignItems: 'center' }}>
            <MonoLabel size={7} tracking={2.5} tone="brass">
              trove · cellar
            </MonoLabel>
            <View style={{ marginTop: 3 }}>
              <Text variant="displayEnItalic" tone="inkMuted" style={{ fontSize: 10 }}>
                where every dram becomes a memory
              </Text>
            </View>
          </View>
        </ViewShot>

        {/* Action */}
        <View style={{ width: '100%', paddingHorizontal: 22, marginTop: 28 }}>
          <Pressable
            onPress={onShare}
            disabled={busy}
            style={({ pressed }) => ({
              paddingVertical: 16,
              alignItems: 'center',
              backgroundColor: pressed ? colors.amberDeep : colors.brass,
              borderRadius: 2,
              opacity: busy ? 0.6 : 1,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            })}
          >
            {busy && <ActivityIndicator color={colors.bourbon} />}
            <Text
              variant="serifKrBold"
              tone="bourbon"
              style={{ fontSize: 14, letterSpacing: 1 }}
            >
              내보내기
            </Text>
            <View style={{ marginTop: 3 }}>
              <Text variant="displayEnItalic" tone="amberDeep" style={{ fontSize: 11, opacity: 0.85 }}>
                Export PNG
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
