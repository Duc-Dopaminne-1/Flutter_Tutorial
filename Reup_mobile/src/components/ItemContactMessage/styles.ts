import * as vars from '@constants/vars';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: vars.colors.GREEN,
    backgroundColor: vars.colors.GREEN,
    padding: 3,
    borderWidth: 1,
  },

  iconStyle: {
    marginRight: 5,
  },
  iconStyleDelete: {
    marginLeft: 7,
  },
  textStyleChecked: {
    fontSize: 12,
    marginLeft: 5,
    // Color: vars.colors.baseColor,
  },

  imagePlus: {
    marginLeft: 5,
    borderRadius: 100 / 2,
    borderWidth: 1,
    borderColor: vars.colors.GREEN,
    backgroundColor: vars.colors.GREEN,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  containerImage: {
    width: 5,
    height: 5,
  },
});
