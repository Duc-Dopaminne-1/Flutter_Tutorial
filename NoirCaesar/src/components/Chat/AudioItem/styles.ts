import { StyleSheet } from 'react-native';

import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
  },
  itemIn: {
    marginLeft: 0,
    alignSelf: 'flex-start',
  },
  itemOut: {
    alignSelf: 'flex-end',
    marginRight: 25,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 20,
  },
  balloonRight: {
    backgroundColor: '#0F0F13',
    borderColor: '#676877',
    borderWidth: 1,
  },
  balloonLeft: {
    backgroundColor: '#676877',
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: -2,
    bottom: -2,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  arrowRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
    position: 'absolute',
    zIndex: -2,
  },
  firstControl: {
    height: 20,
    aspectRatio: 1,
  },
  mainIcon: {
    maxWidth: moderateScale(150, 2),
    width: 150,
    height: 55,
  },
  mainIconAnimated: {
    maxWidth: moderateScale(150, 2),
    width: 150,
    top: 0,
    left: 0,
    position: 'absolute',
    overflow: 'hidden',
  },
  mainIconRed: {
    maxWidth: moderateScale(150, 2),
    width: 150,
    height: 55,
  },
});

export default styles;
