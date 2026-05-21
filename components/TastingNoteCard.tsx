import { View } from 'react-native';
import { Text } from './ui/Text';
import { MonoLabel } from './ui/MonoLabel';
import { Divider } from './ui/Divider';
import { WaxStamp } from './WaxStamp';
import { colors } from '@/constants/tokens';

type Props = {
  number?: string;             // "01"
  region?: string;             // "Speyside"
  distillery: string;          // "Glenfiddich"
  expression?: string;         // "Our Original Twelve, aged eighteen"
  age?: number;                // 18 → drives the wax stamp
  nose?: string;
  palate?: string;
  finish?: string;
  cask?: string;               // "Sherry"
  abv?: number | string;       // 40 → "40%"
  ratingStars?: number;        // 1-5, default 0
  acquiredAt?: string;         // "2026.05.21"
  placeholder?: boolean;       // true → empty-state copy
};

const renderStars = (n: number) => {
  const filled = '★ '.repeat(Math.max(0, Math.min(5, n))).trim();
  const empty = ' ☆'.repeat(Math.max(0, 5 - n));
  return `${filled}${empty}`.trim();
};

export function TastingNoteCard({
  number = '01',
  region,
  distillery,
  expression,
  age,
  nose,
  palate,
  finish,
  cask,
  abv,
  ratingStars = 0,
  acquiredAt,
  placeholder = false,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: colors.parchment,
        paddingTop: 32,
        paddingHorizontal: 26,
        paddingBottom: 28,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.parchmentAged,
        position: 'relative',
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 20 },
        elevation: 8,
      }}
    >
      {/* Inner border — matches .tasting::before inset 8px */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 8,
          bottom: 8,
          left: 8,
          right: 8,
          borderWidth: 1,
          borderColor: colors.parchmentAged,
          opacity: 0.6,
        }}
      />

      {/* Wax stamp — top right, only when age is provided */}
      {age != null && (
        <View style={{ position: 'absolute', top: 16, right: 18 }}>
          <WaxStamp age={age} />
        </View>
      )}

      {/* Label tag */}
      <MonoLabel size={9} tracking={2.7} tone="amberDeep">
        {`Distillery №${number}${region ? ' · ' + region : ''}`}
      </MonoLabel>

      {/* Distillery + expression */}
      <Text
        variant="displayEnBold"
        tone="bourbon"
        style={{ fontSize: 26, lineHeight: 29, marginTop: 8, letterSpacing: 0.3 }}
      >
        {distillery}
      </Text>
      {expression && (
        <Text
          variant="displayEnItalic"
          tone="amberDeep"
          style={{ fontSize: 17, lineHeight: 22, marginTop: 4, letterSpacing: 0.1 }}
        >
          {expression}
        </Text>
      )}

      <Divider diamond tone="parchment" />

      {placeholder ? (
        <View style={{ paddingVertical: 12, alignItems: 'center' }}>
          <Text
            variant="serifKr"
            tone="bourbon"
            style={{ fontSize: 14, lineHeight: 24, textAlign: 'center', opacity: 0.7 }}
          >
            아직 노트가 없습니다.{'\n'}첫 잔을 기다리는 중.
          </Text>
        </View>
      ) : (
        <>
          {nose && <NoteBlock label="Nose · 향" body={nose} />}
          {palate && <NoteBlock label="Palate · 맛" body={palate} />}
          {finish && <NoteBlock label="Finish · 피니쉬" body={finish} />}
        </>
      )}

      {/* Meta grid */}
      {(region || cask || abv != null) && (
        <View
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.parchmentAged,
            flexDirection: 'row',
          }}
        >
          {region && <MetaCell label="Region" value={region} />}
          {cask && <MetaCell label="Cask" value={cask} />}
          {abv != null && <MetaCell label="ABV" value={typeof abv === 'number' ? `${abv}%` : abv} />}
        </View>
      )}

      {/* Footer — rating + date */}
      <View style={{ marginTop: 22, alignItems: 'center' }}>
        <Text
          variant="displayEn"
          tone="amberDeep"
          style={{ fontSize: 14, letterSpacing: 3, marginBottom: 6 }}
        >
          {renderStars(ratingStars)}
        </Text>
        {acquiredAt && (
          <MonoLabel size={8} tracking={1.8} tone="inkDeep">
            {`Acquired · ${acquiredAt}`}
          </MonoLabel>
        )}
      </View>
    </View>
  );
}

function NoteBlock({ label, body }: { label: string; body: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <MonoLabel size={8} tracking={2.7} tone="amberDeep">{label}</MonoLabel>
      <Text
        variant="serifKr"
        tone="bourbon"
        style={{ fontSize: 13, lineHeight: 21, marginTop: 4 }}
      >
        {body}
      </Text>
    </View>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <MonoLabel size={7} tracking={1.9} tone="amberDeep">{label}</MonoLabel>
      <Text
        variant="displayEn"
        tone="bourbon"
        style={{ fontSize: 13, marginTop: 4, letterSpacing: 0.3 }}
      >
        {value}
      </Text>
    </View>
  );
}
