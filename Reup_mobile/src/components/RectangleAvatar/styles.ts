import { StyleSheet } from 'react-native';
import * as vars from '@constants/vars';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: vars.colors.AVATAR_DEFAULT,
  },
  thumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderThumb: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'gray',
  },
  spinnerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
