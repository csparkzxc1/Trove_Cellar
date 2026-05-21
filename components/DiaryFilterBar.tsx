import { useState } from 'react';
import { View, TextInput, Pressable, ScrollView } from 'react-native';
import { Text } from './ui/Text';
import { MonoLabel } from './ui/MonoLabel';
import { colors } from '@/constants/tokens';

export type DiaryFilters = {
  query: string;
  region: string | null;     // null = all
  minStars: number;          // 0 = all
};

type Props = {
  filters: DiaryFilters;
  onChange: (next: DiaryFilters) => void;
  regions: string[];         // available regions in the user's diary
};

export function DiaryFilterBar({ filters, onChange, regions }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      {/* Search input */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: focused ? colors.brass : colors.line,
          borderRadius: 2,
          backgroundColor: colors.bourbon,
        }}
      >
        <Text variant="mono" tone="brass" style={{ fontSize: 13, marginRight: 10 }}>⌕</Text>
        <TextInput
          value={filters.query}
          onChangeText={(q) => onChange({ ...filters, query: q })}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="증류소나 노트로 검색"
          placeholderTextColor={colors.inkDeep}
          style={{
            flex: 1,
            color: colors.ink,
            fontSize: 14,
            fontFamily: 'EBGaramond_400Regular',
            padding: 0,
          }}
        />
        {filters.query.length > 0 && (
          <Pressable onPress={() => onChange({ ...filters, query: '' })} hitSlop={10}>
            <Text variant="mono" tone="inkDeep" style={{ fontSize: 14 }}>×</Text>
          </Pressable>
        )}
      </View>

      {/* Region chips */}
      {regions.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: 12, paddingRight: 22 }}
        >
          <Chip
            label="전체"
            active={filters.region === null}
            onPress={() => onChange({ ...filters, region: null })}
          />
          {regions.map((r) => (
            <Chip
              key={r}
              label={r}
              active={filters.region === r}
              onPress={() => onChange({ ...filters, region: filters.region === r ? null : r })}
            />
          ))}
        </ScrollView>
      )}

      {/* Min rating chips */}
      <View style={{ flexDirection: 'row', gap: 8, paddingTop: 8 }}>
        {[0, 3, 4, 5].map((n) => (
          <Chip
            key={n}
            label={n === 0 ? '평점 무관' : `★ ${n}+`}
            active={filters.minStars === n}
            onPress={() => onChange({ ...filters, minStars: n })}
            small
          />
        ))}
      </View>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  small,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: small ? 10 : 12,
        paddingVertical: small ? 5 : 7,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: active ? colors.brass : colors.line,
        backgroundColor: active
          ? 'rgba(184, 149, 78, 0.16)'
          : pressed
            ? 'rgba(184, 149, 78, 0.06)'
            : 'transparent',
      })}
    >
      <MonoLabel
        size={small ? 8 : 9}
        tracking={1.6}
        tone={active ? 'brass' : 'inkMuted'}
      >
        {label}
      </MonoLabel>
    </Pressable>
  );
}
