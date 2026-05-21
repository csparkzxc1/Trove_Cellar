import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crest } from '@/components/Crest';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { colors } from '@/constants/tokens';

export default function AddScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.espresso }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 }}>
        <Crest size={42} color={colors.brass} />
        <View style={{ marginTop: 22 }}>
          <MonoLabel size={10} tracking={3.5} tone="brass">Add a bottle</MonoLabel>
        </View>
        <View style={{ marginTop: 18, alignItems: 'center' }}>
          <Text variant="serifKr" tone="parchment" style={{ fontSize: 22, lineHeight: 34, textAlign: 'center' }}>
            한 잔의 기록을{'\n'}남길 준비 중입니다.
          </Text>
        </View>
        <View style={{ marginTop: 14 }}>
          <Text variant="displayEnItalic" tone="inkMuted" style={{ fontSize: 14 }}>
            Coming in the next vintage.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
