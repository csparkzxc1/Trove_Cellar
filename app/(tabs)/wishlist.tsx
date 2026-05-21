import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crest } from '@/components/Crest';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { colors } from '@/constants/tokens';

export default function WishlistScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 80 }}>
        <View
          style={{
            paddingVertical: 22,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text variant="serifKr" tone="parchment" style={{ fontSize: 20 }}>위시리스트</Text>
            <Text variant="displayEnItalic" tone="brassLight" style={{ fontSize: 16, marginLeft: 8 }}>
              the next pour
            </Text>
          </View>
          <MonoLabel size={10} tracking={1.5}>0 · waiting</MonoLabel>
        </View>

        <View style={{ alignItems: 'center', paddingVertical: 96 }}>
          <Crest size={36} color={colors.brass} />
          <View style={{ marginTop: 20 }}>
            <Text variant="serifKr" tone="parchment" style={{ fontSize: 18, lineHeight: 28, textAlign: 'center' }}>
              다음 한 병을{'\n'}기다리는 중.
            </Text>
          </View>
          <View style={{ marginTop: 12 }}>
            <Text variant="displayEnItalic" tone="inkMuted" style={{ fontSize: 14 }}>
              Awaiting the next bottle.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
