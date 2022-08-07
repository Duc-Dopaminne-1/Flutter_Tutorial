import { FONT_FAMILY, FONT_SIZE } from '../../../../constants/appFonts';
import { TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.Medium
  },
  row: { flexDirection: 'row', paddingVertical: SPACING.XMedium },
  checkBox: { marginLeft: SPACING.Fit },

  discount: { color: TEXT_COLOR.PrimaryDisable, fontSize: FONT_SIZE.SubHead },
  labelPrice: { fontSize: FONT_SIZE.SubHead }
});
