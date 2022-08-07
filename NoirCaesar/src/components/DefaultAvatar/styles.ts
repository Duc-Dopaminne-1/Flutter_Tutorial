import { FONT_WEIGHT_BOLD, SPACING_SS, colors } from '@src/constants/vars';
import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    padding: SPACING_SS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.GRAY600,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  iconContainer: {
    ...Platform.select({
      ios: {
        shadowColor: colors.GRAY700,
        shadowOffset: { height: 4, width: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
    position: 'absolute',
    zIndex: 100,
    bottom: -5,
    right: -5,
    backgroundColor: 'transparent',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
});
