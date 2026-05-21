import { View, type ViewProps } from 'react-native';
import { Text } from './ui/Text';

type Props = ViewProps & {
  size?: 'sm' | 'md' | 'lg';
};

// TROVE cellar wordmark — Fraunces serif + italic sub, matches prototype .brand.
export function BrandWordmark({ size = 'md', style, ...rest }: Props) {
  const sizes = {
    sm: { trove: 18, cellar: 14, gap: 3 },
    md: { trove: 24, cellar: 19, gap: 4 },
    lg: { trove: 32, cellar: 25, gap: 5 },
  }[size];

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'baseline' }, style]} {...rest}>
      <Text
        variant="displayEn"
        tone="parchment"
        style={{ fontSize: sizes.trove, letterSpacing: sizes.trove * 0.18 }}
      >
        TROVE
      </Text>
      <Text
        variant="displayEnItalic"
        tone="brassLight"
        style={{
          fontSize: sizes.cellar,
          letterSpacing: 0.5,
          marginLeft: sizes.gap,
        }}
      >
        cellar
      </Text>
    </View>
  );
}
