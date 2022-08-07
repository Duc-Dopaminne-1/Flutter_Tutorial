import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { BORDER_RADIUS, DEVICE_WIDTH, SPACING } from '../../../../constants/size';
import { Shadow } from '../../../../constants/stylesCSS';
import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  title: {
    fontSize: FONT_SIZE.Heading,
    color: CUSTOM_COLOR.BlueStone,
    lineHeight: LINE_HEIGHT.Heading,
    marginBottom: SPACING.Medium
  },
  rowContent: {
    paddingBottom: SPACING.Medium
  },
  text: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },

  lastContent: {
    paddingBottom: 0
  },
  btnView: {
    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: DEVICE_WIDTH,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    elevation: 5
  },
  cancelBtn: {
    flex: 1,
    marginRight: scale(15)
  },
  confirmBtn: {
    flex: 1
  },
  scrollView: {
    paddingTop: SPACING.Large
  },
  item: {
    marginBottom: SPACING.Medium,
    padding: SPACING.Medium,
    backgroundColor: CUSTOM_COLOR.White,
    borderRadius: BORDER_RADIUS,
    ...Shadow,
    marginHorizontal: SPACING.Medium
  }
});
