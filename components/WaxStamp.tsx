import { View } from 'react-native';
import { Text } from './ui/Text';
import { MonoLabel } from './ui/MonoLabel';
import { colors } from '@/constants/tokens';

type Props = {
  age: number | string;  // "18"
  label?: string;        // "YEARS"
  size?: number;
  rotate?: number;       // degrees, default -12
};

// Aged wax-stamp emblem — rotated circle with double border, age + label inside.
// Matches .tasting .stamp from prototype.
export function WaxStamp({ age, label = 'YEARS', size = 56, rotate = -12 }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: colors.amberDeep,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.55,
        transform: [{ rotate: `${rotate}deg` }],
      }}
    >
      <Text
        variant="displayEnBold"
        tone="amberDeep"
        style={{ fontSize: size * 0.3, lineHeight: size * 0.32 }}
      >
        {String(age)}
      </Text>
      <View style={{ marginTop: 2 }}>
        <MonoLabel size={size * 0.11} tracking={1.4} tone="amberDeep">
          {label}
        </MonoLabel>
      </View>
    </View>
  );
}
