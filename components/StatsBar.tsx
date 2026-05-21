import { View } from 'react-native';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { MonoLabel } from './ui/MonoLabel';
import { colors } from '@/constants/tokens';

type Stat = {
  key: string;       // "Bottles" / "Est. Value" / "Avg. Score"
  value: string;     // "23" / "4.2" / "88"
  suffix?: string;   // "M" / "/100" — rendered smaller in brass-light
  prefix?: string;   // "₩"
};

type Props = {
  label?: string;         // "My Cellar"
  emphasis?: string;      // "summary"
  stats: [Stat, Stat, Stat];
};

export function StatsBar({ label = 'My Cellar', emphasis = 'summary', stats }: Props) {
  return (
    <Card style={{ paddingVertical: 28, paddingHorizontal: 22 }}>
      {/* Label row */}
      <View style={{ alignItems: 'center', marginBottom: 14, flexDirection: 'row', justifyContent: 'center' }}>
        <MonoLabel size={9} tracking={2.7}>{label}</MonoLabel>
        <Text
          variant="displayEnItalic"
          tone="brassLight"
          style={{ fontSize: 13, marginLeft: 6 }}
        >
          {emphasis}
        </Text>
      </View>

      {/* 3-column stat grid */}
      <View style={{ flexDirection: 'row' }}>
        {stats.map((s, i) => (
          <View
            key={s.key}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 4,
              borderLeftWidth: i === 0 ? 0 : 1,
              borderLeftColor: colors.line,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              {s.prefix && (
                <Text variant="displayEn" tone="parchment" style={{ fontSize: 22 }}>
                  {s.prefix}
                </Text>
              )}
              <Text variant="displayEn" tone="parchment" style={{ fontSize: 30, lineHeight: 32, letterSpacing: -0.3 }}>
                {s.value}
              </Text>
              {s.suffix && (
                <Text variant="displayEn" tone="brassLight" style={{ fontSize: 16, marginLeft: 1 }}>
                  {s.suffix}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 6 }}>
              <MonoLabel size={8} tracking={1.8}>{s.key}</MonoLabel>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
