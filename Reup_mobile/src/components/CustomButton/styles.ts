import { StyleSheet, Platform } from 'react-native';
import { WIDTH, colors, fonts, HEIGHT } from '@src/constants/vars';
import { Theme } from '../Theme';
const statitsticsHeight = HEIGHT * 0.124;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 20,
    borderRadius: 2,
    height: 40,
    width: '100%',
    backgroundColor: '#1FA207',
  },

  text: {
    fontSize: 13,
    color: 'white',
    fontFamily: fonts.MontserratLight,
  },

  iconLeft: {
    height: 15,
    width: 15,
    marginRight: 8,
  },
  iconRight: {
    height: 15,
    width: 15,
    marginLeft: 8,
  },

  textContent: {
    fontSize: 13,
  },

  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 66,
    backgroundColor: 'white',
    width: '100%',
  },
  statisticsContainer: {
    height: 84,
    width: (WIDTH - 40 - 40) / 2,
    backgroundColor: Theme.home.statisticsBackgroundColor,
    justifyContent: 'center',
    padding: 5,
  },
  statisticsContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statisticsText: {
    color: Theme.home.statisticsTextColor,
    fontSize: 11,
    fontFamily: fonts.MontserratMedium,
  },
  textMargin: {
    marginTop: 6,
  },
  roundButton: {
    borderRadius: statitsticsHeight / 2,
    borderColor: Theme.home.statisticsRoundColor,
    borderWidth: 1,
    width: statitsticsHeight / 2,
    height: statitsticsHeight / 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginTop: 6,
    alignItems: 'center',
  },
  roundNumberText: {
    fontSize: 11,
    fontFamily: fonts.MontserratMedium,
    color: Theme.home.statisticsTextColor,
  },

  // Social Button
  containerSocialButton: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  customTouchableSocialButton: {
    borderColor: '#000',
  },
  customTouchableFacebookButton: {
    borderRadius: 20,
    overflow: 'hidden',
    // effect only android
    elevation: 5,
  },
  linearGradientFacebookButton: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D41A3',
    backgroundColor: '#1D41A3',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  linearGradientGoogleButton: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#232323',
    backgroundColor: 'white',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  viewTextSocialButton: {
    justifyContent: 'center',
  },
  iconSocialButton: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  textFacebookButton: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: fonts.MontserratRegular,
  },
  textSocialButton: {
    color: '#232323',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: fonts.MontserratRegular,
  },
  lineSocialButton: {
    width: 1,
    height: '90%',
  },

  //Image Button
  containerImageBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageImageBtn: {
    height: 16,
    width: 16,
  },
});

export default styles;
