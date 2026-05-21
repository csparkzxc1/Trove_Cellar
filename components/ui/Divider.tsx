import { View } from 'react-native';
import { Text } from './Text';
import { colors } from '@/constants/tokens';

type Props = {
  diamond?: boolean;
  tone?: 'line' | 'parchment';
};

// Horizontal divider. With diamond=true, draws ◆ centered on the line
// (matches .tasting .divider in prototype).
export function Divider({ diamond, tone = 'line' }: Props) {
  const lineColor = tone === 'parchment' ? colors.parchmentAged : colors.line;
  const bgColor = tone === 'parchment' ? colors.parchment : colors.espresso;
  const diamondColor = tone === 'parchment' ? colors.amberDeep : colors.brass;

  return (
    <View style={{ position: 'relative', height: 1, backgroundColor: lineColor, marginVertical: 18 }}>
      {diamond && (
        <View
          style={{
            position: 'absolute',
            top: -7,
            left: '50%',
            marginLeft: -10,
            paddingHorizontal: 8,
            backgroundColor: bgColor,
          }}
        >
          <Text style={{ color: diamondColor, fontSize: 10 }}>◆</Text>
        </View>
      )}
    </View>
  );
}
