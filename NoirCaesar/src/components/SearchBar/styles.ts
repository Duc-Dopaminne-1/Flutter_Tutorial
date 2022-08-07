import * as vars from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: vars.SPACING_DEFAULT,
    paddingVertical: vars.SPACING_SM,
    minHeight: 50,
    backgroundColor: vars.colors.WHITE,
  },
  searchContainer: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 40,
    paddingLeft: 10,
    paddingRight: 5,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: vars.colors.LIGHT_GREY,
  },
  searchIcon: {
    marginLeft: 20,
    width: 14,
    height: 14,
  },
  to: {
    color: vars.colors.DARK_GREY,
    fontSize: vars.FONT_SIZE_DEFAULT,
  },
  searchInput: {
    flex: 1,
    fontSize: vars.FONT_SIZE_DEFAULT,
    marginLeft: 7,
    textAlignVertical: 'top',
    minHeight: 36,
    paddingRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
});

export default styles;
