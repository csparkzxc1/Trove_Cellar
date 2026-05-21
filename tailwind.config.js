/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Surface (dark library)
        espresso: '#1A1208',
        bourbon: '#2B1E14',
        walnut: '#3D2A1B',
        oak: '#4A3422',
        // Brass & gold
        brass: { DEFAULT: '#B8954E', light: '#D4A574' },
        gold: '#C9A961',
        // Whisky tones
        amber: { DEFAULT: '#C8761F', deep: '#8E4A0E' },
        // Parchment (tasting note card)
        parchment: { DEFAULT: '#E8DDB8', dark: '#C9B68C', aged: '#B5A074' },
        // Text
        ink: '#E8DDB8',
        inkMuted: '#A8957A',
        inkDeep: '#6B5A42',
        // Utility
        line: 'rgba(184, 149, 78, 0.18)',
        shelf: 'rgba(74, 52, 34, 0.6)',
      },
      fontFamily: {
        displayEn: ['Fraunces_500Medium'],
        displayEnItalic: ['Fraunces_500Medium_Italic'],
        displayEnBold: ['Fraunces_600SemiBold'],
        serifAged: ['EBGaramond_400Regular'],
        serifAgedItalic: ['EBGaramond_400Regular_Italic'],
        serifAgedBold: ['EBGaramond_600SemiBold'],
        serifClassic: ['CormorantGaramond_500Medium'],
        serifClassicItalic: ['CormorantGaramond_500Medium_Italic'],
        serifKr: ['NotoSerifKR_500Medium'],
        serifKrBold: ['NotoSerifKR_600SemiBold'],
        body: ['System'],
        bodyMed: ['System'],
        mono: ['JetBrainsMono_400Regular'],
      },
      letterSpacing: {
        wordmark: '0.18em',
        label: '0.25em',
        stamp: '0.3em',
      },
    },
  },
  plugins: [],
};
