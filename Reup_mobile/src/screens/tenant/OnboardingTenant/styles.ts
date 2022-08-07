import {
  StyleSheet
} from 'react-native';
import { fonts } from "@src/constants/vars";
// styles
const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  viewLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textSlogan: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: 'white',
    marginTop: 9
  },
  wrapper: {},
  slide: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  viewTitle: {
    flex: 1,
    alignItems: 'center',
    marginTop: 37
  },
  title: {
    fontSize: 13,
    fontFamily: fonts.MontserratSemiBold,
    color: 'white',
    textAlign: 'center'
  },
  text: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: 'white',
    marginLeft: 22,
    marginRight: 21,
    marginTop: 13,
    textAlign: 'center',
    lineHeight: 18
  },
  viewBottom: {
    position: 'absolute',
    bottom: 10, width: '100%',
    height: 45
  },
  viewBottomChildren: {
    position: 'relative', flex: 1, flexDirection: 'row'
  },
  viewSpace: {
    flex: 1
  },
  skip: {
    backgroundColor: 'transparent',
    width: 100,
  },
  skipText: {
    fontFamily: fonts.MontserratRegular,
    color: '#ffffff'
  }
});

export default styles;
