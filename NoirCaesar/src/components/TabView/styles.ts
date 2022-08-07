import { StyleSheet } from 'react-native';
import { WIDTH, fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.SECONDARY,
  },

  tab: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: colors.DARK_GREY,
  },

  borderBottom: {
    marginTop: 15,
  },

  activeBorderBottom: {
    marginTop: 5,
    borderColor: '#FF0000',
    borderBottomWidth: 3,
    borderRadius: 1.5,
  },

  tabBarText: {
    fontSize: 12,
  },

  activeTabBarText: {
    opacity: 1,
    fontSize: 12,
  },
});

export default styles;
