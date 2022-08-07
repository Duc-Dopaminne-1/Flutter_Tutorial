import { FONT_FAMILY } from '../../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CUSTOM_COLOR.White
  },

  body: {
    paddingHorizontal: SPACING.Medium,
    marginBottom: scale(80, false)
  },

  textCallSupport: {
    color: TEXT_COLOR.GreenLight,
    textAlign: 'center'
  },
  groupCallSupport: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.Medium
  }
});
