import type { Distillery } from '@/lib/types';

export const DISTILLERIES_SEED: Distillery[] = [
  { slug: 'glenfiddich',    name: 'Glenfiddich',     nameKo: '글렌피딕',     country: 'Scotland', region: 'Speyside'  },
  { slug: 'macallan',       name: 'The Macallan',    nameKo: '맥캘란',       country: 'Scotland', region: 'Speyside'  },
  { slug: 'ardbeg',         name: 'Ardbeg',          nameKo: '아드벡',       country: 'Scotland', region: 'Islay'     },
  { slug: 'lagavulin',      name: 'Lagavulin',       nameKo: '라가불린',     country: 'Scotland', region: 'Islay'     },
  { slug: 'highland-park',  name: 'Highland Park',   nameKo: '하이랜드 파크', country: 'Scotland', region: 'Orkney'    },
  { slug: 'talisker',       name: 'Talisker',        nameKo: '탈리스커',     country: 'Scotland', region: 'Highlands' },
  { slug: 'yamazaki',       name: 'Yamazaki',        nameKo: '야마자키',     country: 'Japan',    region: 'Japan'     },
  { slug: 'hibiki',         name: 'Hibiki',          nameKo: '히비키',       country: 'Japan',    region: 'Japan'     },
  { slug: 'makers-mark',    name: "Maker's Mark",    nameKo: '메이커스 마크', country: 'USA',      region: 'Kentucky'  },
  { slug: 'buffalo-trace',  name: 'Buffalo Trace',   nameKo: '버팔로 트레이스', country: 'USA',    region: 'Kentucky'  },
];
