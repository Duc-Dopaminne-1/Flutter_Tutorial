export interface AuctionStartPriceByCountry {
  code: string;
  name: string;
  value: number;
}

export interface AppSetting {
  AUCTION_START_PRICE: number;
  USER_MAX_DISTANCE: number;
  MINIMUM_CONDITION_LIKES: number;
  FILE_PRIVACY_POLICY: string;
  FILE_SAFETY_POLICY: string;
  FILE_TERM_OF_SERVICE: string;
  IS_FIRST_INSTALL: boolean;
  IS_FIRST_REVIEW: boolean;
  IS_FIRST_MEET_GREAT_PERSON: boolean;
  IS_FIRST_MEET_GREAT_VIRTUAL: boolean;
  APP_VERSION_MINIMUM: string;
  APP_VERSION_CURRENT: string;
  FILTER_MAX_DISTANCE: number;
  FILTER_MIN_DISTANCE: number;
  AUCTION_START_PRICE_BY_COUNTRY: AuctionStartPriceByCountry[];
}
