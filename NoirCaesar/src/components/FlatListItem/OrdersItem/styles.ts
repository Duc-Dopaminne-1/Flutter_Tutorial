import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 6,
  },

  textContainer: {
    flex: 1,
    marginLeft: 18,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },

  image: {
    width: 60,
    height: 85,
  },

  title: {
    fontSize: 14,
  },

  status: {
    fontSize: 16,
    color: colors.RED_COLOR,
  },

  date: {
    fontSize: 14,
    color: '#676877',
  },
});

export default styles;
