import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15,
    height: 114,
    marginHorizontal: 6,
  },

  textContainer: {
    flex: 1,
    marginLeft: 18,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  image: {
    height: '100%',
    aspectRatio: 1.3,
  },

  title: {
    fontSize: 12,
    marginBottom: 15,
  },

  date: {
    fontSize: 10,
    marginBottom: 6,
    color: colors.TEXT_PLACEHOLDER,
  },
});

export default styles;
