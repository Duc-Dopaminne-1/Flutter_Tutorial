import { HEIGHT, WIDTH, colors, fonts } from '@constants/vars';
import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../Theme';
import { isAndroid } from '@src/utils';
import DeviceInfo from 'react-native-device-info';

const topPadding = isAndroid()
  ? DeviceInfo.hasNotch()
    ? HEIGHT * 0.065
    : HEIGHT * 0.035
  : HEIGHT <= 736
    ? HEIGHT * 0.035
    : 0;

const imageBackgroundHeight = HEIGHT * 0.2053 + topPadding;
const bottomHeader = HEIGHT * 0.0856;
const headerHeight = imageBackgroundHeight + bottomHeader;
const statitsticsHeight = HEIGHT * 0.124;

export const styles = StyleSheet.create({
  arrowImage: {
    marginTop: 5,
    width: 9,
    height: 5,
    marginLeft: 7,
    tintColor: colors.WHITE,
  },
  headerPositionName: {
    marginTop: 8,
    color: colors.WHITE,
    width: 'auto',
    alignItems: 'center'
  },
  buildingText: {
    color: Theme.avatarHeader.textDropdown,
    fontFamily: fonts.MontserratLight,
    fontSize: 11
  },
  mainHeaderContainer: {
    alignItems: 'center',
    marginStart: 32,
    flex: 1
  },
  imageBackground: {
    height: imageBackgroundHeight,
    width: WIDTH,
  },

  leftImageStyle: {
    tintColor: Theme.avatarHeader.leftImageStyle
  },
  containerHeader: {
    backgroundColor: 'transparent',
    alignItems: 'flex-start'
  },
  title: {
    marginTop: 5,
    fontSize: 13,
    color: Theme.avatarHeader.title,
    fontFamily: fonts.MontserratMedium
  },
  des: {
    fontSize: 11,
    color: Theme.avatarHeader.des
  },
  logoEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 21,
    height: 21
  },
  rightText: {
    color: Theme.avatarHeader.rightText,
  }
});

export default styles;
