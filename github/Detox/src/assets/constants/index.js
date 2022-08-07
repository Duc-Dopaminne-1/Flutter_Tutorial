import {Platform} from 'react-native';

import {
  ArticleType,
  C2CDepositStatus,
  ContactTradingType,
  Direction,
  Gender,
  PaymentUnit,
  PostContractStatus,
  RentPeriodUnit,
  SearchProjectOrderBy,
  SearchPropertyPostOrderBy,
  TotalComissionUnit,
  TransactionPaymentStatus,
  TransactionServiceType,
} from '../../api/graphql/generated/graphql';
import Configs from '../../configs';
import {IMAGES} from '../images';
import {translate} from '../localize';
import {STRINGS} from '../localize/string';
import {COLORS} from '../theme/colors';

export const MAX_UPLOAD_IMAGE_SIZE = 512; //1024: temporary 200 to limit the upload image size to less than 5MB
export const DEFAULT_COUNT_DOWN_TIME_OTP = 60; //seconds
export const EMPTY_STRING = '';

export const PICKER_IMAGE = {
  DOCUMENT: 'DOCUMENT',
  CAMERA: 'CAMERA',
  GALLERY: 'GALLERY',
};

export const SUGGEST_TYPE = {
  agency: 'agent',
  project: 'project',
  property: 'property',
};

export const CONSTANTS = {
  DEFAULT_START_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_SEARCH_PAGE_SIZE: 20,
  DEFAULT_SEARCH_MAP_PAGE_SIZE: 100,
  SMALL_PAGE_SIZE: 10,
  AVATAR_SIZE: 48,
  PRICE_RANGE_VALUES: [0, 2, 5, 10, 20, 30, 40, 50],
  MAX_PRICE_VALUE: 99999999999999,
  MAX_ACREAGE_VALUE: 99999999999999,
  GENDERS: [
    {
      id: 1,
      name: translate(STRINGS.MALE),
      checked: false,
    },
    {
      id: 2,
      name: translate(STRINGS.FEMALE),
      checked: false,
    },
  ],
  HEADER_HEIGHT: 40,
  HEADER_CONTAINER_HEIGHT: 52,
  HEADER_TIMELINE_HEIGHT: 44,
  INPUT_BORDER_RADIUS: 8,
  INPUT_HEIGHT: 45,
  ITEM_HEIGHT: 28,
  INPUT_DESCRIPTION_HEIGHT: 110,
  INPUT_PADDING_VERTICAL: 10,
  INPUT_PADDING_HORIZONTAL: 10,
  INPUT_PADDING_15: 15,
  DROPDOWN_OTHER_ID: 'DROPDOWN_OTHER_ID',
  DEFAULT_DROPDOWN_ID: 0,
  UNCHECK_DROPDOWN_ID: -1,

  DEFAULT_DROPDOWN_NAME: '',
  DEFAULT_JSON_PARSE_ARRAY: '[]',

  EXTRA_KEYBOARD_SCROLL_FOR_HEADER: 50,

  MAX_PRICE_SLIDER: 50,
  MAX_ACREAGE: 10000,

  BILLION: 1000000000,
  MILLION: 1000000,
  THOUSAND: 1000,

  getImagePickerOptions: enableUploadFiles => {
    const options = [
      {id: PICKER_IMAGE.DOCUMENT, label: translate('common.document'), icon: IMAGES.IC_DOCUMENT},
      {id: PICKER_IMAGE.CAMERA, label: translate(STRINGS.TAKE_PHOTO), icon: IMAGES.IC_CAMERA},
      {id: PICKER_IMAGE.GALLERY, label: translate(STRINGS.FROM_LIBRARY), icon: IMAGES.IC_IMAGE},
    ];
    if (!enableUploadFiles) {
      options.shift();
    }
    return options;
  },

  GALLERY_PICKER_OPTION: {
    waitAnimationEnd: false,
    cropping: false,
    mediaType: 'photo',
  },

  CAMERA_PICKER_OPTION: {
    waitAnimationEnd: false,
    cropping: true,
  },

  IMAGE_PICKER_MAX_HEIGHT_OPTION: {
    compressImageMaxHeight: 800,
  },

  CROP_PICKER_OPTION: {
    freeStyleCropEnabled: true,
    waitAnimationEnd: false,
    compressImageMaxHeight: 800,
  },

  //Search Agent:
  ID_DROPDOWN_ALL_GROUP_AGENT: '-1',
  SEARCH_AGENT_NEAR_ME_DISTANCE: 10000, // in meters
  DEFAUTL_SEARCH_AGENT_ORDER: 'NAMEASC',

  HIT_SLOP: {top: 20, bottom: 20, left: 20, right: 20},
  HIT_SLOP_SMALL: {top: 10, bottom: 10, left: 10, right: 10},
  HIT_SLOP_VERTICAL: {top: 20, bottom: 20, left: 0, right: 0},
  HIT_SLOP_HORIZONTAL: {top: 0, bottom: 0, left: 20, right: 20},
  HIT_SLOP_NO_RIGHT: {top: 20, bottom: 20, left: 20, right: 0},

  POST_POSITION_MIN_LATITUDE: -90,
  POST_POSITION_MAX_LATITUDE: 90,
  POST_POSITION_MIN_LONGITUDE: -180,
  POST_POSITION_MAX_LONGITUDE: 180,
  MAX_FRACTION_LONG_LAT_DIGITS: 15,

  NUMBER_AGENT_DO_NOT_SHOW_ALL: 6,

  DEFAULT_KEYWORD_TIME_OUT: 500,
  REFUND_DEPOSITE: 'RefundDeposite',

  SECOND_IN_MILLISECOND: 1000,
  HOUR_IN_SECOND: 3600,
  MINUTE_IN_SECOND: 60,
  DEFAULT_COUNT_DOWN_TIME_OUT: 500,

  DEFAULT_INIT_TIMESTAMP: 0,

  DAY: 'day',

  EMPTY_STRING: '',
  NULL_STRING: 'null',
  UNDEFINED_STRING: 'undefined',

  MAX_BADGE_COUNT: 99,
  DEFAULT_INVESTOR_PAGE_SIZE: 5,

  CURRENCY_UNIT: {
    vnd: 'VND',
    million: 'triệu',
    billion: 'tỷ',
  },

  C2C_AGREEMENT_FILE_NAME: 'Thoa_Thuan_Dang_Tin.pdf',
};

export const KEY_BOARD_TYPE = {
  PHONE_NUMBER: 'phone-pad',
  EMAIL: 'email-address',
  OTP: 'number-pad',
  FLOAT_NUMBER: 'numeric',
  INT_NUMBER: 'number-pad',
  DEFAULT: 'default',
};

export const GLOBAL_ACTIONS = {
  FIELD: 'FIELD',
  NESTED_FIELD: 'NESTED_FIELD',

  INSERT_WORKING_AREA: 'INSERT_WORKING_AREA',
  REMOVE_WORKING_AREA: 'REMOVE_WORKING_AREA',
  PRICES_INTERESTED: 'PRICES_INTERESTED',
  SET_PREFER_PROPERTY_TYPES: 'SET_PREFER_PROPERTY_TYPES',
  SET_AGENT_TYPE: 'SET_AGENT_TYPE',
  SET_ADDRESS_CITY: 'SET_ADDRESS_CITY',
  SET_ADDRESS_DISTRICT: 'SET_ADDRESS_DISTRICT',
  SET_ADDRESS_WARD: 'SET_ADDRESS_WARD',
  SET_ADDRESS_STREET: 'SET_ADDRESS_STREET',

  SET_CONTACT_ADDRESS_CITY: 'SET_CONTACT_ADDRESS_CITY',
  SET_CONTACT_ADDRESS_DISTRICT: 'SET_CONTACT_ADDRESS_DISTRICT',
  SET_CONTACT_ADDRESS_WARD: 'SET_CONTACT_ADDRESS_WARD',
  SET_CONTACT_ADDRESS_STREET: 'SET_CONTACT_ADDRESS_STREET',

  SET_IDENTIFYCATION_TYPE: 'SET_IDENTIFYCATION_TYPE',
  SET_COPY_SAME_ADDRESS: 'SET_COPY_SAME_ADDRESS',
  CHANGE_PROJECT: 'CHANGE_PROJECT',
  CHANGE_ADDRESS: 'CHANGE_ADDRESS',
  CHANGE_OWNER_INFO: 'CHANGE_OWNER_INFO',
  CHANGE_PROPERTY_TYPE: 'CHANGE_PROPERTY_TYPE',
  SET_ERROR_STATE: 'SET_ERROR_STATE',
  INSERT_EXIST_CITY: 'INSERT_EXIST_CITY',
  RESET: 'RESET',
  ON_PROPERTY_TYPES_CHANGE: 'ON_PROPERTY_TYPES_CHANGE',
  CHANGE_PRICES: 'CHANGE_PRICES',
  CHANGE_ACREAGES: 'CHANGE_ACREAGES',
  CHANGE_PROJECT_PRICE: 'CHANGE_PROJECT_PRICE',
  CREATE_WORKING_AREA: 'CREATE_WORKING_AREA',
  CHANGE_POST_TYPE: 'CHANGE_POST_TYPE',
  CHANGE_PRICE: 'CHANGE_PRICE',
  SELLING_COMMISSION: 'SELLING_COMMISSION',
  CHANGE_DATA: 'CHANGE_DATA',
  CHANGE_RENTAL_PRICE: 'CHANGE_RENTAL_PRICE',
  RENTAL_COMMISSION: 'RENTAL_COMMISSION',
  CHANGE_RENTAL_TIME: 'CHANGE_RENTAL_TIME',
  CHANGE_PROPERTY_DETAIL: 'CHANGE_PROPERTY_DETAIL',
  CHANGE_COORDINATE: 'CHANGE_COORDINATE',
  CHANGE_COORDINATE_TEXT: 'CHANGE_COORDINATE_TEXT',
  CHANGE_MODALIZE_STATE: 'CHANGE_MODALIZE_STATE',
  UPDATE_BUILDING_FACILITY: 'UPDATE_BUILDING_FACILITY',
  SET_DETAIL_ERROR: 'SET_DETAIL_ERROR',
  SET_CAPTCHA_STATE: 'SET_CAPTCHA_STATE',
  CHANGE_PACKAGE: 'CHANGE_PACKAGE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  RESET_STATE: 'RESET_STATE',
  SET_ALL_STATE: 'SET_ALL_STATE',
};

export const DATA_MODAL_WELLCOME = [
  {
    title: STRINGS.EARN_EXTRA_INCOME,
  },
  {
    title: STRINGS.DEDICATED_SUPPORT,
  },
  {
    title: STRINGS.INCREASE_REAL_ESTATE_KNOWLEDGE,
  },
  {
    title: STRINGS.MORE_CUSTOMERS,
  },
  {
    title: STRINGS.ABUNDANT_AND_VARIOUS_SOURCES,
  },
];

export const DEFAULT_AVATAR_FILE_NAME = 'avatar.jpg';
export const DEFAULT_IMAGE_FILE_NAME = 'image.jpg';

export const GENDER_TYPE = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  NA: 'NA',
};

export const AVATAR_FILE_NAME = 'avatar.jpg';

export const DEFAULT_PAGE_SIZE = 20;
export const NEWPOST_FIELD = {
  postTitle: 'postTitle',
  propertyTypeId: 'propertyTypeId',
  project: 'project',
  projectId: 'projectId',
  freeTextProject: 'freeTextProject',
  propertyAddress: 'propertyAddress',
  postDescription: 'postDescription',
  postDescriptionPlainText: 'postDescriptionPlainText',
  expiredDate: 'expiredDate',
  ownerIsAuthor: 'ownerIsAuthor',
  ownerName: 'ownerName',
  ownerPhoneNumber: 'ownerPhoneNumber',
  ownerEmail: 'ownerEmail',
  legalDocuments: 'legalDocuments',
};

export const API_TYPE = {
  NONE: 'NONE',
  CREATE: 'CREATE',
  RETRIEVE: 'RETRIEVE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

export const APPROVAL_STATUS_ID = {
  REJECTED: 'a56177a0-f81a-4e37-b3d3-972228821f97',
  REQUEST: '5e4a0d49-13dd-40b2-9e24-bd6337fc323e',
};

export const APPROVAL_STATUS = {
  WAITING: 'waiting', //Chờ duyệt
  APPROVAL: 'approval', //Đã duyệt
  REJECTED: 'rejected', //Từ chối
  EXPIRED: 'expired', //Hết hạn
  SOLD: 'sold', //Đã bán
  CLOSE: 'closed', //Đã đóng
  RENTED: 'rented', //Đã cho thuê
  REQUEST: 'request', //Yêu cầu cập nhật
};

export const GUARANTEE_CONTRACT_STATUS = {
  UNSENT: PostContractStatus.Unsent ?? 'UNSENT',
  WAIT_TO_SIGN: PostContractStatus.Waittosign ?? 'WAITTOSIGN',
  WAIT_FOR_PAY: PostContractStatus.Waitforpay ?? 'WAITFORPAY',
  HAS_PAID: PostContractStatus.Haspaid ?? 'HASPAID',
  REFUSE: PostContractStatus.Refuse ?? 'REFUSE',
};

export const GUARANTEE_CONTRACT_STATUS_TEXT_COLOR = {
  [GUARANTEE_CONTRACT_STATUS.UNSENT]: '#8D33FF',
  [GUARANTEE_CONTRACT_STATUS.WAIT_TO_SIGN]: '#D5600C',
  [GUARANTEE_CONTRACT_STATUS.WAIT_FOR_PAY]: '#4259AB',
  [GUARANTEE_CONTRACT_STATUS.HAS_PAID]: '#449460',
  [GUARANTEE_CONTRACT_STATUS.REFUSE]: '#D52220',
};

export const GUARANTEE_CONTRACT_STATUS_BACKGROUND = {
  [GUARANTEE_CONTRACT_STATUS.UNSENT]: '#F4EBFF',
  [GUARANTEE_CONTRACT_STATUS.WAIT_TO_SIGN]: '#FFEAD2',
  [GUARANTEE_CONTRACT_STATUS.WAIT_FOR_PAY]: '#EBEFFF',
  [GUARANTEE_CONTRACT_STATUS.HAS_PAID]: '#EAF6EE',
  [GUARANTEE_CONTRACT_STATUS.REFUSE]: '#FDE5E4',
};

export const APPROVAL_STATUS_BACKGROUND = {
  [APPROVAL_STATUS.WAITING]: COLORS.ORANGE_90,
  [APPROVAL_STATUS.APPROVAL]: COLORS.BLUE_90,
  [APPROVAL_STATUS.REJECTED]: COLORS.RED_90,
  [APPROVAL_STATUS.EXPIRED]: COLORS.GREY_ED,
  [APPROVAL_STATUS.SOLD]: COLORS.TEAL_90,
  [APPROVAL_STATUS.CLOSE]: COLORS.GRAY_A3,
  [APPROVAL_STATUS.REQUEST]: COLORS.PURPLE_90,
  [APPROVAL_STATUS.RENTED]: COLORS.GREEN_90,
};

export const APPROVAL_STATUS_TEXT_COLOR = {
  [APPROVAL_STATUS.WAITING]: COLORS.ORANGE_DARK_40,
  [APPROVAL_STATUS.APPROVAL]: COLORS.BLUE_DARK_40,
  [APPROVAL_STATUS.REJECTED]: COLORS.RED_DARK_40,
  [APPROVAL_STATUS.EXPIRED]: COLORS.RED_DARK_40,
  [APPROVAL_STATUS.SOLD]: COLORS.TEAL_DARK_40,
  [APPROVAL_STATUS.CLOSE]: COLORS.NEUTRAL_WHITE,
  [APPROVAL_STATUS.REQUEST]: COLORS.PURPLE_DARK_40,
  [APPROVAL_STATUS.RENTED]: COLORS.GREEN_DARK_40,
};

export const APPROVAL_STATUS_BACKGROUND_DEFAULT =
  APPROVAL_STATUS_BACKGROUND[APPROVAL_STATUS.WAITING];

export const APPROVAL_STATUS_TEXT_COLOR_DEFAULT =
  APPROVAL_STATUS_TEXT_COLOR[APPROVAL_STATUS.WAITING];

export const getGuaranteeContractStatusStyle = (statusName, isBackground = true) => {
  if (!statusName) {
    return null;
  }
  if (isBackground) {
    const colorValue = GUARANTEE_CONTRACT_STATUS_BACKGROUND[statusName];
    return colorValue;
  } else {
    const colorValue = GUARANTEE_CONTRACT_STATUS_TEXT_COLOR[statusName];
    return colorValue;
  }
};

export const getPropertyPostTextColor = statusName => {
  let color = APPROVAL_STATUS_TEXT_COLOR_DEFAULT;
  if (statusName) {
    const colorValue = APPROVAL_STATUS_TEXT_COLOR[statusName];
    if (colorValue) {
      color = colorValue;
    }
  }

  if (!color) {
    color = APPROVAL_STATUS_TEXT_COLOR_DEFAULT;
  }

  return {color};
};

export const getPropertyPostStatusStyle = statusName => {
  let backgroundColor = APPROVAL_STATUS_BACKGROUND_DEFAULT;
  if (statusName) {
    const colorValue = APPROVAL_STATUS_BACKGROUND[statusName];
    if (colorValue) {
      backgroundColor = colorValue;
    }
  }

  if (!backgroundColor) {
    backgroundColor = APPROVAL_STATUS_BACKGROUND_DEFAULT;
  }

  return {backgroundColor};
};

export const PROJECT_POST_STATUS = {
  PUBLIC: 'public',
  HIDDEN: 'hidden',
};

export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export const TYPE_SORT_NOTIFY = {
  CREATED_DATE_TIME: 'CREATED_DATE_TIME',
  IS_UNREAD: 'IS_UNREAD',
};

export const PROJECT_STATUS = {
  COMING_SOON: 'comingsoon',
  OPENING: 'open',
  SOLD: 'sold',
};

export const PROJECT_STATUS_ID = {
  '097a447c-e510-4262-a0f5-a3531feabf21': PROJECT_STATUS.COMING_SOON,
  '966d2a2a-dd36-45d8-b4da-a73a1acc576b': PROJECT_STATUS.OPENING,
  '18363157-595f-47dd-84ef-5c3dca6a8676': PROJECT_STATUS.SOLD,
};

export const PROJECT_STATUS_BACKGROUND = {
  [PROJECT_STATUS.COMING_SOON]: '#FF8933',
  [PROJECT_STATUS.OPENING]: '#E53030',
  [PROJECT_STATUS.SOLD]: '#3360FF',
};
export const PROJECT_STATUS_BACKGROUND_DEFAULT = PROJECT_STATUS_BACKGROUND[PROJECT_STATUS.OPENING];

export const getProjectStatusStyle = statusName => {
  let backgroundColor = PROJECT_STATUS_BACKGROUND_DEFAULT;
  if (statusName) {
    const colorValue = PROJECT_STATUS_BACKGROUND[statusName];
    if (colorValue) {
      backgroundColor = colorValue;
    }
  }

  if (!backgroundColor) {
    backgroundColor = PROJECT_STATUS_BACKGROUND_DEFAULT;
  }

  return {backgroundColor};
};

export const UNIT_OF_MEASURE = {
  BILLION: 'billion',
  MILLION: 'million',
};

export const UNIT_PERCENT = '%';

export const HEADER_CONTAINER_TAB2_HEIGHT = 258;
export const HEADER_CONTAINER_TAB1_HEIGHT = 184;

export const MAP = {
  DEFAULT_LATITUDE_DELTA: 0.005,
  DEFAULT_LONGITUDE_DELTA: 0.005,
  MIN_ZOOM_LEVEL: 7,
  CURRENT_COUNTRY: 'VN',
  EPSILON: 1e-6,
};

export const FACILITY_TYPE = {
  NEARBY: 1,
  FURNITURE: 2,
};

export const POST_TYPE = {
  B2C: 'B2C',
  C2C: 'C2C',
  AGENT: 'AGENT',
  RENTAL: 'RENTAL',
};

export const SEARCH_TYPE_INDEX = {
  B2C: 0,
  C2C: 1,
  AGENT: 2,
  RENTAL: 3,
};

export const NEW_POST_MODAL_STATE = {
  ADD_AREA_FACILITY: 'ADD_AREA_FACILITY',
  ADD_FURNITURE_FACILITY: 'ADD_FURNITURE_FACILITY',
  CONFIRM_EDIT: 'CONFIRM_EDIT',
};

export const ALL_SELECT = {
  id: CONSTANTS.UNCHECK_DROPDOWN_ID,
  name: translate(STRINGS.ALL),
  checked: true,
};
export const getDirectionList = () => [
  {id: Direction.East, name: translate(STRINGS.EAST)},
  {id: Direction.West, name: translate(STRINGS.WEST)},
  {id: Direction.South, name: translate(STRINGS.SOUTH)},
  {id: Direction.North, name: translate(STRINGS.NORTH)},
  {id: Direction.Southeast, name: translate(STRINGS.SOUTHEAST)},
  {id: Direction.Northeast, name: translate(STRINGS.NORTHEAST)},
  {id: Direction.Southwest, name: translate(STRINGS.SOUTHWEST)},
  {id: Direction.Northwest, name: translate(STRINGS.NORTHWEST)},
];

export const getLocationList = () => [
  {id: 'FRONT', name: translate(STRINGS.TOWN_HOUSE)},
  {id: 'ALLEY', name: translate(STRINGS.ALLEY)},
];

export const getDirectionKey = directionId => {
  switch (directionId) {
    case Direction.North:
      return 'North';
    case Direction.Northeast:
      return 'Northeast';
    case Direction.West:
      return 'West';
    case Direction.Northwest:
      return 'NorthWest';
    case Direction.South:
      return 'South';
    case Direction.Southwest:
      return 'SouthWest';
    case Direction.East:
      return 'East';
    case Direction.Southeast:
      return 'SouthEast';
  }
};

export const ArticleParam = {
  HandBook: 'hand-book',
  MarketReport: 'market-report',
  RealEstateMarket: 'real-estate-market',
  Newest: 'newest',
};

export const categoriesNews = [
  {
    id: ArticleParam.Newest,
    articleType: ArticleType.Newest,
    text: translate('news.tab.overview'),
  },
  {
    id: ArticleParam.RealEstateMarket,
    articleType: ArticleType.Realestatemarket,
    text: translate('news.tab.realEstateMarket'),
  },
  {
    id: ArticleParam.HandBook,
    articleType: ArticleType.Handbook,
    text: translate('news.tab.handBook'),
  },
  {
    id: ArticleParam.MarketReport,
    articleType: ArticleType.Marketreport,
    text: translate('news.tab.marketReport'),
  },
];

export const categoriesNewsHomepage = [
  {
    id: ArticleParam.Newest,
    articleType: ArticleType.Newest,
    text: translate('news.tab.newsest'),
  },
  {
    id: ArticleParam.HandBook,
    articleType: ArticleType.Handbook,
    text: translate('news.tab.handBook'),
  },
];

const CoursesTypeId = {
  Tips: 15,
  Guide: 16,
  RealEstateLaw: 17,
  LadingPage: 18,
  LifeStyle: 22,
  News: 21,
};

export const categoriesKnowledge = [
  {
    id: CoursesTypeId.RealEstateLaw,
    subTag: 'phap-ly-cac-loai-thue-phi',
    subType: [9, 10, 14, 11],
    text: translate('knowledge.tab.realEstateKnowledge'),
  },
  {
    id: CoursesTypeId.Guide,
    subTag: 'huong-dan-cho-nguoi-ban-nha-lan-dau',
    subType: [6, 7, 8],
    text: translate('knowledge.tab.softSkill'),
  },
  {
    id: CoursesTypeId.Tips,
    subTag: 'bi-kip-mua',
    subType: [4, 5],
    text: translate('knowledge.tab.goodTips'),
  },
  {
    id: CoursesTypeId.News,
    subTag: 'phap-ly-cac-loai-thue-phi',
    subType: [],
    text: translate('knowledge.tab.news'),
  },
  {
    id: CoursesTypeId.LifeStyle,
    subTag: 'huong-dan-cho-nguoi-ban-nha-lan-dau',
    subType: [],
    text: translate('knowledge.tab.lifeStyle'),
  },
];

export const getGenderEnum = genderString => {
  if (!genderString) {
    return genderString;
  }
  if (genderString === translate(STRINGS.FEMALE)) {
    return Gender.Female;
  }
  if (genderString === translate(STRINGS.MALE)) {
    return Gender.Male;
  }
  if (genderString === Gender.Female || genderString === Gender.Male) {
    return genderString;
  }
  return null;
};

export const DEFAULT_RATING_VALUE = 3;
export const MIN_RATING_VALUE = 0;
export const MAX_RATING_VALUE = 5;

export const PAGING_TYPE = {
  CURSOR: 0, // pageSize, cursor
  PAGE: 1,
  CURSOR2: 2, // first, after
};

export const getPropertyOrderList = () => [
  {id: SearchPropertyPostOrderBy.Latest, name: translate(STRINGS.LATEST_POST), checked: true},
  {id: SearchPropertyPostOrderBy.Pricelowest, name: translate(STRINGS.PRICE_LOWEST)},
  {id: SearchPropertyPostOrderBy.Pricehighest, name: translate(STRINGS.PRICE_HIGHEST)},
  {id: SearchPropertyPostOrderBy.Squarelarge, name: translate(STRINGS.SQUARE_LARGE)},
  {id: SearchPropertyPostOrderBy.Squaresmall, name: translate(STRINGS.SQUARE_SMALL)},
];

export const getProjectOrderList = () => [
  {id: SearchProjectOrderBy.Latest, name: translate(STRINGS.LATEST), checked: true},
  {id: SearchProjectOrderBy.Oldest, name: translate(STRINGS.OLDEST)},
  {id: SearchProjectOrderBy.Opening, name: translate(STRINGS.OPENING)},
  {id: SearchProjectOrderBy.Comingsoon, name: translate(STRINGS.COMING_SOON)},
  // {id: SearchProjectOrderBy.Hotpriority, name: translate(STRINGS.HOT_PRIORITY)},
];

export const METRIC_UNIT = {
  METER: 'm',
  SQUARE_METER: 'm²',
  KILOMETER: 'km',
};

export const NEW_POST_STEP = {
  STEP1: 1,
  STEP2: 2,
  STEP3: 3,
  STEP4: 4,
};

export const MAX_LENGTH = {
  accountNumber: 16,
  phoneNumber: 10,
  identity: 12,
  default: 128,
  textArea: 256,
  bedBathFloorNumber: 3,
  arceRoundNumber: 6,
  arceFractionNumber: 2,
  priceFractionNumber: 3, //11,
  REQUEST_NOTE: 300,
  inputMoneyLenght: 15,
  SEARCH_CODE: 100,
  INPUT_50: 50,
  TITLE_INPUT: 200,
  NEW_POST_TITLE_INPUT: 200,
  PROJECT_NAME_INPUT: 128,
  ADDRESS_INPUT: 255,
  DESCRIPTION_INPUT: 5000,
  MAX_COMMISSION_RATE: 100,
  MAX_FACILITIES: 10,
  FACILITY_NAME_INPUT: 20,
  OWNER_NAME: 125,
  contactTrading: {
    limitTotalImages: 10,
    maxSelectingImages: 10,
    maxFileSize: 10 * 1024 * 1024,
  },
  CONTACT_TRADING_DEPOSIT_IMAGES: 10,
  DOCUMENT_IMAGES: 25,
  DOCUMENT_IMAGE_SIZE: 5 * 1024 * 1024,
  DOCUMENT_FILES_CHAT: 10,
  FILE_SIZE: 10,
  FILE_SIZE_CHAT: 10,
  NOTE: 500,
  MAX_PROPERTY_IMAGES: 5,
  avatar: {
    imageSize: 10 * 1024 * 1024,
  },
  campaignCode: 20,
};

export const MIN_LENGTH = {
  TITLE_INPUT: 10,
};

export const NOTIFICATION_TYPE = {
  TRANSACTION: 'Transaction',
  SUGGESTION: 'Suggestion',
  SYSTEM: 'System',
};

export const NOTIFICATION_SUB_TYPE = {
  CONTACT_TRADING_B2C: 'ContactTradingB2C',
};

export const IMAGE_MIME = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  JPG: 'image/jpg',
};

export const IMAGE_EXTENSION = ['jpeg', 'jpg', 'png'];

export const NAVIGATION_ANIMATION_DURATION = Platform.OS === 'ios' ? 300 : 0;
export const TIME_OUT = 300;

export const MAX_COMMISSION_RATE = 100;

export const SALE_TRACKING_STATUS = {
  SOLD: 'sold',
  PILE_OUTSIDE: 'pile-outside',
  WAITING_DEPOSIT: 'waiting-deposit',
  OPENING_DEPOSIT: 'opening-deposit',
  HOLD_PLACE: 'hold-place',
  BOOKED: 'booked',
  BOOKING: 'booking',
  DEPOSIT_CONFIRMED: 'deposit_confirmed',
  OPEN_ANOTHER_SALE: 'open_another_sale',
  NEW: 'new',
};

export const MAX_PAGE_SIZE = 100000;

export const ITEM_TYPE = {
  small: 'small',
  full: 'full',
  fullHeight: 'fullHeight',
  fullWithPadding: 'fullWithPadding',
};

export const ITEM_MAP_TYPE = {
  propertyPost: 'propertyPost',
  project: 'project',
};

export const getRoomsList = () => [
  {id: 0, name: translate(STRINGS.ALL), checked: true},
  {id: 1, name: '1+'},
  {id: 2, name: '2+'},
  {id: 3, name: '3+'},
  {id: 4, name: '4+'},
  {id: 5, name: '5+'},
];

export const getBathRoomList = () => {
  return [
    {id: 0, name: translate(STRINGS.ALL), checked: true},
    {id: 1, name: '1+'},
    {id: 2, name: '2+'},
    {id: 3, name: '3+'},
    {id: 4, name: '4+'},
    {id: 5, name: '5+'},
  ];
};

export const BOOKING_STATUS = {
  BOOKING_COMPLETED: 'booking_completed', // "Hoàn tất đặt chỗ"
  BOOKING_TRANSFER: 'booking_transfer', // "Chuyển đặt chỗ"
  WAITING_DEPOSIT: 'waiting_deposit', // "Chờ Xác nhận cọc"
  DEPOSITED: 'deposited', // "Xác nhận cọc"
  DEPOSTIE_TRANSFER: 'deposit_transfer', // "Chuyển Xác nhận cọc"
  NO_DEPOSIT: 'no_deposit', // "Không Xác nhận cọc"
  SIGNED_CONTRACT: 'signed_contract', // "Đã ký hợp đồng"
  DEPOSIT_CANCEL: 'deposit_cancel', // "Hủy xác nhận cọc"
  REFUND_REQUEST: 'refund_request', // "Yêu cầu Hoàn tiền đặt chỗ"
  REFUNDED: 'refunded', // "Đã Hoàn tiền đặt chỗ"
  OPENING_RESERVATION: 'OpeningReservation', // "Đang mở đặt chỗ"
  ALREADY_BOOKED: 'AlreadyBooked', // "Đã được đặt chỗ"
  HOLDING: 'Holding', // "Giữ chỗ"
  WAITING_PAYMENT: 'awaiting_payment', // "Chờ thanh toán"
  CANCELLED: 'cancelled', // "Bị huỷ/ Từ chối"
};

export const SESSION_STATUS = {
  GENERIC: 'generic_status', // "rổ hàng chung"
  PRIVATE: 'private_status', // "rổ hàng riêng"
};

export const FETCH_POLICY = {
  NETWORK_ONLY: {fetchPolicy: 'network-only'},
  CACHE_AND_NETWORK: {fetchPolicy: 'cache-and-network'},
  NO_CACHE: {fetchPolicy: 'no-cache'},
};

export const PAGE_TYPE = {
  ARTICLE_PAGE: 'ArticlePage',
  INTRODUCTION: 'Introduction',
  BASIC_PAGES: 'BasicPages',
  GUIDE: 'Guide',
};

export const PAGE_CHILD_TYPE = {
  TERMS_OF_USE: 'termsOfUse',
  INTRODUCTION: 'about',
  PRIVACY_POLICY: 'chinh-sach-bao-mat',
  MECHANISMS: 'co-che-giai-quyet-khieu-nai',
  OPERATION: 'quy-che-hoat-dong-mobile-app',
  SERVICE_CHARGE: 'service-fee',
  TRAINING: 'training',
  AGENT_BENEFIT: 'agent-benefit',
  PAYMENT_GUIED: 'payment-guide',
  HANDBOOK: 'HANDBOOK',
  REFUND: 'refund',
  UPGRADE_AGENT: 'upgrade-topener',
  DEPOSIT: 'deposit',
  CONTACT: 'Contact',
  GUIDE: 'guide',
  CREATE_POST: 'create-post-title',
  BOOKING: 'booking',
  UPDATE_CUSTOMER: 'UpdateCustomerPolicy',
  TRAINING_PAGE: 'kien-thuc',
  TERMS_OF_USE_INFO_GENERAL: 'dieu-khoan-su-dung',
  SERVICE_AGREEMENT: 'thoa-thuan-dich-vu-dang-tin',
};

export const GUID_TYPE = {
  BOOK: 'book',
  DEPOSIT: 'deposit',
  POST_NEWS: 'postNews',
  REGISTER_AGENT: 'registerAgent',
};

export const TRANSACTION_MODE = {
  NOTHING: 'MODE_NOTHING',
  BOOKING: 'MODE_BOOKING',
  DEPOSIT: 'MODE_DEPOSIT',
  MOVE_DEPOSIT: 'MODE_MOVE_DEPOSIT',
};

export const MAP_RANK = {
  rank1: {
    id: 1,
    icon: 'IC_RANK_1',
    color: 'SILVER_AC',
    name: 'Silver',
  },
  rank2: {
    id: 2,
    icon: 'IC_RANK_2',
    color: 'GOLD_ED',
    name: 'Gold',
  },
  rank3: {
    id: 3,
    icon: 'IC_RANK_3',
    color: 'PLATINUM_7A',
    name: 'Platinum',
  },
  rank4: {
    id: 4,
    icon: 'IC_RANK_4',
    color: 'DIAMOND',
    name: 'Diamond',
  },
  rank5: {
    id: 5,
    icon: 'IC_RANK_5',
    color: 'DIAMOND_PLUS',
    name: 'Diamond Plus',
  },
  DEFAULT_NAME: 'rank1',
  MAX_RANK_NAME: 'rank5',
};

export const MAP_PROPERTY = {
  apartment: {
    icon: IMAGES.IC_ICON_AGENT_APARTMENT,
    name: translate('apartment'),
  },
  house: {
    icon: IMAGES.IC_ICON_AGENT_HOME,
    name: translate('house'),
  },
  land: {
    icon: IMAGES.IC_ICON_AGENT_PROPERTY,
    name: translate('land'),
  },
  villa: {
    icon: IMAGES.IC_ICON_AGENT_VILLA,
    name: translate('villa'),
  },
};

export const NUMBER_AIM_TO_UPGRADE_RANK = 4;

export const UUID_TOTAL_CHARACTERS = 36;
export const INCLUDE_ITERATION_5_FEATURES = false;

export const SUPPORT_TYPE_ADVIDE_NOT_IN = ['ContactTrading', 'RefundBooking', 'RefundDeposite'];
export const DEFAULT_SUPPORT_TYPE = 'ConsultLegal';
export const CREATE_ACCOUNT_SUPPORT_TYPE = 'CreateAccountSupport';
export const CONSULT_BANKLOAN_SUPPORT_TYPE = 'Credit';
export const CONSULT_PROPERTY_POST_SUPPORT_TYPE = 'ConsultPropertyPost';

export const REQUEST_TYPE = {
  NORMAL: 'NORMAL',
  REFUND: 'REFUND',
};

export const ONE_LINE_TEXT = 'one_line_text';

export const ERROR_AUTH = {
  LIMIT_SESSION: 'CS-01',
};

export const ERROR_CODE_TRANSACTION = {
  BOOKING_OUT_TIME: 'BPM_ERR_017',
  ALREADY_SALE_1: 'BPM_ERR_002',
  ALREADY_SALE_2: 'BP_ERR_002',
};

export const ERROR_DEPOSIT = {
  OUT_NUMBER_TRANSFER: 'DP_ERR_006',
  BOOKING_TO_DEPOSIT_OUT_TIME: 'DP_ERR_013',
  PROPERTY_DEPOSITED_1: 'DP_ERR_001',
  PROPERTY_DEPOSITED_3: 'DP_ERR_003',
};

// use for projectItem and propertyItem
export const UPDATE_ITEM_STRATEGY = {
  NORMAL: 'NORMAL',
  REMOVE_FROM_LIST: 'REMOVE_FROM_LIST',
};

export const BACK_ICON_FONT_SIZE = 14;

export const HOTLINE_NUMBER = '19008000';
export const HOTLINE_NUMBER_FORMAT = '1900 8000';

export const SEASON_STATUS = {
  NEW: 'New',
  RESERVATION_OPENING: 'ReservationOpening',
  RELOCATION_LOCK: 'RelocationLock',
  SALE_OPENING: 'SaleOpening',
  SALE_CLOSING: 'SaleClosing',
};

export const BUY_REQUEST_TYPE = {
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',
};

export const CONTACT_STATUS_ID = {
  Waiting: '722d95b4-dca6-4586-ba4d-6e0ad335ce97',
  Connected: '399108dc-0b43-428a-8fa6-e70accd4f929',
  Negotiate: 'e70228b9-76de-46ae-9642-5630a6b1f9f8',
  Deposited: 'a83e5ebe-ee5b-4048-8b18-edfd084ab65a',
  Completed: '76105cdd-9bd2-4060-9be5-4be03154047d',
  Pending: '77f3cda1-ed1c-4b43-a27b-05d852bfa9dc',
  Rejected: '53a57f38-68ee-43c0-aafd-e1632245b801',
};

export const REQUEST_STATUS_CODE = {
  STATE_NEW: 'New',
  STATE_IN_PROGRESS: 'InProcess',
  STATE_NEGOTIATE: 'Negotiate',
  STATE_DEPOSIT: 'Deposited',
  STATE_COMPLETED: 'Completed',
  STATE_PENDING: 'Pending',
  STATE_CLOSE: 'Closed',
  STATE_PROCESSING: 'Processing',
  STATE_PROCESSED: 'Processed',
};

export const CONTACT_STATUS_STYLE = {
  [CONTACT_STATUS_ID.Waiting]: {
    color: COLORS.ORANGE_DARK_40,
    backgroundColor: COLORS.ORANGE_90,
    name: translate('contactTrading.status.waiting'),
  },
  [CONTACT_STATUS_ID.Connected]: {
    color: COLORS.TEAL_DARK_40,
    backgroundColor: COLORS.TEAL_90,
    name: translate('contactTrading.status.connected'),
  },
  [CONTACT_STATUS_ID.Negotiate]: {
    color: COLORS.PURPLE_DARK_40,
    backgroundColor: COLORS.PURPLE_90,
    name: translate('contactTrading.status.negotiate'),
  },
  [CONTACT_STATUS_ID.Deposited]: {
    color: COLORS.BLUE_DARK_40,
    backgroundColor: COLORS.BLUE_90,
    name: translate('contactTrading.status.deposit'),
  },
  [CONTACT_STATUS_ID.Completed]: {
    color: COLORS.GREEN_DARK_40,
    backgroundColor: COLORS.GREEN_90,
    name: translate('contactTrading.status.complete'),
  },
  [CONTACT_STATUS_ID.Pending]: {
    color: COLORS.TEXT_DARK_10,
    backgroundColor: COLORS.NEUTRAL_DISABLE,
    name: translate(STRINGS.PENDING),
  },
  [CONTACT_STATUS_ID.Rejected]: {
    color: COLORS.RED_DARK_40,
    backgroundColor: COLORS.RED_90,
    name: translate('common.decline'),
  },
};

export const CONTACT_TRADING_TYPE = {
  BUY: ContactTradingType.Buy,
  RENT: ContactTradingType.Rent,
  ALL: STRINGS.ALL,
};

export const REQUEST_DETAIL_DEPOSIT_TAB_ROUTES = {
  DETAIL: 'DETAIL',
  TRANSACTION_INFO: 'TRANSACTION_INFO',
};

export const INTEGER_NUMBER_REGEX = /^[0-9]+$/;
export const FLOAT_NUMBER_REGEX = /^\d+\.?\d*$/;
export const NUMBER_AND_TEXT_REGEX = /^[a-zA-Z0-9]*$/;

export const SUBSCRIPTION_ACTION = {
  SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
  SET_AGREEMENTS_CONFIRMATION_STATE: 'SET_AGREEMENTS_CONFIRMATION_STATE',
  UPDATE_SUBSCRIPTION_STATUS: 'UPDATE_SUBSCRIPTION_STATUS',
};

export const SUBSCRIPTION_PACKAGE_ID = {
  TRIAL: 'c5e1221b-0e2d-47e3-94ad-a8a5e18e81e5',
  PREMIUM: 'c4018b44-2b49-4ded-b212-35d6b79b5b62',
  UNLIMITED: 'ee1c17af-9b43-4194-9664-2e10ac296f8b',
  WARNING: 'Warning',
  RENEWAL: 'Renewal',
};

export const SUBSCRIPTION_RESULT_TYPE = {
  TIMEOUT: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
};

export const DAY_TO_MILISECOND = 24 * 60 * 60 * 1000;

export const APP_CURRENCY = 'VND';

export const PERCENTAGE_UNIT = '%';

export const NOT_ANS = 'N/A';

export const TRANSACTION_STATUS_ID = {
  IN_PROGRESS: '4320a7b4-8e9b-48ec-af38-3d326f12f248',
  FAILED: 'ce04ea9c-f86a-43b5-984b-724c3e4d1fc5',
  SUCCESS: '9bf189fe-81c8-4c8d-bd75-d2ffa6b4a2af',
};

export const PAYMENT_METHODS = {
  cash: {id: '23a55bb4-0bdb-4a46-9bf3-47db39f41a51', name: 'cash', description: 'Tiền mặt'},
  transfer: {
    id: 'bf43f932-fe77-4ebc-8508-470a860d551f',
    name: 'bank_transfer',
    description: 'Chuyển khoản ngân hàng',
  },
  internationalTransfer: {
    id: '08fbb804-acc9-4fc3-8be4-b56176cf50bb',
    name: 'international_card',
    description: 'Thẻ quốc tế',
  },
  eWallet: {
    id: 'efb2ef38-0c7b-480a-92be-55fa22f05998',
    name: 'electronic_wallet',
    description: 'Ví điện tử',
  },
  automaticSystem: {
    id: 'ed651e2a-54bd-4921-87a5-748947cdc532',
    name: 'system_auto',
    description: 'Hệ thống tự động',
  },
};

export const SUPPORT_REQUEST_PAYMENT_STATUS = {
  waiting_payment: {
    id: 'a94aa52d-f6ad-414c-8eac-5da9011161f3',
    code: 0,
    name: 'awaiting_payment',
  },
  partial_payment: {
    id: 'e2cecd78-c6a7-4309-b2c8-612e437be1c1',
    code: 1,
    name: 'partial_payment',
  },
  paid: {
    id: '6c315a95-9e71-497c-9f35-4ee670492381',
    code: 2,
    name: 'paid',
  },
  refund_request: {
    id: '5325ef52-eb44-11eb-9a03-0242ac130003',
    code: 3,
    name: 'refund_request',
  },
  refunded: {
    id: '5fcff55e-eb44-11eb-9a03-0242ac130003',
    code: 4,
    name: 'refunded',
  },
  cancelled: {
    id: '8cb14b5b-8bd6-4317-b4ee-75968378e57e',
    code: 5,
    name: 'cancelled',
  },
};

export const SUBSCRIPTION_STATUS_ID = {
  NOT_EXPRIED_YET: 'fc622352-6110-4fc6-89a4-78268ad42d40',
  EXPIRING_SOON: 'f9a4080c-05f7-434d-b756-f1dbc83eb37a',
  EXPIRED: 'cd8f1a0e-381b-4f34-87c6-bf35d0f88d92',
};

export const UNIT_OF_MEASURE_ID = {
  BILLION: '2e1b0f25-2772-4d71-aca1-9bd0c8fb9a74',
  MILLION: 'bba3d3d5-47ef-44fe-a06d-3dd313fb8924',
};

export const COMMENT_OBJECT_TYPES = {
  PROJECT: 'project',
  POST: 'posts',
  NEWS: 'news',
  TOPENER: 'topener',
  INVESTOR: 'investor',
};

export const TIME_OFFSET_IN_MINUTE = {
  VN: 60 * 7,
};

export const AQUARE_ARRAY = [
  {
    name: '<= 30 m2',
    value: [0, 30],
  },
  {
    name: '30 - 50 m2',
    value: [30, 50],
  },
  {
    name: '50 - 100 m2',
    value: [50, 100],
  },
  {
    name: '100 - 200 m2',
    value: [100, 200],
  },
  {
    name: 'Hơn 200 m2',
    value: [200, 999],
  },
];

export const ACREAGE_ARRAY = [
  {
    name: '<= 30m2',
    value: [0, 30],
  },
  {
    name: '30-50m2',
    value: [30, 50],
  },
  {
    name: '50-100m2',
    value: [50, 100],
  },
  {
    name: '100-200m2',
    value: [100, 200],
  },
  {
    name: '200-500m2',
    value: [200, 500],
  },
  {
    name: '>500m2',
    value: [500, CONSTANTS.MAX_ACREAGE_VALUE],
  },
];

export const PRICE_ARRAY = [
  {
    name: '< 500 triệu',
    value: [0, 0.5 * CONSTANTS.BILLION],
  },
  {
    name: '500 triệu - 1 tỷ',
    value: [0.5 * CONSTANTS.BILLION, CONSTANTS.BILLION],
  },
  {
    name: '1-3 tỷ',
    value: [CONSTANTS.BILLION, 3 * CONSTANTS.BILLION],
  },
  {
    name: '3-5 tỷ',
    value: [3 * CONSTANTS.BILLION, 5 * CONSTANTS.BILLION],
  },
  {
    name: '5-7 tỷ',
    value: [5 * CONSTANTS.BILLION, 7 * CONSTANTS.BILLION],
  },
  {
    name: '7-10 tỷ',
    value: [7 * CONSTANTS.BILLION, 10 * CONSTANTS.BILLION],
  },
  {
    name: 'Trên 10 tỷ',
    value: [10 * CONSTANTS.BILLION, CONSTANTS.MAX_PRICE_VALUE],
  },
];

export const TOPENLAND_TERM_OF_USE_URL = Configs.static_rules + '/rules?tab=termsOfUse';

// UUID for commission from Backend and it is not change
export const CommissionCurrencyUnit = {
  PERCENTAGE: 'ffbe3353-e555-48f9-9166-8b41464c53b4',
  VND: 'bda0d67d-769a-4061-9e96-a737d1f70bfe',
};

export const PROPERTY_POST_REJECT_REASON_ID = {
  junkPost: 'b7168b94-daf6-4142-a289-f0df82b83791',
};

export const RENTAL_PERIOD_TYPE_LIST = [
  {
    id: RentPeriodUnit.Month,
    name: 'Tháng',
    checked: true,
  },
  {
    id: RentPeriodUnit.Year,
    name: 'Năm',
    checked: false,
  },
];

export const COMMISSION_TYPE_LIST = [
  {
    id: TotalComissionUnit.Byvnd,
    name: APP_CURRENCY,
    checked: true,
  },
  {
    id: TotalComissionUnit.Bymonth,
    name: 'Tháng',
    checked: false,
  },
];

export const SEARCH_RENT_PROPERTY_STATUS = [
  {
    id: 0,
    name: 'Tất cả',
    checked: false,
  },
  {
    id: 1,
    name: 'Cho thuê',
    checked: false,
  },
  {
    id: 2,
    name: 'Đã cho thuê',
    checked: false,
  },
];

export const SEARCH_PROPERTY_STATUS = [
  {
    id: STRINGS.ALL,
    name: 'Tất cả',
    checked: false,
  },
  {
    id: APPROVAL_STATUS.APPROVAL,
    name: 'Đang rao bán',
    checked: false,
  },
  {
    id: APPROVAL_STATUS.SOLD,
    name: 'Đã bán',
    checked: false,
  },
];

export const getPropertyPostStatusList = (isSearchRental = false) => {
  if (isSearchRental) {
    return SEARCH_RENT_PROPERTY_STATUS;
  }
  return SEARCH_PROPERTY_STATUS;
};

export const IDENTIFY_TYPE = [
  {
    id: 0,
    title: translate('common.cmnd'),
    value: 'CMND',
  },
  {
    id: 1,
    title: translate('common.cccd'),
    value: 'CCCD',
  },
];

export const GENDER_ARRAY = [
  {
    id: 0,
    title: translate(STRINGS.MALE),
    value: 'MALE',
  },
  {
    id: 1,
    title: translate(STRINGS.FEMALE),
    value: 'FEMALE',
  },
];

export const PAYMENT_UNITS = {
  [PaymentUnit.Vnpay]: {name: 'VNPay'},
  [PaymentUnit.Bidv]: {name: translate('common.bankTransfer')},
  [PaymentUnit.Fast]: {name: translate('common.cash')},
};

export const TransactionServices = {
  [TransactionServiceType.C2Ctype]: {name: translate(STRINGS.RETAIL_ESTATES)},
  [TransactionServiceType.B2Ctype]: {name: translate(STRINGS.PROJECT)},
  [TransactionServiceType.Subtype]: {name: translate('common.fee')},
  [TransactionServiceType.Refundtype]: {name: translate(STRINGS.REFUND_REQUEST)},
  [TransactionServiceType.Supportservicetype]: {
    name: translate('payment.detail.supportServiceRequest'),
  },
  [TransactionServiceType.Subscriptiontype]: {
    name: translate('transaction.serviceType.subscription'),
  },
};

export const ManagePaymentStatusId = {
  WAITING: TransactionPaymentStatus.Awaitingpayment,
  PARTIAL: TransactionPaymentStatus.Partialpayment,
  PAID: TransactionPaymentStatus.Paid,
  REFUND_REQUEST: TransactionPaymentStatus.Refundrequest,
  REFUNDED: TransactionPaymentStatus.Refunded,
  CANCELLED: TransactionPaymentStatus.Cancelled,
};

export const ManagePaymentStatus = {
  [ManagePaymentStatusId.WAITING]: {
    color: COLORS.STATE_ERROR,
    name: translate('payment.status.waitingForPay'),
  },
  [ManagePaymentStatusId.PARTIAL]: {
    color: COLORS.ORANGE_3B,
    name: translate('payment.status.partialPayment'),
  },
  [ManagePaymentStatusId.PAID]: {
    color: COLORS.GREEN_6FCF97,
    name: translate('payment.status.paid'),
  },
  [ManagePaymentStatusId.CANCELLED]: {
    color: COLORS.TEXT_DARK_40,
    name: translate('payment.status.expired'),
  },
  [ManagePaymentStatusId.REFUND_REQUEST]: {
    color: COLORS.BOOKING_COMPLETED,
    name: translate('payment.status.refundRequest'),
  },
  [ManagePaymentStatusId.REFUNDED]: {
    color: COLORS.BLACK_26,
    name: translate('payment.status.refunded'),
  },
};

export const LIST_PLUS_SERVICES = [
  {
    icon: IMAGES.IC_SERVICES_1,
    id: 'd98ade1b-a88c-405a-a538-37325213419c',
    name: 'ConsultCost',
    description: 'Định giá bất động sản',
  },
  {
    icon: IMAGES.IC_SERVICES_2,
    id: '9f133df2-6cf1-4830-93af-807268c54f0d',
    name: 'VerificationPost',
    description: 'Xác thực tin đăng',
  },
  {
    icon: IMAGES.IC_SERVICES_3,
    id: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
    name: 'ConsultLegal',
    description: 'Tư vấn pháp lý',
  },
  {
    icon: IMAGES.IC_SERVICES_4,
    id: 'b09d47c9-91ac-48ea-9b11-66905e9d1622',
    name: 'ConsultFinance',
    description: 'Tài chính bất động sản',
  },
  {
    icon: IMAGES.IC_SERVICES_5,
    id: '3d610763-6890-45db-9d30-eb45a532a1e9',
    name: 'Notarization',
    description: 'Hỗ trợ công chứng',
  },
  {
    icon: IMAGES.IC_SERVICES_8,
    id: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
    name: 'ConsultConveyance',
    description: 'Chuyển quyền sở hữu',
  },
  {
    icon: IMAGES.IC_SERVICES_9,
    id: 'd0f3cc82-61c3-46c1-bc2f-3c6fd2dd6f45',
    name: 'ConsultProcedure',
    description: 'Các thủ tục đóng thuế',
  },
];

export const SUPPORT_SERVICE_CANCEL_REASON = {
  NoNeed: '3a5d3091-e9e7-49e3-85b5-8a097b1a7658',
  TopenerNotReply: '1f9ccbf1-280e-4611-9244-e64d23447990',
  Other: '15ab88b1-5c6d-41e2-ab5a-098f7c2e0dd2',
};

export const EMPTY_TYPE = {
  DEFAULT: 'DEFAULT',
  BUY_REQUEST: 'BUY_REQUEST',
  PAYMENT: 'PAYMENT',
  RECENT_AGENT: 'RECENT_AGENT',
  SUGGESTED_AGENT: 'SUGGESTED_AGENT',
  YOUR_PROPERTY: 'YOUR_PROPERTY',
  YOUR_PROPERTY_CRAWLER: 'YOUR_PROPERTY_CRAWLER',
  CHAT: 'CHAT',
};

export const TOAST_MESSAGE_TYPE = {
  error: 'error',
  success: 'success',
  warning: 'info',
};

export const SORT_FOLLOW = [
  {
    name: translate('social.modalSort.newest'),
    checked: true,
    value: 'ASC',
  },
  {
    name: translate('social.modalSort.oldest'),
    checked: false,
    value: 'DESC',
  },
];

export const USER_AGENT = 'MobileApp';

export const ContactType = {
  B2C: 0,
  C2C: 1,
};

export const CONTACT_TRADING_DEPOSIT_STATUS = {
  sent: C2CDepositStatus?.Depositsent ?? 'DEPOSITSENT',
  accepted: C2CDepositStatus.Depositaccepted ?? 'DEPOSITACCEPTED',
  rejected: C2CDepositStatus.Depositrejected ?? 'DEPOSITREJECTED',
  signed: C2CDepositStatus.Depositsignedcontract ?? 'DEPOSITSIGNEDCONTRACT',
};

export const SUPPORT_SERVICE_TICKET_STATUSES_BY_NAME_TO_ID = {
  New: 'a798260b-71bf-42e6-b797-bedc759c14fc',
  Confirm: '9cece30a-331c-4bf1-826e-0979b71acb60',
  Reject: 'd775ab82-8a72-412b-b925-5caf832addf3',
  Processing: 'cf1d6fe5-bb51-411e-9366-1396ea3873e8',
  Complete: 'b54d58a7-1d90-4d89-b8d4-9ff6936c7355',
  Cancelled: '24901447-b94d-48ee-a0de-a867cabe4fd4',
};

export const SUPPORT_SERVICE_STATUS = {
  New: 'a798260b-71bf-42e6-b797-bedc759c14fc',
  Confirm: '9cece30a-331c-4bf1-826e-0979b71acb60',
  Reject: 'd775ab82-8a72-412b-b925-5caf832addf3',
  Processing: 'cf1d6fe5-bb51-411e-9366-1396ea3873e8',
  Complete: 'b54d58a7-1d90-4d89-b8d4-9ff6936c7355',
  Cancelled: '24901447-b94d-48ee-a0de-a867cabe4fd4',
};

export const SUPPORT_SERVICE_TICKET_STATUSES_BY_ID_TO_NAME = {
  'a798260b-71bf-42e6-b797-bedc759c14fc': 'New',
  '9cece30a-331c-4bf1-826e-0979b71acb60': 'Confirm',
  'd775ab82-8a72-412b-b925-5caf832addf3': 'Reject',
  'cf1d6fe5-bb51-411e-9366-1396ea3873e8': 'Processing',
  'b54d58a7-1d90-4d89-b8d4-9ff6936c7355': 'Complete',
  '24901447-b94d-48ee-a0de-a867cabe4fd4': 'Cancelled',
};

export const SUPPORT_SERVICE_TICKET_STATUSES_BY_ID_TO_STEP = {
  'a798260b-71bf-42e6-b797-bedc759c14fc': 0,
  '9cece30a-331c-4bf1-826e-0979b71acb60': 1,
  'd775ab82-8a72-412b-b925-5caf832addf3': '',
  'cf1d6fe5-bb51-411e-9366-1396ea3873e8': 2,
  'b54d58a7-1d90-4d89-b8d4-9ff6936c7355': 3,
  '24901447-b94d-48ee-a0de-a867cabe4fd4': '',
};

export const REJECT_TICKET_RESULT_REASONS_BY_NAME_TO_ID = {
  PoorQualityPictures: '982c3f0f-9129-4430-8b29-abb3a1917165',
  PostsNotAccurate: '78cb209b-c1fe-483a-8373-e6452e133710',
  Other: '8c331858-63a4-4ac4-9980-da15613a0980',
};

export const PROPERTY_LOCATION = {
  FRONTAGE: 'FRONTAGE',
  ALLEY: 'ALLEY',
};

export const SUPPORT_REQUEST_STATUS = {
  SENT: {
    new: 'Mới',
    confirm: 'Xác nhận',
    reject: 'Từ chối',
    processing: 'Đang thực hiện',
    complete: 'Hoàn thành',
    cancelled: 'Đã hủy',
  },
  RECEIVED: {
    new: 'Mới',
    confirm: 'Xác nhận',
    reject: 'Từ chối',
    processing: 'Đang thực hiện',
    waitingresultbyconsultant: 'Chờ CVTV duyệt kết quả',
    waitingresultbyrequester: 'Chờ người yêu cầu duyệt kết quả',
    waitingupdatebyexecutor: 'Chờ Executor cập nhật',
    complete: 'Hoàn thành',
    cancelled: 'Đã hủy',
  },
};

export const SUPPORT_REQUEST_STATUS_ID = {
  SENT: {
    new: 'new',
    confirm: 'confirm',
    reject: 'reject',
    processing: 'processing',
    complete: 'complete',
    cancelled: 'cancelled',
  },
  RECEIVED: {
    new: 'new',
    confirm: 'confirm',
    reject: 'reject',
    processing: 'processing',
    waitingresultbyconsultant: 'waitingresultbyconsultant',
    waitingresultbyrequester: 'waitingresultbyrequester',
    waitingupdatebyexecutor: 'waitingupdatebyexecutor',
    complete: 'complete',
    cancelled: 'cancelled',
  },
};

export const SUPPORT_SERVICE_POST_UUID = {
  IMPROVEMENT_AND_BASIC_VERIFICATION: '948eaed8-4c0c-11ec-ba35-cf06209f6850',
  VERIFICATION_POST: '9f133df2-6cf1-4830-93af-807268c54f0d',
};

export const FILTER_STATUS_ALL_SELECT = {
  id: '',
  name: translate(STRINGS.ALL),
  checked: false,
};

export const COMMISSION_CHART_COLORS_THEME = {
  topenland: COLORS.BLUE_BASIC,
  buyer: COLORS.BLUE_BASIC,
  seller: COLORS.YELLOW_BASIC,
};

export const ArticleTypeId = {
  HandBook: 4,
  MarketReport: 12,
  RealEstateMarket: 9,
};

export const ArticleTypeQueryMapper = {
  [ArticleParam.Newest]: [
    {article_type_id: ArticleTypeId.HandBook},
    {article_type_id: ArticleTypeId.MarketReport},
    {article_type_id: ArticleTypeId.RealEstateMarket},
  ],
  [ArticleParam.HandBook]: [{article_type_id: ArticleTypeId.HandBook}],
  [ArticleParam.MarketReport]: [{article_type_id: ArticleTypeId.MarketReport}],
  [ArticleParam.RealEstateMarket]: [{article_type_id: ArticleTypeId.RealEstateMarket}],
};
