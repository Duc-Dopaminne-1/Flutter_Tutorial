// Color system
import { Dimensions } from 'react-native';

export const colors = {
  WHITE: '#fff',
  BORDER_LINE: '#eee',
  ICON_COLOR: '#444',
  GREY: '#c5c5c5',
  DARK_GREY: '#8C8C8C',
  VERY_DARK_GREY: '#4D4D4D',
  SEARCH_BACKGROUND: '#E4E4E4',
  SHOP_GREY: '#d9d9d9',
  LIGHT_GREY: '#f5f5f5',
  LIGHT_BLUE: '#3BB9FF',
  SUPER_LIGHT_BLUE: '#ADDFFF',
  GRAY100: '#f8f9fa',
  GRAY200: '#e9ecef',
  GRAY300: '#dee2e6',
  GRAY400: '#ced4da',
  GRAY500: '#adb5bd',
  GRAY600: '#6c757d',
  GRAY700: '#495057',
  GRAY800: '#343a40',
  GRAY900: '#212529',
  BLACK: '#000',
  BLACK10: 'rgba(0, 0, 0, 0.1)',
  BLACK20: 'rgba(0, 0, 0, 0.2)',
  BLACK30: 'rgba(0, 0, 0, 0.3)',
  BLACK40: 'rgba(0, 0, 0, 0.4)',
  BLACK50: 'rgba(0, 0, 0, 0.5)',
  BLACK60: 'rgba(0, 0, 0, 0.6)',
  BLACK70: 'rgba(0, 0, 0, 0.7)',
  BLACK80: 'rgba(0, 0, 0, 0.8)',
  BLACK90: 'rgba(0, 0, 0, 0.9)',
  DOT_GREEN: 'rgb(71,181,53)',
  LIGHT_BLACK: 'rgb(138,141,145)',
  BACKGROUND_FORM: 'rgb(241,241,244)',
  MESSAGE_FORM: 'rgb(23,135,251)',
  MESSAGE_TEXT: 'rgb(29,33,40)',
  MESSAGE_GUESS: 'rgb(241,240,240)',
  BACKGROUND_OPACITY: 'rgba(0, 0, 0, 0.4)',

  BLUE_PICK: '#0072CA',
  SELECTED: '#1F4BA5',
  BLUE: '#007bff',
  INDIGO: '#6610f2',
  PURPLE: '#6f42c1',
  PINK: '#e83e8c',
  RED: '#dc3545',
  ORANGE: '#fd7e14',
  YELLOW: '#ffc107',
  GREEN: '#28a745',
  TEAL: '#20c997',
  CYAN: '#17a2b8',
  BROWN: '#8B572A',
  SUCCESS: '#28a745',
  INFO: '#17a2b8',
  WARNING: '#ffc107',
  DANGER: '#dc3545',
  LIGHT: '#f8f9fa',
  DARK: '#343a40',
  DARK_GREEN: '#33827C',
  LIGHT_GREEN: '#89BCBA',
  SUPER_LIGHT_GREEN: '#E4F2F1',

  PRIMARY: '#0F0F13',
  SECONDARY: '#131318',

  RED_COLOR: '#FF0000',
  GRAY_COLOR: '#676877',

  TEXT_PLACEHOLDER: 'rgba(255, 255, 255, 0.5)',
  TEXT_SMALL_RED: '#FF0C0C',
  INPUT_BG: '#22222B',

  BOOK_IMAGE_LIGHT: 'rgba(0, 0, 0, 0)',
  BOOK_IMAGE_DARK: 'rgba(0, 0, 0, 0.9)',

  SLIDER_LIGHT: 'rgba(216, 216, 216, 0)',
  SLIDER_DARK: 'rgba(216, 216, 216, 0.9)',
};

// Fonts
export const FONT_COLOR = colors.GRAY800;
export const FONT_SIZE_DEFAULT = 14;
export const FONT_SIZE_SM = FONT_SIZE_DEFAULT * 0.875;
export const FONT_SIZE_LG = FONT_SIZE_DEFAULT * 1.25;
export const FONT_SIZE_H1 = FONT_SIZE_DEFAULT * 2.5;
export const FONT_SIZE_H2 = FONT_SIZE_DEFAULT * 2;
export const FONT_SIZE_H3 = FONT_SIZE_DEFAULT * 1.75;
export const FONT_SIZE_H4 = FONT_SIZE_DEFAULT * 1.15;

// FontWeight
export const FONT_WEIGHT_REGULAR = '400';
export const FONT_WEIGHT_MEDIUM = '500';
export const FONT_WEIGHT_BOLD = '600';

// Sizing
export const sidePadding = Dimensions.get('window').width * 0.05;
export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
export const WIDTH_RATIO = WIDTH > 375 ? 1 : WIDTH / 375;
export const LINE_HEIGHT_DEFAULT = 40;
export const SPACING_DEFAULT = 15;
export const SPACING_SS = 5;
export const SPACING_SM = 10;
export const SPACING_LG = 30;
export const RADIUS_DEFAULT = 5;
export const RADIUS_SM = 2;
export const RADIUS_LG = 10;
export const RADIUS_SL = 20;
export const RADIUS_DL = 40;
export const WIDTH_GENRES = Dimensions.get('window').width;

// Border
export const BORDER_COLOR_DEFAULT = colors.GRAY500;
export const BORDER_WIDTH = 1;

// Date format
export const FORMAT_DATE = 'YYYY-MM-DD';

// regex format
export const REGEX_PROMO_CODE = /^[A-Z0-9]*$/;
export const REGEX_POSTAL_CODE_CAD = /^[A-Z0-9][A-Z0-9\- ]{0,10}[A-Z0-9]$/;

export const fonts = {
  AvenirLTStdBook: 'Avenir-Book',
  AvenirLTStdLight: 'Avenir-Light',
  AvenirLTStdMedium: 'Avenir-Medium',
  AvenirLTStdRoman: 'Avenir-Roman',
  AvenirLTStdBookOblique: 'Avenir-BookOblique',
  AvenirLTStdLightOblique: 'Avenir-LightOblique',
  AvenirLTStdMediumOblique: 'Avenir-MediumOblique',
  AvenirLTStdOblique: 'Avenir-Oblique',
  AvenirLTStdBlack: 'Avenir-Black',
  AvenirLTStdHeavy: 'Avenir-Heavy',
  AvenirLTStdBlackOblique: 'Avenir-BlackOblique',
  AvenirLTStdHeavyOblique: 'Avenir-HeavyOblique',
};
