import Svg, { Rect, Path, SvgProps } from 'react-native-svg';

type Props = SvgProps & { width?: number; height?: number };

// Dashed wishlist silhouette — matches #bot-empty from prototype.
export function BottleEmpty({ width = 64, height = 132, ...rest }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 132" {...rest}>
      <Rect
        x="26"
        y="2"
        width="12"
        height="14"
        fill="none"
        stroke="#4A3422"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      <Path
        d="M28 16 L28 36 Q22 38 18 46 L18 124 Q18 130 24 130 L40 130 Q46 130 46 124 L46 46 Q42 38 36 36 L36 16 Z"
        fill="none"
        stroke="#4A3422"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
    </Svg>
  );
}
