import { scale } from '../../../../utils/responsive';
import { StyleSheet } from 'react-native';
import { SPACING } from '../../../../constants/size';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';

const styles = StyleSheet.create({
  tabViewsWrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: scale(47, false),
    borderColor: CUSTOM_COLOR.Whisper,
    marginTop: SPACING.XLarge
  },
  tabItem: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(120)
  },
  tabTextActive: {
    color: TEXT_COLOR.ShuttleGray
  },
  tabText: {
    color: TEXT_COLOR.GreenLight,
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  lineActive: {
    bottom: 0,
    width: '80%',
    alignSelf: 'center',
    position: 'absolute',
    borderBottomWidth: 2
  }
});

export default styles;
