import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/size';
import { StyleSheet } from 'react-native';
import { scale } from '../../utils/responsive';

const styles = StyleSheet.create({
  createContactProfileWrapper: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.White
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: SPACING.Medium
  },
  header: {
    paddingBottom: SPACING.Normal,
    paddingTop: SPACING.Large
  },
  container: {
    marginBottom: SPACING.Medium
  },
  title: {
    lineHeight: scale(24),
    marginBottom: SPACING.Large
  },
  titleDesc: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: TEXT_COLOR.Black
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.Medium
  },
  content: {
    marginVertical: SPACING.XXLarge
  },
  serviceWrapper: {
    width: '33%',
    alignItems: 'center',
    marginBottom: SPACING.Normal
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 12
  },
  name: {
    lineHeight: 20,
    textAlign: 'center',
    marginTop: SPACING.Normal
  },
  serviceVericalWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.Medium
  },
  banner: {
    minHeight: scale(500)
  }
});

export default styles;
