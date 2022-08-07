import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';
import { Shadow } from '../../../constants/stylesCSS';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {
    paddingTop: SPACING.Normal,
    paddingBottom: SPACING.HasBottomButton,
    paddingHorizontal: SPACING.Medium
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  itemTab: {
    flex: 0,
    marginHorizontal: scale(16),
    width: scale(100)
  },
  itemTextTab: {
    textAlign: 'center'
  },
  application_item: {
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Medium,
    backgroundColor: CUSTOM_COLOR.White,
    marginBottom: scale(85)
  },
  bottomBtn: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.White,
    paddingVertical: SPACING.Medium
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.Medium
  },
  headerRightText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  headerRightBtn: {
    width: scale(40),
    alignItems: 'center',
    marginRight: SPACING.Medium
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenBold
  },
  checkIcon: {
    position: 'absolute',
    top: scale(2)
  },
  checkBox: {
    width: scale(20),
    height: scale(20, false),
    borderWidth: scale(2),
    borderRadius: scale(4),
    borderColor: CUSTOM_COLOR.OsloGray
  },
  checkedBox: {
    backgroundColor: CUSTOM_COLOR.PersianGreen,
    borderColor: CUSTOM_COLOR.PersianGreen
  },
  selectAllView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectAllText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginRight: SPACING.XNormal
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Medium
  }
});
