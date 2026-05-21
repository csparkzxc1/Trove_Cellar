import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { BOTTLES_SEED } from '@/constants/bottles-seed';
import { DISTILLERIES_SEED } from '@/constants/distilleries-seed';
import type { Tasting } from '@/lib/types';

// Generates a PDF of every tasting in the diary, themed to match the parchment
// note cards. expo-print renders HTML to a native PDF on iOS/Android.

const renderStars = (n: number) => {
  const f = '★'.repeat(Math.max(0, Math.min(5, n)));
  const e = '☆'.repeat(Math.max(0, 5 - n));
  return f + e;
};

function escapeHtml(s: string | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function buildHtml(tastings: Tasting[]): string {
  const total = tastings.length;
  const ownerCask = 'CASK 001';

  const cards = tastings
    .map((t, idx) => {
      const b = BOTTLES_SEED.find((x) => x.id === t.bottleId);
      const d = b && DISTILLERIES_SEED.find((x) => x.slug === b.distillerySlug);
      if (!b || !d) return '';
      const seq = String(total - idx).padStart(2, '0');
      return `
        <section class="card">
          <div class="stamp">
            <div class="age">${b.ageYears ?? '?'}</div>
            <div class="yrs">YEARS</div>
          </div>
          <div class="tag">DISTILLERY №${seq} · ${escapeHtml(b.region)}</div>
          <h2 class="distillery">${escapeHtml(d.name)}</h2>
          ${b.expression ? `<div class="expr">${escapeHtml(b.expression)}</div>` : ''}
          <div class="divider"><span>◆</span></div>
          ${t.nose ? `<div class="note"><div class="key">Nose · 향</div><div class="body">${escapeHtml(t.nose)}</div></div>` : ''}
          ${t.palate ? `<div class="note"><div class="key">Palate · 맛</div><div class="body">${escapeHtml(t.palate)}</div></div>` : ''}
          ${t.finish ? `<div class="note"><div class="key">Finish · 피니쉬</div><div class="body">${escapeHtml(t.finish)}</div></div>` : ''}
          <div class="meta">
            <div class="meta-item"><div class="key">Region</div><div class="val">${escapeHtml(b.region)}</div></div>
            <div class="meta-item"><div class="key">Cask</div><div class="val">${escapeHtml(b.caskType)}</div></div>
            <div class="meta-item"><div class="key">ABV</div><div class="val">${b.abv}%</div></div>
          </div>
          <div class="footer">
            <div class="rating">${renderStars(t.ratingStars ?? 0)}</div>
            <div class="date">Acquired · ${formatDate(t.tastedAt)}</div>
          </div>
        </section>
      `;
    })
    .join('');

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>Trove Cellar — Tasting Catalog</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Times New Roman', serif;
    background: #1A1208;
    color: #E8DDB8;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .cover {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    page-break-after: always;
    background: #1A1208;
  }
  .cover .crest {
    width: 56px; height: 56px;
    border: 1.5px solid #B8954E;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #B8954E;
    font-size: 24px;
    margin-bottom: 32px;
  }
  .cover .brand {
    font-size: 36px;
    letter-spacing: 0.16em;
    color: #E8DDB8;
    font-weight: 500;
  }
  .cover .brand em {
    font-style: italic;
    font-size: 28px;
    color: #D4A574;
    margin-left: 6px;
    letter-spacing: 0.04em;
  }
  .cover .sub {
    margin-top: 18px;
    color: #A8957A;
    letter-spacing: 0.18em;
    font-size: 11px;
    text-transform: uppercase;
  }
  .cover .title {
    margin-top: 40px;
    font-size: 22px;
    color: #E8DDB8;
    letter-spacing: 0.02em;
  }
  .cover .title em {
    font-style: italic;
    color: #D4A574;
  }
  .cover .meta {
    margin-top: 32px;
    color: #A8957A;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .pages {
    padding: 40px;
    background: #1A1208;
  }
  .card {
    background: #E8DDB8;
    color: #2B1E14;
    padding: 30px 26px 24px;
    margin-bottom: 28px;
    border: 1px solid #B5A074;
    position: relative;
    page-break-inside: avoid;
  }
  .stamp {
    position: absolute;
    top: 18px; right: 22px;
    width: 56px; height: 56px;
    border: 1.5px solid #8E4A0E;
    border-radius: 50%;
    color: #8E4A0E;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: rotate(-12deg);
    opacity: 0.55;
  }
  .stamp .age { font-size: 16px; font-weight: 700; line-height: 1; }
  .stamp .yrs { font-size: 6px; letter-spacing: 0.2em; margin-top: 2px; font-family: monospace; }
  .tag {
    font-family: monospace;
    font-size: 9px;
    letter-spacing: 0.3em;
    color: #8E4A0E;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .distillery {
    font-size: 26px;
    color: #2B1E14;
    letter-spacing: 0.02em;
    font-weight: 600;
  }
  .expr {
    font-style: italic;
    font-size: 16px;
    color: #8E4A0E;
    margin-top: 4px;
  }
  .divider {
    text-align: center;
    margin: 18px 0;
    border-top: 1px solid #B5A074;
    position: relative;
    height: 1px;
  }
  .divider span {
    position: relative;
    top: -8px;
    background: #E8DDB8;
    padding: 0 8px;
    color: #8E4A0E;
    font-size: 10px;
  }
  .note { margin-bottom: 12px; }
  .note .key {
    font-family: monospace;
    font-size: 8px;
    letter-spacing: 0.3em;
    color: #8E4A0E;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .note .body {
    font-size: 13px;
    color: #2B1E14;
    line-height: 1.6;
  }
  .meta {
    display: flex;
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid #B5A074;
  }
  .meta-item {
    flex: 1;
    text-align: center;
  }
  .meta-item .key {
    font-family: monospace;
    font-size: 7px;
    letter-spacing: 0.25em;
    color: #8E4A0E;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .meta-item .val {
    font-size: 13px;
    color: #2B1E14;
    letter-spacing: 0.02em;
  }
  .footer {
    margin-top: 22px;
    text-align: center;
  }
  .rating {
    color: #8E4A0E;
    letter-spacing: 0.3em;
    font-size: 14px;
    margin-bottom: 6px;
  }
  .date {
    font-family: monospace;
    font-size: 8px;
    letter-spacing: 0.2em;
    color: #6B5A42;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <section class="cover">
    <div class="crest">★</div>
    <div class="brand">TROVE <em>cellar</em></div>
    <div class="sub">Private Whisky Library</div>
    <div class="title">시음 노트 모음 <em>tasting catalog</em></div>
    <div class="meta">${ownerCask} · ${total} ${total === 1 ? 'entry' : 'entries'} · ${new Date().getFullYear()}</div>
  </section>
  <div class="pages">${cards}</div>
</body>
</html>`;
}

export async function exportTastingsPdf(tastings: Tasting[]): Promise<string | null> {
  if (tastings.length === 0) return null;
  const html = buildHtml(tastings);
  const { uri } = await Print.printToFileAsync({ html });
  if (Platform.OS !== 'web' && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Save catalog' });
  }
  return uri;
}
