import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../constants/colors';
import { SPACING } from '../../constants/size';
import { scale } from '../../utils/responsive';

const styles = StyleSheet.create({
  marginBottom0: {
    marginBottom: 0
  },
  alignItemsCenter: {
    alignItems: 'center'
  },
  container: {
    paddingVertical: scale(16),
    borderBottomColor: CUSTOM_COLOR.GreyDivider,
    borderBottomWidth: scale(1)
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(14)
  },
  infoNameAndPhone: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: scale(48),
    height: scale(48),
    marginRight: scale(16)
  },
  detail: {},
  detailWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailWrapperRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  detailPhone: {
    flexDirection: 'row'
  },
  detailName: {
    fontSize: FONT_SIZE.BodyText,
    fontWeight: '600',
    lineHeight: LINE_HEIGHT.BodyText,
    marginRight: SPACING.Small
  },
  detailStar: {
    width: scale(13),
    height: scale(12)
  },
  detailPhoneText: {
    fontWeight: '400',
    fontSize: FONT_SIZE.SubHead,
    color: TEXT_COLOR.ShuttleGray,
    marginLeft: scale(9)
  },
  infoChatButtonIcon: {
    width: scale(20),
    height: scale(20)
  },
  infoAddress: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  infoAddressText: {
    fontSize: FONT_SIZE.SubHead,
    fontWeight: '400',
    lineHeight: LINE_HEIGHT.SubHead,
    color: TEXT_COLOR.ShuttleGray,
    marginLeft: scale(8)
  },
  buttonsConfirm: {
    flexDirection: 'row',
    marginTop: scale(5),
    justifyContent: 'flex-end'
  },
  button: {
    width: scale(95),
    height: scale(32)
  },
  accept: {
    marginRight: scale(8)
  },
  reject: {
    // backgroundColor: BACKGROUND_COLOR.LightPink
  },
  bornDateText: {
    fontWeight: '500',
    fontSize: FONT_SIZE.Small,
    color: TEXT_COLOR.ShuttleGray
  }
});

export default styles;
