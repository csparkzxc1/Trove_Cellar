import Svg, { Rect, Path, Line, SvgProps } from 'react-native-svg';
import { LiquidDefs } from './gradients';

type Props = SvgProps & { width?: number; height?: number };

export function BottleIslay({ width = 64, height = 132, ...rest }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 132" {...rest}>
      <LiquidDefs />
      <Rect x="26" y="2" width="12" height="13" fill="#1A1208" />
      <Rect x="28" y="15" width="8" height="22" fill="url(#dark-liq)" />
      <Rect x="28" y="15" width="8" height="22" fill="none" stroke="#1A1208" strokeWidth="0.8" />
      <Path
        d="M28 37 Q22 38 20 46 L20 124 Q20 130 26 130 L38 130 Q44 130 44 124 L44 46 Q42 38 36 37 Z"
        fill="url(#dark-liq)"
        stroke="#1A1208"
        strokeWidth="0.8"
      />
      <Path d="M24 48 Q24 80 24 118" fill="none" stroke="#B5743A" strokeWidth="1" opacity="0.5" />
      <Rect x="22" y="64" width="20" height="36" fill="#3D2A1B" stroke="#B8954E" strokeWidth="0.5" />
      <Line x1="26" y1="78" x2="38" y2="78" stroke="#B8954E" strokeWidth="0.4" />
    </Svg>
  );
}
