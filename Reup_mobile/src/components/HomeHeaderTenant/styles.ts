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

export const styles = StyleSheet.create({
  headerContainer: {
    width: WIDTH,
    height: headerHeight,
  },
  containerHeader: {
    flex: 1,
    width: 'auto',
    height: 'auto',

  },
  imageBackground: {
    flex: 1,
    height: imageBackgroundHeight,
  },
  headerContent: {
    height: imageBackgroundHeight,
    alignItems: 'flex-start',
    backgroundColor: Theme.home.headerBackground,
  },
  marginDropdown: {
    marginTop: 10
  },
  infoContainer: {
    marginTop: HEIGHT < 640 ? 4 : 10,
    marginLeft: 32,
  },
  name: {
    color: "#333333",
    fontSize: 13,
    fontFamily: fonts.MontserratMedium
  },
  address: {
    fontSize: 11,
    color: "#707070",
    fontFamily: fonts.MontserratLight,
  },
  addressContainer: {
    marginTop: 4
  },

  mainHeaderContainer: {
    alignItems: 'center',
    marginStart: 32,
  },
  avatarContainer: {
    marginStart: 32,
    marginTop: HEIGHT < 640 ? 6 : 32,
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderColor: 'white',
    borderWidth: 2,
  },

  arrowImage: {
    marginTop: 5,
    width: 9,
    height: 5,
    marginLeft: 7,
    tintColor: Theme.home.titleTextColor,
  },
  rightImageStyle: {
    marginTop: 10,
    tintColor: Theme.home.titleTextColor,
  },
});

export default styles;
