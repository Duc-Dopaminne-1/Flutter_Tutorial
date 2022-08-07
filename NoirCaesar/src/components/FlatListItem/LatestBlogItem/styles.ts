import { StyleSheet } from 'react-native';
import { WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 15,
  },

  image: {
    width: 315,
    height: 250,
  },

  contentContainer: {
    position: 'absolute',
    width: 315 - 15,
    left: 15,
    bottom: 15,
    alignItems: 'flex-start',
  },

  contentTitle: {
    fontSize: 18,
  },

  detail: {
    fontSize: 10,
    marginTop: 10,
  },
});

export default styles;
