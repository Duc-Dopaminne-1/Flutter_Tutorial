import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.searchBar.background,
  },
  searchContainer: {
    height: 30,
    width: '100%',
    borderColor: Theme.searchBar.border,
    borderWidth: 1,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    paddingLeft: 14,
  },
  searchText: {
    flex: 1,
    paddingRight: 15,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
  },
  searchIcon: {
    height: 18,
    aspectRatio: 1,
  },
});

export default styles;
