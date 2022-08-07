import {StyleSheet} from 'react-native';

import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';

export const AuthError = {
  INVALID_GRANT: 'tên đăng nhập hoặc mật khẩu chưa chính xác',
};

export const AuthScreenConstants = {
  TOP_HEADER_MINIMUM_FONT_SIZE: 20,
  TOP_HEADER_FONT_SIZE: 36,
  TEXT_FONT_SIZE: 15,
  TEXT_FONT: FONTS.regular,
  HEADER_MARGIN_TOP: 30,
  CONTAINER_PADDING_LEFT: 20,
  INPUTS_MARGIN_TOP: 30,
  INPUTS_MARGIN_RIGHT: 0,
  MARGIN_TOP_NORMAL: 10,
  INPUT_MARGIN_TOP: 20,
};

export const AuthScreenStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    paddingHorizontal: AuthScreenConstants.CONTAINER_PADDING_LEFT,
  },
  buttonBack: {
    paddingBottom: 24,
    paddingRight: 44,
  },
  buttonClose: {
    paddingBottom: 24,
    paddingLeft: 44,
    paddingRight: 24,
  },
  titleAreaWithButtonBack: {
    marginTop: AuthScreenConstants.HEADER_MARGIN_TOP,
  },
  titleAreaWithoutBack: {
    marginTop: 70,
  },
  buttonNext: {
    marginHorizontal: 16,
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: 4,
    paddingTop: 13,
    paddingBottom: 14,
  },
  titleButtonNext: {
    ...FONTS.bold,
    fontSize: 14,
  },
  buttonBottom: {
    marginHorizontal: normal,
    marginVertical: normal,
  },
  bottomView: {marginBottom: 20},
  viewBottomText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
});
