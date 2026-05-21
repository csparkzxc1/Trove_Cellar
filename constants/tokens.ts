// Design tokens — 1:1 with prototype HTML + tailwind.config.js
// Source of truth: docs/trove-cellar-prototype.html

export const colors = {
  // Surface (dark library)
  espresso: '#1A1208',
  bourbon: '#2B1E14',
  walnut: '#3D2A1B',
  oak: '#4A3422',
  // Brass & gold
  brass: '#B8954E',
  brassLight: '#D4A574',
  gold: '#C9A961',
  // Whisky tones
  amber: '#C8761F',
  amberDeep: '#8E4A0E',
  // Parchment
  parchment: '#E8DDB8',
  parchmentDark: '#C9B68C',
  parchmentAged: '#B5A074',
  // Text
  ink: '#E8DDB8',
  inkMuted: '#A8957A',
  inkDeep: '#6B5A42',
  // Utility
  line: 'rgba(184, 149, 78, 0.18)',
  shelf: 'rgba(74, 52, 34, 0.6)',
} as const;

// Whisky liquid gradients (SVG defs)
export const liquidGradients = {
  amber: ['#E8A35C', '#C8761F', '#8E4A0E'],
  dark: ['#B5743A', '#7A4818', '#3A1F08'],
  gold: ['#F0C778', '#D4A574', '#9C7A3E'],
  pale: ['#F5DDA0', '#D4B57A', '#8E6F3A'],
} as const;

export const fonts = {
  displayEn: 'Fraunces_500Medium',
  displayEnItalic: 'Fraunces_500Medium_Italic',
  displayEnBold: 'Fraunces_600SemiBold',
  serifAged: 'EBGaramond_400Regular',
  serifAgedItalic: 'EBGaramond_400Regular_Italic',
  serifAgedBold: 'EBGaramond_600SemiBold',
  serifClassic: 'CormorantGaramond_500Medium',
  serifClassicItalic: 'CormorantGaramond_500Medium_Italic',
  serifKr: 'NotoSerifKR_500Medium',
  serifKrBold: 'NotoSerifKR_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoMed: 'JetBrainsMono_500Medium',
} as const;
