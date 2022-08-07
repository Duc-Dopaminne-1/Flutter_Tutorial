import { Dimensions, Platform, StatusBar } from 'react-native';
import { scale } from '../utils/responsive';

export const STATUS_BAR_HEIGHT = scale(0);

export const BOTTOM_BAR_HEIGHT = Platform.OS === 'ios' ? scale(15) : scale(10);

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const HEADER_HEIGHT = STATUS_BAR_HEIGHT + (Platform.OS === 'ios' ? scale(48) : scale(64));

export const NAVIGATOR_BAR_HEIGHT =
  Dimensions.get('screen').height - Dimensions.get('window').height - StatusBar.currentHeight;

export const BOTTOM_TAB_HEIGHT = BOTTOM_BAR_HEIGHT + scale(50);

export const BUTTON_HEIGHT = scale(50, false);
export const BUTTON_HEIGHT_MEDIUM = scale(35, false);
export const BUTTON_WIDTH = DEVICE_WIDTH * 0.8;

export const ICON_SIZE = {
  TINY: scale(10),
  SMALL: scale(16),
  NORMAL: scale(20),
  MEDIUM: scale(24),
  LARGE: scale(28),
  X_LARGE: scale(32),
  XX_LARGE: scale(36),
  XXX_LARGE: scale(40),
  STICKER: scale(80)
};

export const BORDER_RADIUS = scale(6);

export const MULTIE_BORDER_RADIUS = {
  TINY: scale(2),
  SMALL: scale(5),
  NORMAL: scale(8),
  MEDIUM: scale(10),
  LARGE: scale(14),
  X_LARGE: scale(20),
  XX_LARGE: scale(26),
  XXX_LARGE: scale(32)
};

export const SPACING = {
  Tiny: scale(2),
  Small: scale(4),
  XSmall: scale(6),
  Normal: scale(8),
  Fit: scale(10),
  XNormal: scale(12),
  XXNormal: scale(14),
  Medium: scale(16),
  XMedium: scale(20),
  Large: scale(24),
  XLarge: scale(26),
  XXLarge: scale(32),
  HasBottomButton: BOTTOM_TAB_HEIGHT + scale(52),
  BottomButton: scale(16),
  HtmlBottom: scale(40),
  BottomInputForm: scale(300)
};
