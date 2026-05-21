import { View } from 'react-native';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { MonoLabel } from './ui/MonoLabel';
import { colors } from '@/constants/tokens';
import {
  regionDistribution,
  caskDistribution,
  monthlyCounts,
  type DistributionItem,
} from '@/lib/insights';
import type { Tasting } from '@/lib/types';

type Props = {
  tastings: Tasting[];
};

export function InsightsPanel({ tastings }: Props) {
  if (tastings.length === 0) return null;

  const regions = regionDistribution(tastings).slice(0, 3);
  const casks = caskDistribution(tastings).slice(0, 3);
  const months = monthlyCounts(tastings, 6);
  const maxMonth = Math.max(1, ...months.map((m) => m.count));

  return (
    <Card variant="flat" style={{ padding: 20, gap: 20 }}>
      <View>
        <MonoLabel size={9} tracking={2.7} tone="brass">인사이트 · insights</MonoLabel>
      </View>

      {/* Region top 3 */}
      <DistributionRow title="Region · 지역" items={regions} />

      {/* Cask top 3 */}
      <DistributionRow title="Cask · 캐스크" items={casks} />

      {/* Monthly cadence */}
      <View>
        <View style={{ marginBottom: 10 }}>
          <MonoLabel size={8} tracking={2} tone="brassLight">월별 시음 · cadence</MonoLabel>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 56 }}>
          {months.map((m) => {
            const h = m.count === 0 ? 4 : Math.max(6, (m.count / maxMonth) * 48);
            return (
              <View key={`${m.year}-${m.month}`} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                <View
                  style={{
                    width: '100%',
                    height: h,
                    backgroundColor: m.count > 0 ? colors.brass : colors.line,
                    opacity: m.count > 0 ? 0.85 : 1,
                    borderRadius: 1,
                  }}
                />
                <Text
                  variant="mono"
                  tone={m.count > 0 ? 'brassLight' : 'inkDeep'}
                  style={{ fontSize: 8, letterSpacing: 0.5 }}
                >
                  {m.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );
}

function DistributionRow({ title, items }: { title: string; items: DistributionItem[] }) {
  if (items.length === 0) return null;
  return (
    <View>
      <View style={{ marginBottom: 10 }}>
        <MonoLabel size={8} tracking={2} tone="brassLight">{title}</MonoLabel>
      </View>
      <View style={{ gap: 8 }}>
        {items.map((it) => (
          <View key={it.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 92 }}>
              <Text variant="serifAged" tone="parchment" style={{ fontSize: 13 }} numberOfLines={1}>
                {it.key}
              </Text>
            </View>
            <View style={{ flex: 1, height: 6, backgroundColor: colors.line, borderRadius: 1, overflow: 'hidden' }}>
              <View
                style={{
                  width: `${Math.max(6, it.pct * 100)}%`,
                  height: '100%',
                  backgroundColor: colors.brass,
                }}
              />
            </View>
            <Text variant="mono" tone="brassLight" style={{ fontSize: 10, letterSpacing: 1, width: 28, textAlign: 'right' }}>
              {it.count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
