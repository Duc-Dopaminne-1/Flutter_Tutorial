import { StyleSheet, Platform } from 'react-native';
import { colors, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    width: (WIDTH - 44) / 2,
    marginBottom: 15,
    marginHorizontal: 7,
    backgroundColor: colors.SECONDARY,
  },

  image: {
    height: 230,
    width: '100%',
  },

  title: {
    alignSelf: 'flex-start',
    marginHorizontal: 13,
    marginTop: 10,
    fontSize: 12,
  },

  price: {
    alignSelf: 'flex-start',
    color: '#FF0000',
    marginStart: 13,
    marginBottom: 7,
    marginTop: 5,
    fontSize: 12,
  },
});

export default styles;
