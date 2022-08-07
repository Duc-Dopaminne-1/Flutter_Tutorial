import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../constants/appFonts';
import { CUSTOM_COLOR } from '../../constants/colors';
import { scale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  btnGroupButton: {
    flex: 1,
    borderBottomColor: CUSTOM_COLOR.Black,
    borderBottomWidth: scale(2),
    height: scale(48),
    justifyContent: 'center'
    // marginHorizontal: scale(8)
  }
});
