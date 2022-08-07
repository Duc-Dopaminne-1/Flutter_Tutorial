import { StyleSheet } from 'react-native';
import { WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    width: (WIDTH - 45) / 2,
    flexDirection: 'row',
    height: 72,
    marginHorizontal: 6,
    borderRadius: 6,
    borderColor: '#676877',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  subscriptionDot: {
    width: 13,
    height: 13,
    marginRight: 10,
  },

  subscriptionText: {
    fontSize: 13,
  },
});

export default styles;
