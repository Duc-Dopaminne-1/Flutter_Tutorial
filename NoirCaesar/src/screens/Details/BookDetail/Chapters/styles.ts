import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  containerImage: {
    flex: 4,
  },

  containerBack: {
    left: 15,
    top: 35,
    width: 22,
    height: 20,
    position: 'absolute',
  },

  logoBack: {
    flex: 1,
  },

  containerContent: {
    flex: 6,
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: colors.SECONDARY,
  },

  tabContainer: {
    width: '75%',
    backgroundColor: colors.SECONDARY,
  },

  tab: {
    backgroundColor: colors.SECONDARY,
    padding: 0,
  },

  indicator: {
    width: '100%',
    height: 3,
    backgroundColor: 'red',
  },

  containerTab: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
  },

  labelContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default styles;
