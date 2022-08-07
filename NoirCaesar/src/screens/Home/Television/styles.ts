import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  tabContainer: {
    backgroundColor: colors.SECONDARY,
  },

  tab: {
    backgroundColor: 'red',
  },

  indicator: {
    width: '100%',
    height: 3,
    backgroundColor: 'red',
  },

  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
