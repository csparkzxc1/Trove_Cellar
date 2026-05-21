import { View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/tokens';

type Props = ViewProps & {
  variant?: 'panel' | 'flat';
};

// Brass-edged dark panel matching .stats-bar from prototype.
export function Card({ variant = 'panel', style, children, ...rest }: Props) {
  if (variant === 'flat') {
    return (
      <View
        style={[
          {
            backgroundColor: colors.bourbon,
            borderColor: colors.line,
            borderWidth: 1,
            borderRadius: 2,
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        {
          borderColor: colors.line,
          borderWidth: 1,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
        },
        style,
      ]}
      {...rest}
    >
      <LinearGradient
        colors={[colors.bourbon, colors.walnut]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
      />
      {/* Brass strip at top — matches .stats-bar::before */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          marginLeft: -30,
          width: 60,
          height: 2,
          backgroundColor: colors.brass,
        }}
      />
      {children}
    </View>
  );
}
