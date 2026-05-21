import Svg, { Rect, Path, Line, SvgProps } from 'react-native-svg';
import { LiquidDefs } from './gradients';

type Props = SvgProps & { width?: number; height?: number };

export function BottleMalt({ width = 64, height = 132, ...rest }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 132" {...rest}>
      <LiquidDefs />
      <Rect x="26" y="2" width="12" height="14" fill="#2B1E14" stroke="#1A1208" strokeWidth="0.5" />
      <Rect x="27" y="16" width="10" height="20" fill="url(#amber-liq)" opacity="0.85" />
      <Rect x="27" y="16" width="10" height="20" fill="none" stroke="#1A1208" strokeWidth="0.8" />
      <Path
        d="M27 36 Q22 36 18 44 L18 124 Q18 130 24 130 L40 130 Q46 130 46 124 L46 44 Q42 36 37 36 Z"
        fill="url(#amber-liq)"
        stroke="#1A1208"
        strokeWidth="0.8"
      />
      <Path
        d="M22 50 Q22 70 22 110"
        fill="none"
        stroke="#F0C778"
        strokeWidth="1.2"
        opacity="0.55"
        strokeLinecap="round"
      />
      <Rect x="22" y="68" width="20" height="32" fill="#E8DDB8" stroke="#8E4A0E" strokeWidth="0.5" />
      <Line x1="24" y1="74" x2="40" y2="74" stroke="#8E4A0E" strokeWidth="0.4" opacity="0.6" />
      <Line x1="26" y1="92" x2="38" y2="92" stroke="#8E4A0E" strokeWidth="0.4" />
    </Svg>
  );
}
