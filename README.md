# Trove Cellar

> **오늘 한 잔의 기록을 남겨주세요.**
> One dram, one memory.

위스키 매니아를 위한 **시음 일기 + 양피지 도감**.

한 잔을 따를 때마다 한국어 시음 노트(Nose · Palate · Finish)를 양피지 카드 한 장에 남긴다. 셀러는 그 부산물 — 진열된 병들은 마신 잔의 기억을 모은 결과다. 트로브 가족(Trove Peaks 박물관 도감 · Trove Cafe 스크랩북 다이어리)의 다크 모드 + 가장 atmospheric한 톤.

**핵심 단위**: 한 병이 아닌 **한 잔(tasting)**. 메인 탭은 시음일기, 셀러는 두 번째 탭의 보조 기능.

## Get started — macOS

### 0. 사전 준비

- **Node.js 20+** (`brew install node`)
- **Xcode 15+** (App Store에서 설치) — iOS 시뮬레이터용
- **Watchman** (`brew install watchman`) — 권장
- **CocoaPods** (`brew install cocoapods` 또는 `sudo gem install cocoapods`) — `expo prebuild` 사용 시
- 선택: **EAS CLI** (`npm i -g eas-cli`) — 클라우드 빌드/배포용

Xcode 첫 실행 시 iOS Simulator 컴포넌트 다운로드. Xcode 메뉴 → Settings → Platforms에서 iOS 17+ 추가.

### 1. 클론 & 설치

```bash
git clone https://github.com/csparkzxc1/Trove_Cellar.git
cd Trove_Cellar
git checkout claude/trove-cellar-initial-9u3Qq

npm install

# 선택: API 키가 있다면
cp .env.example .env.local   # 그리고 키 채우기
```

### 2. 실행 옵션

**(A) Expo Go로 빠르게 (실 디바이스, iOS/Android 무관)**

```bash
npx expo start
```

QR 코드가 뜨면 폰의 Expo Go 앱(또는 iOS는 카메라)으로 스캔. **카메라 OCR 데모는 작동하지만 `react-native-view-shot` 같은 native 모듈은 development build에서만 완전 동작.**

**(B) iOS 시뮬레이터 (Mac 권장)**

```bash
npx expo run:ios
```

처음 실행 시 `expo prebuild`가 native iOS 폴더를 생성하고 CocoaPods가 설치됨 (5-10분). 이후엔 캐시되어 빠름. 시뮬레이터에서 모든 native 기능(view-shot PNG 캡처, expo-sharing, expo-print PDF, image-picker)이 동작.

**(C) Android 에뮬레이터**

```bash
npx expo run:android
```

Android Studio 설치 + AVD(Android Virtual Device) 셋업 필요.

**(D) Web (시각 검증용)**

```bash
npx expo export --platform web
npx serve dist
```

웹 빌드는 시각 검증과 빠른 반복용. 카메라/share 등 native API는 비활성화되거나 알림으로 안내.

### 3. 디바이스에 실제 빌드 (배포 전 단계)

```bash
# EAS 계정 로그인 (한 번)
eas login

# 시뮬레이터/내부 테스트용 빌드
eas build --profile preview --platform ios

# TestFlight/Play Console 배포
eas build --profile production --platform all
eas submit -p ios --latest
```

## Stack

- **Framework**: Expo SDK 54 · React Native 0.81 · Expo Router (file-based)
- **Language**: TypeScript (strict)
- **Styling**: NativeWind v4 · Tailwind v3
- **Animation**: react-native-reanimated v4 · react-native-worklets
- **SVG**: react-native-svg
- **Gradient**: expo-linear-gradient · expo-blur
- **Persistence**: AsyncStorage + Zustand persist middleware
- **Camera/Share**: expo-image-picker · expo-sharing · react-native-view-shot · expo-print
- **Server**: Supabase (placeholder — Phase 2에서 wiring)
- **State**: Zustand v4

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

## Supabase

스키마 + RLS + 시드: [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) · [`supabase/seed.sql`](supabase/seed.sql)

```bash
# Apply to a Supabase project
supabase link --project-ref <ref>
supabase db push                # runs 0001_init.sql
psql $DATABASE_URL -f supabase/seed.sql
```

활성화하려면 `.env`에:

```
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Phase 1.5 데이터는 Zustand in-memory(`stores/tastings.ts`)에 저장됨. Phase 2에서 Supabase wiring.

## Claude Vision (label OCR)

[`lib/labelOcr.ts`](lib/labelOcr.ts) — 라벨 사진 → distillery/age/abv 자동 식별. 현재는 deterministic 스텁(시드 카탈로그에서 순환 선택). 활성화하려면:

```
EXPO_PUBLIC_ANTHROPIC_API_KEY=<key>
```

`isOcrConfigured` 플래그가 true일 때만 실제 Vision API 호출.

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

## Phase 1.5 — 시음 일기 동작 (this session)

- [x] **시음 노트 composer** (`app/tasting/new.tsx`) — 위스키 선택 + Nose/Palate/Finish + 별점 + 자리(setting). OCR 자동 채우기 버튼 포함
- [x] **시음 노트 상세** (`app/tasting/[id].tsx`) — 저장된 노트를 양피지 카드로 표시 + Discard + 인스타 share
- [x] **인스타 share 카드** (`app/tasting/share/[id].tsx`) — TROVE 헤더 + 양피지 카드 + footer 통합 캔버스, `react-native-view-shot`로 PNG 캡처, `expo-sharing`으로 시스템 share
- [x] **Claude Vision OCR 스텁** (`lib/labelOcr.ts`) — 데모용 deterministic identifier, API key 셋업 시 실제 호출
- [x] **Supabase 스키마 SQL** (`supabase/migrations/0001_init.sql` + `seed.sql`) — distilleries · bottles · user_bottles · tastings · wishlist + RLS
- [x] **Diary tab** — 시음 노트 리스트(별점 + 미리보기 + 날짜), 빈 상태는 invitation 카드
- [x] **Cellar tab 연동** — 시음한 위스키는 owned로 진열(밝은 핀조명), MSRP 합산 → Est. Value, 평균 별점 → Avg. Score
- [x] **BottlePicker** 컴포넌트 — composer 안 horizontal scroll selector

## Phase 2 — extended features (this session)

- [x] **AsyncStorage persistence** — Zustand `persist` middleware for tastings, wishlist, and auth stores. App restart restores all state
- [x] **Wishlist 실 동작** — `stores/wishlist.ts` + 위시리스트 탭 리스트 UI(병 SVG + 메타 + ₩MSRP + × 삭제) + 위스키 상세 "+ Save to wishlist" 토글(저장 시 ✓ ON WISHLIST brass로 표시)
- [x] **카메라 실 wiring** — `expo-image-picker` 권한 + 카메라/보관함 선택 UI, 식별 결과를 자동으로 BottlePicker에 반영
- [x] **Claude Vision OCR 실 호출** — `lib/labelOcr.ts`가 `EXPO_PUBLIC_ANTHROPIC_API_KEY` 있을 때 `claude-opus-4-7` 호출, 구조화된 JSON 응답을 시드 카탈로그와 매칭
- [x] **위스키 추천 (`lib/recommendations.ts`)** — 사용자 시음 region/cask/style 패턴을 별점으로 가중치 부여, Diary에 horizontal scroll로 노출 ("Speyside · Sherry 취향과 잘 맞습니다")
- [x] **PDF 카탈로그 export** — `expo-print` + `expo-sharing`으로 양피지 톤 그대로의 HTML→PDF 생성, Profile 탭에서 실행
- [x] **Profile 폴리시** — 6칸 통계 (Tastings · Bottles · Avg. ★ · Est. Value · Wishlist · Since), PDF Catalog 액션, "Leave the cellar" with confirm
- [x] **import.meta babel 플러그인** — Zustand devtools의 `import.meta.env` 참조를 Metro 번들에서 syntax-safe하게 치환 (`babel-plugin-strip-import-meta.js`)

## Phase 3 — quality-of-life features (this session)

- [x] **시음 노트 편집** — composer를 `?edit=<id>` 모드로 재사용, 기존 값 prefill + "노트 갱신" CTA, tasting 상세에 "노트 다듬기 · Edit" 액션
- [x] **Diary 검색 + 필터** — `components/DiaryFilterBar.tsx`: 검색바(증류소/노트 내용) + region chips(diary에 있는 지역만) + ★0/3/4/5 rating chips. 3개 이상의 노트가 있어야 노출. 필터 적용 시 헤더에 `2 / 3` 카운트
- [x] **시음 인사이트 (Profile)** — `lib/insights.ts` + `components/InsightsPanel.tsx`: Region 상위 3개 stacked bar + Cask 상위 3개 + 월별 시음 빈도 6개월 막대
- [x] **시음 → 위시리스트 자동 정리** — 시음 저장 시 해당 bottle이 위시리스트에 있으면 자동 제거 + "위시리스트에서 정리했습니다 · 한 잔을 마셨으니 더 이상 기다리지 않아요." alert
- [x] **셀러 정렬 강화** — 보유 위스키를 best 별점 순으로 정렬, top-rated 위스키가 자동으로 featured(밝은 핀조명 + 펄스)

## macOS 트러블슈팅

- **`pod install` 실패 (CocoaPods)**: `cd ios && pod repo update && pod install` 직접 실행. M1/M2 Mac은 `arch -x86_64 pod install`이 필요할 수도 있음
- **`Unable to boot the iOS Simulator`**: Xcode 열어서 한 번 시뮬레이터를 수동으로 부팅하면 캐시 생성됨
- **`Metro bundler` 포트 충돌**: `npx expo start --port 8082` 또는 `lsof -ti:8081 | xargs kill`
- **폰트가 로드되지 않음**: `npx expo start --clear`로 Metro 캐시 초기화. `@expo-google-fonts/*` 패키지는 첫 빌드 시에만 다운로드됨
- **`Reanimated` 에러**: `babel.config.js`에 `react-native-worklets/plugin`이 plugins 끝에 있는지 확인 (이미 설정됨)
- **build cache 꼬임**: `rm -rf ios android .expo node_modules && npm install && npx expo prebuild --clean`
- **AsyncStorage 데이터 초기화하고 싶을 때**: 시뮬레이터에서 `Device → Erase All Content and Settings`

## Phase 4 (next)

- Supabase 실 wiring + auth 마이그레이션 (스키마는 준비됨)
- 가격 추적 (한국 면세점 시세 API)
- 친구 셀러 비교 / public sharing
- 한국 전통주/사케 확장
- iPhone/Android 빌드 + TestFlight/Play Console 배포

---

© 2026 (주)트로브 / Trove Inc.
