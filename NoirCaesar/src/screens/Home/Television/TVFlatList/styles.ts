import { StyleSheet } from 'react-native';
import { SPACING_DEFAULT, FONT_COLOR } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatList: {
    paddingHorizontal: 9,
  },

  headerFlatList: {
    marginBottom: 15,
    marginHorizontal: -9,
  },

  noData: {
    textAlign: 'center',
    padding: SPACING_DEFAULT,
    color: FONT_COLOR,
  },
});

export default styles;
