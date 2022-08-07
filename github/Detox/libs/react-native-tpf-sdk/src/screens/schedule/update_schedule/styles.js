import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CUSTOM_COLOR.White
  },
  wrapper: {
    paddingBottom: SPACING.Medium * 6
  },
  body: {
    padding: SPACING.Medium
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  col: {
    flex: 1
  },
  box: {
    backgroundColor: CUSTOM_COLOR.White,
    paddingStart: scale(12),
    paddingEnd: scale(12),
    paddingTop: scale(8),
    paddingBottom: scale(16),
    borderRadius: scale(8)
  },
  title: {
    marginTop: scale(12),
    marginBottom: scale(12),
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  textTitle: {
    marginTop: scale(16),
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  textValue: {
    flex: 1,
    marginTop: scale(16)
  },
  iconDropdown: {
    position: 'absolute',
    bottom: scale(0),
    right: scale(0),
    padding: scale(10)
  },
  btnBottomContinue: {
    marginTop: scale(16),
    height: scale(40),
    borderRadius: scale(60)
  },
  bottomBtn: {
    backgroundColor: BACKGROUND_COLOR.White,
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Medium,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  groupInput: {
    flexDirection: 'row'
  },
  selectBox: {
    height: scale(20, false),
    width: scale(20),
    borderRadius: scale(20),
    borderWidth: scale(2),
    borderColor: CUSTOM_COLOR.OsloGray,
    marginRight: SPACING.Medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdownItem: {
    paddingHorizontal: SPACING.Medium
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(14)
  },
  dropdownItemTxt: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenBold
  },
  selectedBox: {
    borderColor: CUSTOM_COLOR.PersianGreen
  },
  iconTick: {
    height: scale(10, false),
    width: scale(10),
    backgroundColor: CUSTOM_COLOR.PersianGreen,
    borderRadius: scale(10)
  },
  titleName: {
    color: CUSTOM_COLOR.BlueStone,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    paddingBottom: SPACING.Normal
  },
  contactName: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenBold
  }
});
