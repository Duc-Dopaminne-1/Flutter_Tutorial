/* eslint-disable react-native/no-color-literals */
import {StyleSheet} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';

const DEVIDE_COLOR = '#EBEBEB';
export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_10,
    overflow: 'hidden',
  },
  bodyContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 160,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  versionLabel: {
    ...FONTS.semiBold,
    fontSize: 18,
  },
  versionName: {
    ...FONTS.semiBold,
    fontSize: 18,
    color: '#FF4D00',
  },
  releaseNoteContainer: {
    marginTop: 8,
    maxHeight: 150,
  },
  releaseNote: {
    ...FONTS.regular,
    fontSize: 16,
    minHeight: 150,
  },
  devideVertical: {
    width: '100%',
    height: 1,
    backgroundColor: DEVIDE_COLOR,
  },
  devideHorizontal: {
    width: 1,
    backgroundColor: DEVIDE_COLOR,
    marginVertical: 11,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  skipButton: {
    ...FONTS.semiBold,
    fontSize: 16,
    padding: 24,
    color: '#979797',
  },
  optionUpdateButton: {
    ...FONTS.semiBold,
    fontSize: 16,
    padding: 24,
  },
  forceButton: {
    width: '60%',
    borderRadius: 15,
    backgroundColor: '#00D287',
    marginBottom: normal,
  },
  forceButtonTitle: {
    ...FONTS.semiBold,
    fontSize: 16,
    padding: 16,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'center',
  },
});
