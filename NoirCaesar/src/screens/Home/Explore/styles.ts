import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
  },

  containerBody: {
    flex: 1,
  },

  search: {
    borderRadius: 35 / 2,
    height: 35,
  },

  containerSearch: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    backgroundColor: colors.SECONDARY,
    paddingBottom: 12,
  },

  searchBound: {
    flexWrap: 'wrap',
  },

  flatlist: {
    paddingHorizontal: 15,
  },
});

export default styles;
