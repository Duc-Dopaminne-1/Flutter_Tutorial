import { StyleSheet } from 'react-native';
import { colors, FONT_WEIGHT_BOLD, FONT_SIZE_H4 } from '@constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  scrollView: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 30,
    paddingTop: 15,
  },

  name: {
    marginTop: 10,
    color: colors.WHITE,
    fontSize: FONT_SIZE_H4,
    fontWeight: FONT_WEIGHT_BOLD,
  },

  containerList: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textItem: {
    fontSize: 16,
    color: '#9A9BAD',
  },
});

export default styles;
