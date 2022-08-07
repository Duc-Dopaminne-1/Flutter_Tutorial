import { WIDTH, colors, fonts, HEIGHT } from '@constants/vars';
import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    zIndex: 1,
  },

  headerContainerDetail: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  rightButtonHeader: {
    width: 30,
    height: 30,
  },

  rightTextHeader: {
    height: 30,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 20,
    justifyContent: 'center',
  },

  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: WIDTH * 0.8,
  },
  avatar: {
    width: 94,
    borderWidth: 4.5,
    borderColor: 'red',
    aspectRatio: 1,
    borderRadius: 47,
  },
  followContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WIDTH * 0.4,
    bottom: 24,
  },
  followNumber: {
    fontSize: 24,
  },
  followTitle: {
    fontSize: 12,
  },
  userInfoContainer: {
    paddingTop: 12,
    paddingHorizontal: 15,
    backgroundColor: colors.SECONDARY,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    marginRight: 6,
  },
  labelContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  indicator: {
    width: '100%',
    height: 3,
    backgroundColor: 'red',
  },
  collapseHeader: {
    width: '100%',
    marginTop: -(HEIGHT * 0.12),
    zIndex: -1,
  },
  tabInActiveTextStyle: {
    fontFamily: fonts.AvenirLTStdRoman,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  tabActiveTextStyle: {
    fontFamily: fonts.AvenirLTStdRoman,
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
  },
});

export default styles;
