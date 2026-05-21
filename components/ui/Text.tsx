import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { fonts, colors } from '@/constants/tokens';

type Variant =
  | 'displayEn'
  | 'displayEnItalic'
  | 'displayEnBold'
  | 'serifAged'
  | 'serifAgedItalic'
  | 'serifAgedBold'
  | 'serifClassic'
  | 'serifClassicItalic'
  | 'serifKr'
  | 'serifKrBold'
  | 'body'
  | 'mono'
  | 'monoMed';

type Tone = 'ink' | 'inkMuted' | 'inkDeep' | 'parchment' | 'brass' | 'brassLight' | 'amber' | 'amberDeep' | 'bourbon';

type Props = RNTextProps & {
  variant?: Variant;
  tone?: Tone;
  upper?: boolean;
  tracking?: number;
};

const fontMap: Record<Variant, string> = {
  displayEn: fonts.displayEn,
  displayEnItalic: fonts.displayEnItalic,
  displayEnBold: fonts.displayEnBold,
  serifAged: fonts.serifAged,
  serifAgedItalic: fonts.serifAgedItalic,
  serifAgedBold: fonts.serifAgedBold,
  serifClassic: fonts.serifClassic,
  serifClassicItalic: fonts.serifClassicItalic,
  serifKr: fonts.serifKr,
  serifKrBold: fonts.serifKrBold,
  body: 'System',
  mono: fonts.mono,
  monoMed: fonts.monoMed,
};

const toneMap: Record<Tone, string> = {
  ink: colors.ink,
  inkMuted: colors.inkMuted,
  inkDeep: colors.inkDeep,
  parchment: colors.parchment,
  brass: colors.brass,
  brassLight: colors.brassLight,
  amber: colors.amber,
  amberDeep: colors.amberDeep,
  bourbon: colors.bourbon,
};

export function Text({
  variant = 'body',
  tone = 'ink',
  upper,
  tracking,
  style,
  children,
  ...rest
}: Props) {
  const baseStyle: TextStyle = {
    fontFamily: fontMap[variant],
    color: toneMap[tone],
  };
  if (upper) baseStyle.textTransform = 'uppercase';
  if (typeof tracking === 'number') baseStyle.letterSpacing = tracking;

  return (
    <RNText style={[baseStyle, style]} {...rest}>
      {children}
    </RNText>
  );
}
