import { HEIGHT, WIDTH, colors, fonts } from '@constants/vars';
import { StyleSheet, Platform } from 'react-native';
import { isAndroid } from '@src/utils';
import DeviceInfo from 'react-native-device-info';

const topPadding = isAndroid()
  ? DeviceInfo.hasNotch()
    ? HEIGHT * 0.075
    : HEIGHT * 0.035
  : HEIGHT <= 736
    ? HEIGHT * 0.035
    : HEIGHT * 0.05;
const bottomPadding = WIDTH === 375 ? 0 : WIDTH * 0.05;

export const styles = StyleSheet.create({
  headerContainer: {
    width: WIDTH,
    height: HEIGHT * 0.11,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: topPadding,
    paddingBottom: 0,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },

  imageStyle: {
    width: 20,
    height: 20,
  },

  mainImageStyle: {
    width: 40,
    height: 40,
    marginStart: 32,
  },

  mainTextStyle: {
    fontSize: 15,
    fontFamily: fonts.MontserratMedium,
    color: '#1B72BF',
    marginStart: 32,
  },

  badgeText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 10,
    fontFamily: fonts.MontserratMedium,
  },
  badgeContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    position: 'absolute',
    left: 12,
    bottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  rightImageInvisible: {
    height: 25,
    width: 25,
    backgroundColor: 'transparent'
  },
  leftImageInvisible: {
    height: 25,
    width: 25,
    backgroundColor: 'transparent'
  },
  paddingIcon: {
    marginRight: 12,
  },
});

export default styles;
