import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  groupType: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flexDirection: 'row',
    paddingTop: scale(28),
    paddingBottom: scale(16),
    justifyContent: 'space-evenly'
  },
  typeContainer: {
    alignItems: 'center',
    marginRight: scale(10),
    width: scale(110)
  },
  textTitle: {
    fontSize: FONT_SIZE.Small,
    marginTop: scale(8)
  },
  textTitleActive: {
    fontSize: FONT_SIZE.Small,
    marginTop: scale(8)
  },
  scrollContainer: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    shadowColor: CUSTOM_COLOR.ShuttleGray,
    shadowOffset: {
      width: 0,
      height: scale(2)
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62
  },
  emptyListContainer: {
    // paddingTop: Dimensions.window.height / 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyImg: {
    // width: Dimensions.window.width - scale(140),
    // height: ((Dimensions.window.width - scale(140)) * 180) / 230
  },
  emptyTitle: {
    marginTop: scale(20),
    fontSize: FONT_SIZE.SubHead
  },
  statusContainer: {
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Large,
    justifyContent: 'space-between'
  },
  label: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: TEXT_COLOR.Inactive
  },
  icon: {
    width: scale(56),
    height: scale(56)
  },
  listWrapper: {
    paddingBottom: SPACING.HasBottomButton
  }
});
