import { WIDTH, colors, fonts, HEIGHT } from '@constants/vars';
import { StyleSheet } from 'react-native';

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

  rightTextHeader: {
    height: 30,
    backgroundColor: 'red',
    paddingHorizontal: 10,
    borderRadius: 15,
    justifyContent: 'center',
  },

  darkLayout: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: WIDTH * 0.8,
    backgroundColor: 'black',
    opacity: 0.3,
  },

  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: WIDTH * 0.8
  },

  cover: {
    position: 'absolute',
    backgroundColor: colors.GRAY_COLOR,
    top: 0,
    left: 0
  },

  avatar: {
    width: 94,
    borderWidth: 4.5,
    borderColor: 'red',
    aspectRatio: 1,
    borderRadius: 47,
    backgroundColor: colors.GRAY_COLOR
  },

  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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

  containerTab: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: colors.SECONDARY,
    paddingTop: 10,
    marginBottom: 52,
  },

  tabContainer: {
    backgroundColor: 'transparent',
  },

  tab: {
    backgroundColor: 'transparent',
    padding: 0,
    width: 'auto',
    marginHorizontal: 15,
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

  uploadButton: {
    width: '100%',
    justifyContent: 'center',
    height: 52,
    borderRadius: 0,
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
