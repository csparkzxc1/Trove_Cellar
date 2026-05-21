import { Text } from './Text';
import type { TextStyle } from 'react-native';

type Props = {
  children: string;
  tone?: 'brass' | 'inkMuted' | 'amberDeep' | 'inkDeep';
  size?: number;
  tracking?: number;
  style?: TextStyle;
};

// Small uppercase mono caption — used for section labels, stat keys, dates, etc.
export function MonoLabel({
  children,
  tone = 'inkMuted',
  size = 9,
  tracking = 2.2,
  style,
}: Props) {
  return (
    <Text
      variant="mono"
      tone={tone}
      upper
      tracking={tracking}
      style={[{ fontSize: size }, style]}
    >
      {children}
    </Text>
  );
}
