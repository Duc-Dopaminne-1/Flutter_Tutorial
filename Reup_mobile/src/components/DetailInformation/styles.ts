import { StyleSheet } from 'react-native';
import { fonts, colors, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  subContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },

  title: {
    fontSize: 10,
    color: '#676877',
    width: 60,
    marginRight: 17,
  },

  detail: {
    width: WIDTH - 107,
    fontSize: 10,
    color: '#676877',
  },
});

export default styles;
