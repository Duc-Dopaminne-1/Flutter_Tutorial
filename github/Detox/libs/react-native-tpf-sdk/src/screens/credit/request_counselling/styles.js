import { scale } from '../../../utils/responsive';
import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { DEVICE_WIDTH, MULTIE_BORDER_RADIUS, SPACING } from '../../../constants/size';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  requestCounsellingWrapper: {
    flex: 1,
    backgroundColor: CUSTOM_COLOR.White,
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Medium
  },
  inputLabel: {
    color: TEXT_COLOR.GreenPea,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.PARAPRAPH
  },
  inputWrapper: {
    width: '100%',
    alignSelf: 'center',
    height: scale(36, false),
    borderRadius: scale(8, false),
    marginBottom: scale(24, false),
    backgroundColor: CUSTOM_COLOR.WildSand
  },
  input: {
    width: '100%',
    height: '100%',
    paddingHorizontal: scale(15),
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.PARAPRAPH
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: CUSTOM_COLOR.Envy
  },
  icon: {
    top: 0,
    height: '100%',
    right: scale(15),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelWrapper: {
    flexDirection: 'row',
    paddingRight: scale(5),
    justifyContent: 'space-between'
  },
  content: {
    width: '100%',
    paddingLeft: scale(15),
    textAlignVertical: 'top',
    height: scale(122, false),
    backgroundColor: CUSTOM_COLOR.WildSand,
    borderRadius: MULTIE_BORDER_RADIUS.NORMAL
  },
  control: {
    position: 'absolute',
    width: DEVICE_WIDTH,
    paddingHorizontal: scale(34),
    bottom: scale(80, false)
  },
  imageAttachmentWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(43, false),
    borderRadius: MULTIE_BORDER_RADIUS.NORMAL
  },
  iconBtn: {
    height: '100%',
    marginRight: scale(8),
    justifyContent: 'center'
  },
  submit: {
    marginTop: scale(16, false)
  },
  submitText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.PARAPRAPH
  }
});

export default styles;
