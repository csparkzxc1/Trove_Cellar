import Svg, { Rect, Line, SvgProps } from 'react-native-svg';
import { LiquidDefs } from './gradients';

type Props = SvgProps & { width?: number; height?: number };

export function BottleJapan({ width = 64, height = 132, ...rest }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 132" {...rest}>
      <LiquidDefs />
      <Rect x="27" y="2" width="10" height="10" fill="#1A1208" stroke="#000" strokeWidth="0.5" />
      <Rect x="28" y="12" width="8" height="18" fill="url(#gold-liq)" />
      <Rect x="28" y="12" width="8" height="18" fill="none" stroke="#1A1208" strokeWidth="0.8" />
      <Rect x="20" y="30" width="24" height="100" fill="url(#gold-liq)" stroke="#1A1208" strokeWidth="0.8" />
      <Line x1="24" y1="40" x2="24" y2="120" stroke="#F0C778" strokeWidth="1" opacity="0.5" />
      <Rect x="23" y="58" width="18" height="44" fill="#E8DDB8" stroke="#8E4A0E" strokeWidth="0.5" />
      <Line x1="26" y1="80" x2="38" y2="80" stroke="#8E4A0E" strokeWidth="0.4" />
    </Svg>
  );
}
