-- Trove Cellar — seed data
-- Run after 0001_init.sql

insert into distilleries (slug, name, name_ko, country, region) values
  ('glenfiddich',    'Glenfiddich',     '글렌피딕',     'Scotland', 'Speyside'),
  ('macallan',       'The Macallan',    '맥캘란',       'Scotland', 'Speyside'),
  ('ardbeg',         'Ardbeg',          '아드벡',       'Scotland', 'Islay'),
  ('lagavulin',      'Lagavulin',       '라가불린',     'Scotland', 'Islay'),
  ('highland-park',  'Highland Park',   '하이랜드 파크', 'Scotland', 'Orkney'),
  ('talisker',       'Talisker',        '탈리스커',     'Scotland', 'Highlands'),
  ('yamazaki',       'Yamazaki',        '야마자키',     'Japan',    'Japan'),
  ('hibiki',         'Hibiki',          '히비키',       'Japan',    'Japan'),
  ('makers-mark',    'Maker''s Mark',   '메이커스 마크', 'USA',      'Kentucky'),
  ('buffalo-trace',  'Buffalo Trace',   '버팔로 트레이스', 'USA',    'Kentucky')
on conflict (slug) do nothing;

insert into bottles (distillery_id, name, full_name, age_years, abv, cask_type, expression, expression_ko, bottle_style, msrp_krw)
select d.id, b.name, b.full_name, b.age_years, b.abv, b.cask_type, b.expression, b.expression_ko, b.bottle_style, b.msrp_krw
from (values
  ('glenfiddich',   '18 Year Old',        'Glenfiddich 18',              18,   40.0, 'Sherry',                 'Our Original Twelve, aged eighteen', '오리지널 12년의 깊이를 18년으로', 'malt',     200000),
  ('glenfiddich',   '12 Year Old',        'Glenfiddich 12',              12,   40.0, 'Bourbon/Sherry',         null, null, 'malt',     70000),
  ('macallan',      '12 Sherry Oak',      'The Macallan 12 Sherry Oak',  12,   40.0, 'Sherry',                 null, null, 'malt',     180000),
  ('ardbeg',        '10 Year Old',        'Ardbeg 10',                   10,   46.0, 'Bourbon',                null, null, 'islay',    130000),
  ('ardbeg',        'Uigeadail',          'Ardbeg Uigeadail',            null, 54.2, 'Sherry',                 null, null, 'islay',    220000),
  ('lagavulin',     '16 Year Old',        'Lagavulin 16',                16,   43.0, 'Refill',                 null, null, 'islay',    180000),
  ('highland-park', '15 Viking Heart',    'Highland Park 15',            15,   44.0, 'Sherry',                 null, null, 'highland', 200000),
  ('talisker',      '10 Year Old',        'Talisker 10',                 10,   45.8, 'Refill',                 null, null, 'highland', 100000),
  ('yamazaki',      '12 Year Old',        'Yamazaki 12',                 12,   43.0, 'Mizunara/Sherry',        null, null, 'japan',    350000),
  ('hibiki',        'Japanese Harmony',   'Hibiki Japanese Harmony',     null, 43.0, 'Mizunara/Sherry/Bourbon',null, null, 'japan',    200000),
  ('makers-mark',   'Original',           'Maker''s Mark',               null, 45.0, 'New Oak',                null, null, 'bourbon',  65000),
  ('buffalo-trace', 'Bourbon',            'Buffalo Trace',               null, 45.0, 'New Oak',                null, null, 'bourbon',  75000)
) as b(distillery_slug, name, full_name, age_years, abv, cask_type, expression, expression_ko, bottle_style, msrp_krw)
join distilleries d on d.slug = b.distillery_slug
on conflict do nothing;
