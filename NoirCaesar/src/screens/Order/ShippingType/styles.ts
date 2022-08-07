import { WIDTH } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  scrollview: {
    paddingTop: 15,
  },

  containerFormik: {
    paddingHorizontal: 20,
    flex: 1,
  },

  inputStyle: {
    marginBottom: 20,
  },

  button: {
    position: 'absolute',
    width: WIDTH * 0.8,
    bottom: 40,
  },
});

export default styles;
