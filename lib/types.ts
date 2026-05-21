export type BottleStyle = 'malt' | 'islay' | 'japan' | 'bourbon' | 'highland';

export type Region =
  | 'Speyside'
  | 'Islay'
  | 'Highlands'
  | 'Lowlands'
  | 'Campbeltown'
  | 'Japan'
  | 'Kentucky'
  | 'Tennessee'
  | 'Ireland'
  | 'Taiwan'
  | 'India'
  | 'Orkney';

export type Distillery = {
  slug: string;
  name: string;
  nameKo: string;
  country: string;
  region: Region;
};

export type Bottle = {
  id: string;
  distillerySlug: string;
  name: string;
  fullName: string;
  ageYears?: number;
  abv: number;
  caskType: string;
  expression?: string;
  expressionKo?: string;
  bottleStyle: BottleStyle;
  msrpKrw?: number;
  region: Region;
};

export type UserBottle = {
  id: string;
  userId: string;
  bottleId: string;
  acquiredAt: string;
  acquiredPriceKrw?: number;
  notes?: string;
  isFinished: boolean;
  shelfPosition?: number;
};

export type Tasting = {
  id: string;
  userId: string;
  bottleId: string;
  tastedAt: string;
  nose?: string;
  palate?: string;
  finish?: string;
  rating?: number;       // 1-100
  ratingStars?: number;  // 1-5
  setting?: string;
  pairedWith?: string;
};
