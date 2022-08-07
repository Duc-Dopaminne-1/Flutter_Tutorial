import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary,
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Large
  },
  desc: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.ShuttleGray
  },
  textValue: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenBold
  },
  btnView: {
    position: 'absolute',
    bottom: scale(16),
    width: '100%',
    alignSelf: 'center'
  },
  btn: {
    flex: 1
  },
  cancelBtn: {
    marginTop: scale(8)
  }
});
