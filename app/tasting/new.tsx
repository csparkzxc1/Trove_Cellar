import { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Divider } from '@/components/ui/Divider';
import { BottlePicker } from '@/components/BottlePicker';
import { StarRating } from '@/components/StarRating';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import { colors } from '@/constants/tokens';
import { useTastings } from '@/stores/tastings';
import { useWishlist } from '@/stores/wishlist';
import { identifyLabel, isOcrConfigured } from '@/lib/labelOcr';
import type { Bottle } from '@/lib/types';

export default function TastingComposerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bottleId?: string; edit?: string }>();
  const addTasting = useTastings((s) => s.add);
  const updateTasting = useTastings((s) => s.update);
  const existing = useTastings((s) => (params.edit ? s.tastings.find((t) => t.id === params.edit) : undefined));
  const removeFromWishlist = useWishlist((s) => s.remove);
  const isOnWishlist = useWishlist((s) => s.has);

  const isEditMode = !!existing;
  const initialBottleId = existing?.bottleId ?? params.bottleId;

  const [bottle, setBottle] = useState<Bottle | undefined>(
    initialBottleId ? BOTTLES_SEED.find((b) => b.id === initialBottleId) : undefined
  );
  const [nose, setNose] = useState(existing?.nose ?? '');
  const [palate, setPalate] = useState(existing?.palate ?? '');
  const [finish, setFinish] = useState(existing?.finish ?? '');
  const [stars, setStars] = useState(existing?.ratingStars ?? 0);
  const [setting, setSetting] = useState(existing?.setting ?? '');
  const [ocrLoading, setOcrLoading] = useState(false);

  const distillery = useMemo(
    () => bottle && DISTILLERIES_SEED.find((d) => d.slug === bottle.distillerySlug),
    [bottle]
  );

  const canSave = !!bottle && (nose || palate || finish || stars > 0);

  const onScan = async () => {
    setOcrLoading(true);
    try {
      let uri = 'camera://stub';
      // Use the actual camera/library only when running on a native device.
      if (Platform.OS !== 'web') {
        const useCamera = await new Promise<'camera' | 'library' | null>((resolve) => {
          Alert.alert('라벨 사진', '어떻게 추가할까요?', [
            { text: '취소', style: 'cancel', onPress: () => resolve(null) },
            { text: '사진 보관함', onPress: () => resolve('library') },
            { text: '카메라', onPress: () => resolve('camera') },
          ]);
        });
        if (!useCamera) return;

        if (useCamera === 'camera') {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) {
            Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: false,
          });
          if (result.canceled) return;
          uri = result.assets[0]?.uri ?? uri;
        } else {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!perm.granted) {
            Alert.alert('권한 필요', '사진 보관함 권한이 필요합니다.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: false,
          });
          if (result.canceled) return;
          uri = result.assets[0]?.uri ?? uri;
        }
      }

      const guess = await identifyLabel(uri);
      setBottle(guess.bottle);
    } finally {
      setOcrLoading(false);
    }
  };

  const onSave = () => {
    if (!bottle) return;
    const fields = {
      nose: nose.trim() || undefined,
      palate: palate.trim() || undefined,
      finish: finish.trim() || undefined,
      ratingStars: stars || undefined,
      setting: setting.trim() || undefined,
    };

    if (isEditMode && existing) {
      updateTasting(existing.id, { ...fields, bottleId: bottle.id });
      router.replace(`/tasting/${existing.id}`);
      return;
    }

    const t = addTasting({
      bottleId: bottle.id,
      tastedAt: new Date().toISOString(),
      ...fields,
    });

    // If the user had this bottle on their wishlist, drop it: they've now
    // tasted it. Let them know with a soft confirmation.
    if (isOnWishlist(bottle.id)) {
      removeFromWishlist(bottle.id);
      Alert.alert('위시리스트에서 정리했습니다', '한 잔을 마셨으니 더 이상 기다리지 않아요.', [
        { text: '확인' },
      ]);
    }

    router.replace(`/tasting/${t.id}`);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top nav */}
          <View style={{ paddingTop: 12, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Text variant="mono" tone="brass" upper tracking={2.5} style={{ fontSize: 11 }}>
                ← Cancel
              </Text>
            </Pressable>
            <MonoLabel size={9} tracking={2.5}>{isEditMode ? 'edit tasting' : 'new tasting'}</MonoLabel>
          </View>

          {/* Title */}
          <View style={{ marginBottom: 24, alignItems: 'center' }}>
            <Text variant="serifKr" tone="parchment" style={{ fontSize: 24, lineHeight: 34, textAlign: 'center' }}>
              {isEditMode ? '노트 다듬기' : '오늘의 한 잔'}
            </Text>
            <View style={{ marginTop: 6 }}>
              <Text variant="displayEnItalic" tone="brassLight" style={{ fontSize: 15 }}>
                {isEditMode ? 'Refine the note.' : 'One pour, one memory.'}
              </Text>
            </View>
          </View>

          {/* OCR scan CTA */}
          <Pressable
            onPress={() => {
              if (!isOcrConfigured) {
                Alert.alert(
                  '라벨 자동 식별',
                  'Claude Vision API 키가 설정되지 않았습니다. 데모용 식별을 진행할까요?',
                  [
                    { text: '취소', style: 'cancel' },
                    { text: '데모 실행', onPress: onScan },
                  ]
                );
              } else {
                onScan();
              }
            }}
            style={({ pressed }) => ({
              paddingVertical: 14,
              paddingHorizontal: 18,
              borderWidth: 1,
              borderColor: pressed ? colors.brass : colors.line,
              borderStyle: 'dashed',
              borderRadius: 2,
              marginBottom: 28,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: ocrLoading ? 0.6 : 1,
            })}
            disabled={ocrLoading}
          >
            <View style={{ flex: 1 }}>
              <MonoLabel size={9} tracking={2.5} tone="brass">
                {ocrLoading ? '식별 중 …' : '📷 라벨로 자동 채우기'}
              </MonoLabel>
              <View style={{ marginTop: 4 }}>
                <Text variant="serifAged" tone="inkMuted" style={{ fontSize: 12 }}>
                  Snap the label — Claude reads the distillery, age, ABV
                </Text>
              </View>
            </View>
            {ocrLoading && <ActivityIndicator color={colors.brass} />}
          </Pressable>

          {/* Bottle picker */}
          <BottlePicker selectedId={bottle?.id} onSelect={setBottle} />

          {bottle && distillery && (
            <View
              style={{
                marginTop: 14,
                paddingVertical: 12,
                paddingHorizontal: 14,
                backgroundColor: 'rgba(184, 149, 78, 0.08)',
                borderRadius: 2,
              }}
            >
              <MonoLabel size={8} tracking={2.5} tone="brass">{distillery.region}</MonoLabel>
              <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Text variant="displayEnBold" tone="parchment" style={{ fontSize: 18 }}>
                  {distillery.name}
                </Text>
                <Text variant="mono" tone="brassLight" style={{ fontSize: 10, letterSpacing: 1.5 }}>
                  {bottle.ageYears ? `${bottle.ageYears} YR` : 'NAS'} · {bottle.abv}%
                </Text>
              </View>
            </View>
          )}

          <Divider />

          {/* Notes — Nose / Palate / Finish */}
          <NoteField
            label="Nose · 향"
            hint="첫 향을 한 줄로 남겨주세요."
            value={nose}
            onChangeText={setNose}
          />
          <NoteField
            label="Palate · 맛"
            hint="혀에 닿은 인상을 적어주세요."
            value={palate}
            onChangeText={setPalate}
          />
          <NoteField
            label="Finish · 피니쉬"
            hint="남은 여운을 기록해주세요."
            value={finish}
            onChangeText={setFinish}
          />

          {/* Rating */}
          <View style={{ marginTop: 18, alignItems: 'center' }}>
            <MonoLabel size={9} tracking={2.5} tone="brass">평점</MonoLabel>
            <View style={{ marginTop: 10 }}>
              <StarRating value={stars} onChange={setStars} size={32} />
            </View>
          </View>

          {/* Setting (optional) */}
          <View style={{ marginTop: 22 }}>
            <View style={{ marginBottom: 8 }}>
              <MonoLabel tracking={2.5} tone="brass">자리 · setting</MonoLabel>
            </View>
            <TextInput
              value={setting}
              onChangeText={setSetting}
              placeholder="혼자 · 친구와 · 위스키 동호회 …"
              placeholderTextColor={colors.inkDeep}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
                paddingVertical: 10,
                color: colors.ink,
                fontSize: 14,
                fontFamily: 'EBGaramond_400Regular',
              }}
            />
          </View>

          {/* Save */}
          <View style={{ marginTop: 36 }}>
            <Pressable
              onPress={onSave}
              disabled={!canSave}
              style={({ pressed }) => ({
                paddingVertical: 16,
                alignItems: 'center',
                backgroundColor: !canSave ? colors.walnut : pressed ? colors.amberDeep : colors.brass,
                borderRadius: 2,
                opacity: !canSave ? 0.6 : 1,
              })}
            >
              <Text
                variant="displayEn"
                tone="bourbon"
                style={{ fontSize: 13, letterSpacing: 3.5, textTransform: 'uppercase' }}
              >
                {isEditMode ? '노트 갱신' : '한 잔의 기록 보관'}
              </Text>
              <View style={{ marginTop: 3 }}>
                <Text variant="displayEnItalic" tone="amberDeep" style={{ fontSize: 11, opacity: 0.85 }}>
                  {isEditMode ? 'Update note' : 'Save tasting'}
                </Text>
              </View>
            </Pressable>
            {!canSave && (
              <View style={{ marginTop: 10, alignItems: 'center' }}>
                <Text variant="serifAged" tone="inkDeep" style={{ fontSize: 12 }}>
                  위스키와 노트 한 줄 또는 평점이 필요합니다.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function NoteField({
  label,
  hint,
  value,
  onChangeText,
}: {
  label: string;
  hint: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View style={{ marginTop: 18 }}>
      <View style={{ marginBottom: 6 }}>
        <MonoLabel tracking={2.5} tone="brass">{label}</MonoLabel>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={hint}
        placeholderTextColor={colors.inkDeep}
        multiline
        style={{
          minHeight: 56,
          paddingVertical: 10,
          paddingHorizontal: 12,
          color: colors.ink,
          fontSize: 14,
          lineHeight: 22,
          fontFamily: 'NotoSerifKR_500Medium',
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 2,
          textAlignVertical: 'top',
        }}
      />
    </View>
  );
}
