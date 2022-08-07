import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';
import { fonts } from '@src/constants/vars';

const STYLESHEET_ID = 'stylesheet.agenda.list';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return  StyleSheet.create({
    container: {
      flexDirection: 'row'
    },
    dayNum: {
      fontSize: 18,
      fontFamily: fonts.MontserratLight,
      color: "#1B72BF"
    },
    dayText: {
      fontSize: 11,
      fontFamily: fonts.MontserratLight,
      color: "#707070"
    },
    day: {
      marginLeft: 23,
      width: 30,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
