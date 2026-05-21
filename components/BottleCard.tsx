import { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Text } from './ui/Text';
import { MonoLabel } from './ui/MonoLabel';
import { PinLight, PinLightLinear } from './PinLight';
import { getBottleSvg, BottleEmpty } from './icons/bottles';
import { colors } from '@/constants/tokens';
import type { Bottle } from '@/lib/types';

type Props = {
  bottle: Pick<Bottle, 'id' | 'distillerySlug' | 'bottleStyle' | 'region' | 'ageYears'> & {
    displayName: string;
    metaLine?: string;
  };
  isOwned: boolean;
  isFeatured?: boolean;
  onPress?: () => void;
  // Lighting backend — defaults to SVG. Set 'linear' to use the
  // expo-linear-gradient implementation for side-by-side comparison.
  lighting?: 'svg' | 'linear';
};

const Cone = ({ kind, variant }: { kind: 'svg' | 'linear'; variant: 'default' | 'featured' | 'empty' }) =>
  kind === 'svg' ? <PinLight variant={variant} /> : <PinLightLinear variant={variant} />;

export function BottleCard({ bottle, isOwned, isFeatured, onPress, lighting = 'svg' }: Props) {
  const variant = !isOwned ? 'empty' : isFeatured ? 'featured' : 'default';
  const Silhouette = isOwned ? getBottleSvg(bottle.bottleStyle) : BottleEmpty;

  // Hover/touch lift (translateY -4)
  const lift = useSharedValue(0);
  const liftStyle = useAnimatedStyle(() => ({ transform: [{ translateY: lift.value }] }));

  // Featured glow pulse (matches @keyframes glow in prototype)
  const glow = useSharedValue(0);
  useEffect(() => {
    if (!isFeatured) return;
    glow.value = withRepeat(
      withSequence(withTiming(1, { duration: 2500 }), withTiming(0, { duration: 2500 })),
      -1
    );
  }, [isFeatured, glow]);

  const glowStyle = useAnimatedStyle(() => ({
    shadowColor: '#C8761F',
    shadowOpacity: 0.25 * glow.value,
    shadowRadius: 8 + 8 * glow.value,
    shadowOffset: { width: 0, height: 8 },
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (lift.value = withSpring(-4, { damping: 15, stiffness: 150 }))}
      onPressOut={() => (lift.value = withSpring(0, { damping: 15, stiffness: 150 }))}
      style={{ flex: 1, maxWidth: 92, alignItems: 'center', position: 'relative' }}
    >
      <Animated.View style={[{ alignItems: 'center', width: '100%' }, liftStyle]}>
        {/* Pin lights — z below silhouette */}
        <Cone kind={lighting} variant={variant} />

        {/* Silhouette */}
        <Animated.View
          style={[
            {
              width: 64,
              height: 132,
              zIndex: 1,
              opacity: isOwned ? 1 : 0.25,
              // Drop shadow under bottle (matches filter: drop-shadow)
              shadowColor: '#000',
              shadowOpacity: isOwned ? 0.6 : 0,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 8 },
              elevation: isOwned ? 4 : 0,
            },
            isFeatured ? glowStyle : null,
          ]}
        >
          <Silhouette width={64} height={132} />
        </Animated.View>

        {/* Name */}
        <Text
          variant="displayEn"
          tone={isOwned ? 'parchment' : 'inkDeep'}
          style={{
            fontSize: 11,
            lineHeight: 13,
            marginTop: 10,
            textAlign: 'center',
            letterSpacing: 0.2,
            zIndex: 1,
          }}
          numberOfLines={1}
        >
          {bottle.displayName}
        </Text>

        {/* Meta */}
        <View style={{ marginTop: 3, zIndex: 1 }}>
          <MonoLabel
            size={8}
            tracking={1.2}
            tone={isOwned ? 'inkMuted' : 'inkDeep'}
          >
            {bottle.metaLine ?? formatMeta(bottle)}
          </MonoLabel>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function formatMeta(b: Pick<Bottle, 'ageYears' | 'region'>): string {
  const age = b.ageYears ? `${b.ageYears} · ` : '';
  return `${age}${b.region}`;
}

// Re-export colors for parent layouts using shelf styling.
export { colors as _bottleColors };
