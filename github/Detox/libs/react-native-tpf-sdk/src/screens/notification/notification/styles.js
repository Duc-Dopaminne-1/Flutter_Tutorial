import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR, BACKGROUND_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';
import { Shadow } from '../../../constants/stylesCSS';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CUSTOM_COLOR.White
  },
  wrapper: {
    flex: 1
  },
  body: {
    flex: 1
  },
  textHead: {
    color: TEXT_COLOR.PersianGreen
  },
  head: {
    padding: SPACING.Medium,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  textTitleSupport: {
    marginHorizontal: SPACING.Small,
    color: TEXT_COLOR.Primary
  },
  removeBtn: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: TEXT_COLOR.Black
  },
  btnRemove: {
    alignItems: 'flex-end',
    paddingRight: SPACING.XMedium
  },
  tabContainer: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: scale(44)
  },
  tab: {
    borderBottomWidth: SPACING.Tiny,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: CUSTOM_COLOR.PersianGreen
  },
  markRead: {
    textAlign: 'right',
    marginRight: SPACING.Medium,
    marginTop: SPACING.Large
  },
  removeAll: {
    marginRight: SPACING.XNormal
  },
  removeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: SPACING.Large
  },
  checkBoxContainer: {
    marginRight: SPACING.Normal
  },
  btnContainer: {
    marginHorizontal: scale(16)
  },
  contentListContainer: {
    margin: SPACING.Normal
  },
  divider: {
    marginHorizontal: SPACING.Normal
  }
});
