import { scale } from '../../../utils/responsive';
import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { Shadow } from '../../../constants/stylesCSS';

export const styles = StyleSheet.create({
  textNaviRight: {
    color: TEXT_COLOR.Primary
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CUSTOM_COLOR.White
  },
  wrapper: {
    paddingTop: SPACING.Medium,
    paddingBottom: SPACING.HasBottomButton
  },
  title: {
    paddingTop: scale(12),
    paddingBottom: scale(8),
    color: TEXT_COLOR.Primary,
    fontSize: FONT_SIZE.BodyText
  },
  groupCallSupport: {
    paddingVertical: SPACING.Medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textCallSupport: {
    color: TEXT_COLOR.PersianGreen
  },
  row: {},
  bwSpace: {
    justifyContent: 'space-between'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textTitle: {
    fontSize: FONT_SIZE.Heading
  },
  viewState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.Medium,
    borderRadius: BORDER_RADIUS
  },
  textState: {
    color: CUSTOM_COLOR.White
  },
  viewAction: {
    borderRadius: BORDER_RADIUS,
    backgroundColor: '#F7F8FB',
    padding: scale(18),
    margin: scale(2)
  },
  itemTab: {
    alignItems: 'center',
    borderBottomColor: CUSTOM_COLOR.PersianGreen
  },
  itemTabText: { color: CUSTOM_COLOR.PersianGreen },

  headerContainer: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    marginHorizontal: SPACING.Medium,
    marginTop: SPACING.Large
  },
  topHeader: {
    paddingVertical: SPACING.XXNormal,
    paddingHorizontal: SPACING.Medium,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerText: { fontSize: FONT_SIZE.Heading },
  bottomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.XXNormal,
    alignItems: 'center',
    paddingHorizontal: SPACING.Medium
  },
  bottomHeaderText: { fontSize: FONT_SIZE.SubHead },
  iconArea: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-around'
  },
  floatFooterStyle: {
    ...Shadow,
    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  request: {},
  rowBtnView: {
    flexDirection: 'row'
  },
  cancelBtn: { flex: 1, marginRight: scale(15) },
  heading: { flex: 1, paddingRight: 4 }
});
