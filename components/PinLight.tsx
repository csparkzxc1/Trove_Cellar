import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

// Pin lighting: an overhead amber cone descending onto a bottle + a pool of
// light spilling onto the shelf. Replicates .bottle::before (cone) and
// .bottle::after (pool) from docs/trove-cellar-prototype.html.
//
// Two implementations live side-by-side for visual comparison:
//   - <PinLightSVG/>    react-native-svg + RadialGradient (recommended)
//   - <PinLightLinear/> expo-linear-gradient stack (lighter, less precise)

type Variant = 'default' | 'featured' | 'empty';

const intensities: Record<Variant, { coneTop: number; coneMid: number; pool: number; poolMid: number }> = {
  default:  { coneTop: 0.38, coneMid: 0.18, pool: 0.48, poolMid: 0.20 },
  featured: { coneTop: 0.52, coneMid: 0.26, pool: 0.60, poolMid: 0.26 },
  empty:    { coneTop: 0.18 * 0.38, coneMid: 0.18 * 0.18, pool: 0.14 * 0.48, poolMid: 0.14 * 0.20 },
};

// === SVG variant ============================================================
export function PinLightSVG({ variant = 'default' }: { variant?: Variant }) {
  const i = intensities[variant];

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: -28,
        left: '50%',
        marginLeft: -47,
        width: 94,
        height: 172,
        zIndex: 0,
      }}
    >
      <Svg width={94} height={172} viewBox="0 0 94 172">
        <Defs>
          <RadialGradient
            id="cone"
            cx="47"
            cy="0"
            rx="14"
            ry="120"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%"   stopColor="#FFDA94" stopOpacity={i.coneTop} />
            <Stop offset="35%"  stopColor="#FFC67C" stopOpacity={i.coneMid} />
            <Stop offset="65%"  stopColor="#FFB664" stopOpacity={0.05} />
            <Stop offset="100%" stopColor="#FFB464" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient
            id="pool"
            cx="47"
            cy="158"
            rx="42"
            ry="11"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%"  stopColor="#FFC67C" stopOpacity={i.pool} />
            <Stop offset="45%" stopColor="#FFB664" stopOpacity={i.poolMid} />
            <Stop offset="80%" stopColor="#FFB464" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={47} cy={20}  rx={40} ry={120} fill="url(#cone)" />
        <Ellipse cx={47} cy={158} rx={42} ry={11}  fill="url(#pool)" />
      </Svg>
    </View>
  );
}

// === LinearGradient variant ==================================================
// Approximates radial-gradient with stacked translucent linear gradients.
// Cheaper to render, but lacks true ellipse falloff.
export function PinLightLinear({ variant = 'default' }: { variant?: Variant }) {
  const i = intensities[variant];

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: -28,
        left: '50%',
        marginLeft: -47,
        width: 94,
        height: 172,
        zIndex: 0,
      }}
    >
      {/* Cone — vertical fade, narrower at top */}
      <View
        style={{
          position: 'absolute',
          left: 22,
          right: 22,
          top: 4,
          height: 140,
          overflow: 'hidden',
          borderRadius: 50,
        }}
      >
        <LinearGradient
          colors={[
            `rgba(255, 218, 148, ${i.coneTop})`,
            `rgba(255, 198, 124, ${i.coneMid})`,
            'rgba(255, 182, 100, 0.05)',
            'rgba(255, 180, 100, 0)',
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={{ flex: 1 }}
        />
      </View>
      {/* Pool — horizontal pancake at base */}
      <View
        style={{
          position: 'absolute',
          left: 5,
          right: 5,
          top: 148,
          height: 22,
          borderRadius: 11,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            `rgba(255, 198, 124, ${i.pool})`,
            'transparent',
          ]}
          locations={[0.05, 0.5, 0.95]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

// Default export selects the SVG implementation.
export const PinLight = PinLightSVG;
