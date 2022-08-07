import { StyleSheet } from 'react-native';
import { colors, SPACING_DEFAULT, FONT_SIZE_DEFAULT, SPACING_SM } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: SPACING_DEFAULT,
    borderColor: colors.GRAY500,
    borderRadius: 8,
    height: 52,
    width: 260,
  },

  text: {
    fontSize: 14,
  },

  icon: {
    height: 20,
    width: 20,
  },

  textContent: {
    fontSize: FONT_SIZE_DEFAULT,
    marginRight: SPACING_SM,
  },

  disabledButton: {
    opacity: 0.5,
  },
});

export default styles;
