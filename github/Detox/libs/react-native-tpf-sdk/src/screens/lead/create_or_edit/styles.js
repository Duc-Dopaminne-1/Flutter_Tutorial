import { StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/appFonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {
    // paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Medium,
    paddingBottom: SPACING.HasBottomButton
  },
  action: {
    ...Shadow,
    paddingVertical: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  headerContainer: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    marginHorizontal: SPACING.Medium,
    marginTop: SPACING.Large
  },
  topHeader: {
    paddingVertical: SPACING.XXNormal,
    paddingHorizontal: SPACING.Medium
  },
  headerText: {
    fontSize: FONT_SIZE.Heading
    // color: TEXT_COLOR.Primary
  },
  bottomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.XXNormal,
    alignItems: 'center',
    paddingHorizontal: SPACING.Medium
  },
  bottomHeaderText: {
    fontSize: FONT_SIZE.SubHead
    // color: TEXT_COLOR.Primary
  },
  groupCallSupport: {
    paddingVertical: SPACING.Medium,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textCallSupport: {
    color: TEXT_COLOR.PersianGreen
  },
  iconArea: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-around'
  },
  formContainer: {
    marginHorizontal: SPACING.Medium
  }
});
