import { StyleSheet } from 'react-native';
import { scale } from '../../utils/responsive';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../constants/colors';
import { MULTIE_BORDER_RADIUS, SPACING } from '../../constants/size';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center'
  },
  titleWrapper: {
    width: '100%',
    height: scale(40, false)
  },
  formTitle: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  selectBankWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.XXNormal
  },
  input: {
    width: '100%'
    // marginVertical: SPACING.Fit
  },
  modalWrapper: {
    width: scale(284),
    alignSelf: 'center',
    height: scale(400, false),
    backgroundColor: CUSTOM_COLOR.White,
    borderRadius: MULTIE_BORDER_RADIUS.MEDIUM
  },
  modalTitle: {
    height: '10%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: CUSTOM_COLOR.ShuttleGray
  },
  modalContent: {
    height: '70%',
    width: '100%',
    alignItems: 'center'
  },
  modalControl: {
    height: '20%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  cancelBtn: {
    width: scale(121),
    height: scale(52, false),
    backgroundColor: 'rgba(240, 140, 49, 0.25)',
    borderRadius: MULTIE_BORDER_RADIUS.SMALL
  },
  submitBtn: {
    width: scale(121),
    height: scale(52, false),
    borderRadius: MULTIE_BORDER_RADIUS.SMALL,
    backgroundColor: CUSTOM_COLOR.Orange
  },
  modalText: {
    textAlign: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  list: {
    width: '100%',
    height: '100%',
    paddingHorizontal: SPACING.XSmall
  },
  item: {
    paddingVertical: SPACING.Normal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  checkIcon: {},
  displayName: {
    width: '90%',
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenPea
  },
  noData: {
    textAlign: 'center',
    alignSelf: 'center',
    color: TEXT_COLOR.Gray,
    fontSize: FONT_SIZE.BodyText,
    marginTop: SPACING.Fit,
    lineHeight: LINE_HEIGHT.BodyText
  }
});

export default styles;
