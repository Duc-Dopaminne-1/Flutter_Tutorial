import { StyleSheet } from 'react-native';
import { colors, SPACING_SS, SPACING_SM, RADIUS_LG, SPACING_DEFAULT, WIDTH, FONT_WEIGHT_REGULAR, fonts } from '@constants/vars';

import { moderateScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 5,
    width: WIDTH,
  },
  contentWrap: {
    maxWidth: '70%',
  },
  leftContentWrap: {
    marginLeft: -10, flexDirection: 'row'
  },
  rightContentWrap: {
    alignSelf: 'flex-end'
  },
  content: {
    borderTopLeftRadius: RADIUS_LG,
    borderTopRightRadius: RADIUS_LG,
    padding: SPACING_DEFAULT,
    paddingBottom: SPACING_SM,
  },
  contentRadius: {
    borderRadius: RADIUS_LG,
    padding: SPACING_DEFAULT,
    paddingBottom: SPACING_SM,
  },
  myContentLeft: {
    backgroundColor: colors.MESSAGE_FORM,
    borderBottomRightRadius: RADIUS_LG,
  },
  myContentRight: {
    // backgroundColor: colors.RECTANGLE_GRAY,
    borderBottomLeftRadius: RADIUS_LG,
  },
  text: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center',
    padding: 8,
  },
  time: {
    textAlign: 'right',
    fontSize: 7,
    color: colors.GRAY600,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  myTime: {
    textAlign: 'right',
    color: colors.WHITE,
    fontSize: 7,
    fontWeight: FONT_WEIGHT_REGULAR,
  },
  textcontent: {
    textDecorationColor: colors.BLACK,
  },
  containerImage: {
    justifyContent: 'flex-end',
  },
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
  status: {
    color: '#676877',
    fontSize: 10,
    width: '100%',
    alignSelf: 'flex-end',
  },
  date: {
    color: '#676877',
    fontSize: 10,
    marginRight: 25,
    marginBottom: 5
  },
  systemMessage: {
    color: '#676877',
    marginRight: 25,
    fontSize: 10,
    textAlign: "center"
  },
  firstControl: {
    height: 49,
    aspectRatio: 1,
  },
  mainIcon: {
    width: 200,
    height: 55,
  },
  mainIconAnimated: {
    width: 200,
    top: 0,
    position: 'absolute',
    overflow: 'hidden',
  },
  mainIconRed: {
    width: 200,
    height: 55,
  },
  displayName: {
    alignSelf: "flex-start",
    fontFamily: fonts.AvenirLTStdRoman,
    fontSize: 10, color: "#676877",
    marginVertical: moderateScale(7, 2),
  },
  avatar: {
    height: 38, width: 38,
    borderRadius: 38 / 2,
    resizeMode: 'cover',
    backgroundColor: '#393F4E',
    alignSelf: 'flex-end',
    marginRight: 8
  },
  avatarText: {
    color: colors.WHITE,
    fontSize: 12,
  },
});

export default styles;
