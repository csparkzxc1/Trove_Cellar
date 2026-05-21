import Svg, { Circle, Path, SvgProps } from 'react-native-svg';
import { colors } from '@/constants/tokens';

type Props = SvgProps & { size?: number; color?: string };

// Star + double-circle crest — matches #crest symbol from prototype.
export function Crest({ size = 36, color = colors.brass, ...rest }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" {...rest}>
      <Circle cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="1" />
      <Circle cx="18" cy="18" r="13" fill="none" stroke={color} strokeWidth="0.5" />
      <Path
        d="M18 7 L20 13 L26 13 L22 17 L24 23 L18 19 L12 23 L14 17 L10 13 L16 13 Z"
        fill={color}
      />
    </Svg>
  );
}
