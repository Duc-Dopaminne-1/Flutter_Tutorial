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
  headerContainer: {
    width: WIDTH,
    height: headerHeight,
  },
  containerHeader: {
    flex: 1,
    width: 'auto',
    height: 'auto'
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
  statisticsButtonsContainer: {
    height: statitsticsHeight,
    width: WIDTH,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: statitsticsHeight / 3
  },
  statisticsButtonLeft: {
    height: statitsticsHeight,
    marginRight: 15
  },
  statisticsButtonRight: {
    height: statitsticsHeight,
    marginLeft: 15
  },
  mainHeaderContainer: {
    alignItems: 'center',
    marginStart: 32,
  },
  buildingText: {
    color: Theme.home.titleTextColor,
    fontFamily: fonts.MontserratMedium,
    fontSize: 13
  },
  dropdownContainer: {
    width: 'auto',
    alignItems: 'center'
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
