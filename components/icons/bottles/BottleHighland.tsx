import Svg, { Rect, Path, Line, Ellipse, SvgProps } from 'react-native-svg';
import { LiquidDefs } from './gradients';

type Props = SvgProps & { width?: number; height?: number };

export function BottleHighland({ width = 64, height = 132, ...rest }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 132" {...rest}>
      <LiquidDefs />
      <Rect x="26" y="2" width="12" height="12" fill="#2B1E14" />
      <Rect x="27" y="14" width="10" height="18" fill="url(#pale-liq)" />
      <Rect x="27" y="14" width="10" height="18" fill="none" stroke="#1A1208" strokeWidth="0.8" />
      <Path
        d="M27 32 Q20 34 18 42 L18 122 Q18 130 26 130 L38 130 Q46 130 46 122 L46 42 Q44 34 37 32 Z"
        fill="url(#pale-liq)"
        stroke="#1A1208"
        strokeWidth="0.8"
      />
      <Path d="M23 48 Q23 80 23 116" fill="none" stroke="#F5DDA0" strokeWidth="1.2" opacity="0.6" />
      <Ellipse cx="32" cy="80" rx="14" ry="20" fill="#C9B68C" stroke="#8E4A0E" strokeWidth="0.5" />
      <Line x1="24" y1="80" x2="40" y2="80" stroke="#8E4A0E" strokeWidth="0.4" />
    </Svg>
  );
}
