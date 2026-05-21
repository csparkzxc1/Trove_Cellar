# Trove Cellar

> **오늘 한 잔의 기록을 남겨주세요.**
> One dram, one memory.

위스키 매니아를 위한 **시음 일기 + 양피지 도감**.

한 잔을 따를 때마다 한국어 시음 노트(Nose · Palate · Finish)를 양피지 카드 한 장에 남긴다. 셀러는 그 부산물 — 진열된 병들은 마신 잔의 기억을 모은 결과다. 트로브 가족(Trove Peaks 박물관 도감 · Trove Cafe 스크랩북 다이어리)의 다크 모드 + 가장 atmospheric한 톤.

**핵심 단위**: 한 병이 아닌 **한 잔(tasting)**. 메인 탭은 시음일기, 셀러는 두 번째 탭의 보조 기능.

## Stack

- **Framework**: Expo SDK 54 · React Native 0.81 · Expo Router (file-based)
- **Language**: TypeScript (strict)
- **Styling**: NativeWind v4 · Tailwind v3
- **Animation**: react-native-reanimated v4 · react-native-worklets
- **SVG**: react-native-svg
- **Gradient**: expo-linear-gradient
- **Server**: Supabase (placeholder — Phase 2에서 wiring)
- **State**: Zustand

## Get started

```bash
npm install
npx expo start
```

웹: `npm run web` · iOS: `npm run ios` · Android: `npm run android`

## 디자인 시스템

source of truth: [`docs/trove-cellar-prototype.html`](docs/trove-cellar-prototype.html)

- 컬러 토큰: `constants/tokens.ts`
- Tailwind 매핑: `tailwind.config.js`
- 폰트 6종: Fraunces · EB Garamond · Cormorant Garamond · Noto Serif KR · JetBrains Mono · System
- 핀조명(`PinLight`)은 SVG RadialGradient 기본, `lighting="linear"`로 전환하면 LinearGradient 구현 비교 가능

## 디렉토리

```
app/
  (auth)/login.tsx · signup.tsx
  (tabs)/index.tsx (시음일기 · default) · cellar.tsx · wishlist.tsx · profile.tsx
  bottle/[id].tsx
components/
  ui/             Text, Card, Divider, MonoLabel
  icons/bottles/  Malt/Bourbon/Japan/Islay/Highland/Empty
  PinLight · BottleCard · ShelfRow · CabinetView
  StatsBar · TastingNoteCard · WaxStamp · BrandWordmark · Crest
constants/        tokens · distilleries-seed · bottles-seed
lib/              types · supabase · queries/
stores/           auth (Zustand)
docs/             trove-cellar-prototype.html (visual spec)
```

## Supabase (Phase 2)

이번 세션은 `@supabase/supabase-js` 클라이언트와 placeholder 환경변수만 셋업되어 있다. 실 데이터는 `BOTTLES_SEED` (12 위스키 × 10 증류소) 직접 사용.

스키마 초안 (Phase 2 적용 예정):

```sql
create table distilleries ( ... );
create table bottles      ( ... );
create table user_bottles ( ... );
create table tastings     ( ... );
create table wishlist     ( ... );
```

활성화하려면 `.env`에:

```
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Phase 1 (this session) — DoD

- [x] Expo + TypeScript strict + NativeWind v4 + Expo Router 초기화
- [x] 디자인 토큰 6 폰트 + dark espresso theme
- [x] 재사용 UI: Text / Card / Divider / MonoLabel
- [x] 5 + 1 병 실루엣 SVG (Malt · Bourbon · Japan · Islay · Highland · Empty)
- [x] 핀조명 SVG + LinearGradient 구현 비교
- [x] BottleCard · ShelfRow · CabinetView
- [x] StatsBar · TastingNoteCard · WaxStamp · BrandWordmark · Crest
- [x] auth 분기 + 4 탭(시음일기 / 셀러 / 위시리스트 / 프로필) + 위스키 상세 + 위시리스트 placeholder
- [x] **시음 노트 메인 화면** — invitation 양피지 카드(왁스 씰 "?", 점선 NOSE/PALATE/FINISH 박스, 한글 invitation 카피) + brass primary CTA "시음 노트 남기기"
- [x] 위스키 상세 액션 우선순위: 시음 노트 남기기 > 셀러에 추가 > 위시리스트
- [x] Web export 검증

## Phase 2 (next)

- 카메라 + 라벨 OCR (Claude Vision)
- 시음 노트 작성 폼 (Nose/Palate/Finish 가이드)
- 인스타 카드 자동 생성 (양피지 그대로)
- PDF 셀러 카탈로그 export
- 가격 추적 (한국 면세점 시세)
- 위스키 추천 (보유 패턴 기반)

---

© 2026 (주)트로브 / Trove Inc.
