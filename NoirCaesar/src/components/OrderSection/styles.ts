import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 25,
    backgroundColor: colors.SECONDARY,
  },

  paymentButton: {
    width: 80,
    height: '100%',
    backgroundColor: 'red',
    borderRadius: 15,
    justifyContent: 'center',
  },

  status: {
    color: 'red',
    marginLeft: 10,
  },
});

export default styles;
