import { View } from 'react-native';
import { Text } from './ui/Text';
import { MonoLabel } from './ui/MonoLabel';
import { Divider } from './ui/Divider';
import { WaxStamp } from './WaxStamp';
import { colors } from '@/constants/tokens';

type Props = {
  number?: string;             // "01" — note no.
  region?: string;             // "Speyside"
  distillery: string;          // "Glenfiddich"
  expression?: string;
  age?: number;                // 18 → drives the wax stamp
  nose?: string;
  palate?: string;
  finish?: string;
  cask?: string;
  abv?: number | string;
  ratingStars?: number;        // 0-5
  acquiredAt?: string;         // "2026.05.21"

  // === Empty-state variants ===
  // 'detail'     — bottle detail page: "아직 노트가 없습니다. 첫 잔을 기다리는 중."
  // 'invitation' — diary main: warm template-like preview inviting first tasting
  placeholder?: 'detail' | 'invitation';
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
  placeholder,
}: Props) {
  const isInvitation = placeholder === 'invitation';

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
        shadowOpacity: 0.45,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 18 },
        elevation: 10,
      }}
    >
      {/* Inner border */}
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

      {/* Wax stamp — top right */}
      {(age != null || isInvitation) && (
        <View style={{ position: 'absolute', top: 16, right: 18 }}>
          <WaxStamp
            age={isInvitation ? '?' : (age as number)}
            label={isInvitation ? 'AWAIT' : 'YEARS'}
          />
        </View>
      )}

      {/* Label tag */}
      <MonoLabel size={9} tracking={2.7} tone="amberDeep">
        {isInvitation
          ? 'Distillery №— · awaiting'
          : `Distillery №${number}${region ? ' · ' + region : ''}`}
      </MonoLabel>

      {/* Distillery */}
      <Text
        variant="displayEnBold"
        tone="bourbon"
        style={{ fontSize: 26, lineHeight: 29, marginTop: 8, letterSpacing: 0.3 }}
      >
        {isInvitation ? '당신의 첫 한 잔' : distillery}
      </Text>
      {(expression || isInvitation) && (
        <Text
          variant="displayEnItalic"
          tone="amberDeep"
          style={{ fontSize: 17, lineHeight: 22, marginTop: 4, letterSpacing: 0.1 }}
        >
          {isInvitation ? 'A tasting waiting to be written.' : expression}
        </Text>
      )}

      <Divider diamond tone="parchment" />

      {placeholder === 'detail' ? (
        <View style={{ paddingVertical: 12, alignItems: 'center' }}>
          <Text
            variant="serifKr"
            tone="bourbon"
            style={{ fontSize: 14, lineHeight: 24, textAlign: 'center', opacity: 0.7 }}
          >
            아직 노트가 없습니다.{'\n'}첫 잔을 기다리는 중.
          </Text>
        </View>
      ) : isInvitation ? (
        <>
          <InvitationBlock label="Nose · 향"     hint="첫 향을 한 줄로 남겨주세요." />
          <InvitationBlock label="Palate · 맛"   hint="혀에 닿은 인상을 적어주세요." />
          <InvitationBlock label="Finish · 피니쉬" hint="남은 여운을 기록해주세요." />
        </>
      ) : (
        <>
          {nose && <NoteBlock label="Nose · 향" body={nose} />}
          {palate && <NoteBlock label="Palate · 맛" body={palate} />}
          {finish && <NoteBlock label="Finish · 피니쉬" body={finish} />}
        </>
      )}

      {/* Meta grid */}
      {(region || cask || abv != null || isInvitation) && (
        <View
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.parchmentAged,
            flexDirection: 'row',
          }}
        >
          <MetaCell label="Region" value={isInvitation ? '—' : (region ?? '—')} dim={isInvitation} />
          <MetaCell label="Cask"   value={isInvitation ? '—' : (cask ?? '—')}   dim={isInvitation} />
          <MetaCell
            label="ABV"
            value={
              isInvitation
                ? '—'
                : abv != null
                  ? typeof abv === 'number' ? `${abv}%` : abv
                  : '—'
            }
            dim={isInvitation}
          />
        </View>
      )}

      {/* Footer */}
      <View style={{ marginTop: 22, alignItems: 'center' }}>
        <Text
          variant="displayEn"
          tone="amberDeep"
          style={{
            fontSize: 14,
            letterSpacing: 3,
            marginBottom: 6,
            opacity: isInvitation ? 0.3 : 1,
          }}
        >
          {renderStars(ratingStars)}
        </Text>
        {(acquiredAt || isInvitation) && (
          <MonoLabel size={8} tracking={1.8} tone="inkDeep">
            {isInvitation ? 'Awaiting your first pour' : `Acquired · ${acquiredAt}`}
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

function InvitationBlock({ label, hint }: { label: string; hint: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <MonoLabel size={8} tracking={2.7} tone="amberDeep">{label}</MonoLabel>
      <View
        style={{
          marginTop: 6,
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 1,
          borderWidth: 1,
          borderColor: 'rgba(142, 74, 14, 0.18)',
          borderStyle: 'dashed',
          backgroundColor: 'rgba(184, 149, 78, 0.06)',
        }}
      >
        <Text
          variant="serifKrBold"
          tone="bourbon"
          style={{ fontSize: 12, lineHeight: 20, opacity: 0.55, fontStyle: 'italic' }}
        >
          {hint}
        </Text>
      </View>
    </View>
  );
}

function MetaCell({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', opacity: dim ? 0.4 : 1 }}>
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
