import { View, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/tokens';

type Props = ViewProps & { children: React.ReactNode };

// One row of bottles with overhead track-light hint + wooden shelf plank below.
// Replicates .shelf::before (light strip) and .shelf::after (plank).
export function ShelfRow({ children, style, ...rest }: Props) {
  return (
    <View style={[{ position: 'relative', marginBottom: 28, paddingTop: 8, paddingBottom: 14 }, style]} {...rest}>
      {/* Overhead track lighting strip */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -10,
          left: '6%',
          right: '6%',
          height: 7,
          opacity: 0.9,
          // approximate blur via inset glow (RN can't blur arbitrary views portably).
        }}
      >
        <LinearGradient
          colors={[
            'rgba(255, 215, 145, 0)',
            'rgba(255, 215, 145, 0.22)',
            'rgba(255, 215, 145, 0.22)',
            'rgba(255, 215, 145, 0)',
          ]}
          locations={[0, 0.18, 0.82, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Bottle row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          gap: 4,
          paddingHorizontal: 4,
        }}
      >
        {children}
      </View>

      {/* Wooden shelf plank */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: -10,
          right: -10,
          height: 6,
          borderRadius: 1,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        }}
      >
        <LinearGradient
          colors={[colors.oak, colors.walnut, colors.espresso]}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
