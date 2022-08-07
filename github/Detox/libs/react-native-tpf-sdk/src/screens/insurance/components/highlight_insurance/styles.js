import { scale } from '../../../../utils/responsive';
import { StyleSheet } from 'react-native';
import { DEVICE_WIDTH, SPACING } from '../../../../constants/size';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../../../constants/colors';

const styles = StyleSheet.create({
  highlightInsuranceWrapper: {
    width: '100%',
    height: scale(307, false)
  },
  carousel: {
    width: '100%',
    height: scale(154, false)
  },
  carouselItem: {
    width: '100%',
    height: scale(154, false)
  },
  carouselImage: {
    width: '100%',
    height: scale(154, false)
  },
  paginationStyle: {
    position: 'absolute',
    bottom: scale(20, false),
    height: scale(20, false),
    backgroundColor: 'transparent'
  },
  titleWrapper: {
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    paddingRight: scale(16),
    height: scale(32, false),
    justifyContent: 'space-between'
  },
  otherProductsTitle: {
    color: TEXT_COLOR.ShuttleGray,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.HEADER,
    marginBottom: scale(10, false)
  },
  showAllBtn: {
    width: scale(120),
    backgroundColor: CUSTOM_COLOR.White,
    justifyContent: 'flex-start'
  },
  showAllText: {
    fontSize: FONT_SIZE.Heading,
    marginRight: SPACING.XSmall
  }
});

export default styles;
