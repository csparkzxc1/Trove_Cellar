import Svg, { Rect, Path, Line, SvgProps } from 'react-native-svg';
import { LiquidDefs } from './gradients';

type Props = SvgProps & { width?: number; height?: number };

export function BottleBourbon({ width = 64, height = 132, ...rest }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 132" {...rest}>
      <LiquidDefs />
      <Rect x="25" y="2" width="14" height="12" fill="#2B1E14" stroke="#1A1208" strokeWidth="0.5" />
      <Rect x="27" y="14" width="10" height="18" fill="url(#dark-liq)" />
      <Rect x="27" y="14" width="10" height="18" fill="none" stroke="#1A1208" strokeWidth="0.8" />
      <Rect x="16" y="32" width="32" height="98" fill="url(#dark-liq)" stroke="#1A1208" strokeWidth="0.8" rx="2" />
      <Path d="M20 40 L20 120" stroke="#B5743A" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <Rect x="20" y="64" width="24" height="38" fill="#C9B68C" stroke="#8E4A0E" strokeWidth="0.5" />
      <Line x1="22" y1="70" x2="42" y2="70" stroke="#8E4A0E" strokeWidth="0.4" />
      <Line x1="26" y1="88" x2="38" y2="88" stroke="#8E4A0E" strokeWidth="0.4" />
    </Svg>
  );
}
