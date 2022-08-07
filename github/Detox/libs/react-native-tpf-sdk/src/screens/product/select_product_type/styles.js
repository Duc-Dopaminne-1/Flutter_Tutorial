import { FONT_FAMILY } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/responsive';

const styles = StyleSheet.create({
  createContactProfileWrapper: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.White
  },
  header: {
    paddingVertical: SPACING.Large,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardWrapper: {
    marginHorizontal: SPACING.Medium,
    borderWidth: 2,
    flexDirection: 'row',
    height: scale(80),
    marginBottom: SPACING.Medium,
    borderColor: CUSTOM_COLOR.GreyDivider,
    borderRadius: BORDER_RADIUS
  },
  cardLeft: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardRight: {
    width: '65%',
    height: '100%',
    justifyContent: 'center'
  },
  checkRadio: {
    justifyContent: 'center'
  },
  cardImage: {
    position: 'absolute',
    right: 0,
    width: scale(113),
    height: '100%'
  }
});

export default styles;
