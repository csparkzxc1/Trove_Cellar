import { View, Pressable } from 'react-native';
import { Text } from './ui/Text';
import { colors } from '@/constants/tokens';

type Props = {
  value: number;          // 0–5
  onChange?: (v: number) => void;
  size?: number;
  tone?: 'brass' | 'amberDeep';
};

export function StarRating({ value, onChange, size = 28, tone = 'brass' }: Props) {
  const color = tone === 'brass' ? colors.brass : colors.amberDeep;
  const muted = tone === 'brass' ? colors.inkDeep : 'rgba(142, 74, 14, 0.3)';

  return (
    <View style={{ flexDirection: 'row', gap: size * 0.15 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const star = filled ? '★' : '☆';
        return (
          <Pressable
            key={n}
            onPress={() => onChange?.(value === n ? n - 1 : n)}
            hitSlop={6}
            disabled={!onChange}
          >
            <Text variant="displayEn" style={{ fontSize: size, color: filled ? color : muted, letterSpacing: 0 }}>
              {star}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
