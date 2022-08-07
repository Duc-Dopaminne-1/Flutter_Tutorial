import { StyleSheet } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/size';
import { scale } from '../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: SPACING.XMedium,
    paddingBottom: SPACING.BottomButton,
    paddingHorizontal: SPACING.Medium,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'space-between',
    height: '100%'
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: scale(30)
  },
  congratulationTitle: {
    fontSize: FONT_SIZE.Title3,
    color: TEXT_COLOR.Primary,
    paddingTop: 2 * SPACING.XMedium,
    paddingBottom: SPACING.XXNormal,
    lineHeight: LINE_HEIGHT.Title3
  },
  descriptionText: {
    fontSize: FONT_SIZE.BodyText,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.BodyText
  },
  titleText: {
    fontSize: FONT_SIZE.Title3,
    marginBottom: SPACING.XXNormal,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.Title3
  },
  actionContainer: {
    width: '100%'
  },
  whiteTitle: {
    color: TEXT_COLOR.Secondary
  },
  whiteButton: {
    backgroundColor: BACKGROUND_COLOR.Secondary
  }
});

export default styles;
