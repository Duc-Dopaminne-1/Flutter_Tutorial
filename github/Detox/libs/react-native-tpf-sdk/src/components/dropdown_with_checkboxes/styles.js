import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../constants/colors';
import { MULTIE_BORDER_RADIUS, SPACING } from '../../constants/size';
import { scale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  modalWrapper: {
    width: '100%',
    height: scale(375, false),
    backgroundColor: CUSTOM_COLOR.White,
    borderRadius: MULTIE_BORDER_RADIUS.MEDIUM,
    paddingBottom: SPACING.XXNormal
  },
  modalTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    height: scale(56, false),
    justifyContent: 'space-between',
    borderBottomColor: CUSTOM_COLOR.GreyDivider
  },
  modalContent: {
    height: '75%',
    width: '100%',
    alignItems: 'center'
  },
  modalControl: {
    height: '15%',
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
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    height: scale(53, false),
    paddingVertical: SPACING.Normal,
    borderBottomColor: CUSTOM_COLOR.GreyDivider
  },
  checkIcon: {
    position: 'absolute',
    left: scale(2)
  },
  displayName: {
    textAlign: 'center',
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  noData: {
    textAlign: 'center',
    alignSelf: 'center',
    color: TEXT_COLOR.Gray,
    fontSize: FONT_SIZE.BodyText,
    marginTop: SPACING.Fit,
    lineHeight: LINE_HEIGHT.BodyText
  },
  left: {
    width: scale(60),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  right: {
    width: scale(80),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkBox: {
    width: scale(20),
    height: scale(20, false),
    borderWidth: scale(2),
    borderRadius: scale(4),
    borderColor: CUSTOM_COLOR.OsloGray,
    marginRight: SPACING.Medium
  },
  checkedBox: {
    backgroundColor: CUSTOM_COLOR.PersianGreen,
    borderColor: CUSTOM_COLOR.PersianGreen
  },
  textBtn: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  rightBtn: {
    paddingHorizontal: SPACING.Normal,
    marginRight: SPACING.Small
  }
});

export default styles;
