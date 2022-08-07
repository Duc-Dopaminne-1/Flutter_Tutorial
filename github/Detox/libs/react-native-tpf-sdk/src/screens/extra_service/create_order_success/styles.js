import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  successWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: scale(53, false),
    backgroundColor: BACKGROUND_COLOR.White
  },
  successText: {
    alignSelf: 'center',
    marginTop: SPACING.Medium,
    textAlign: 'center'
  },
  expandView: {
    marginHorizontal: SPACING.Small,
    marginVertical: SPACING.Normal
  },
  showdetail: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginRight: SPACING.Small
  },
  showdetailWrapper: {
    paddingTop: SPACING.Medium,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconRight: {
    right: scale(14)
  }
});

export default styles;
