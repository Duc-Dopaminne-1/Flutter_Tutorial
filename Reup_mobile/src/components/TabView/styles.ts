import { StyleSheet } from 'react-native';
import { WIDTH, fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tab: {
    height: 40,
    justifyContent: 'center',
    width: WIDTH / 2,
  },
  activeBorderBottom: {
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: '#1B72BF',
  },
  tabBarText: {
    fontSize: 13,
    color: '#333333',
    alignSelf: 'center',
    opacity: 1,
  },
  activeTabBarText: {
    opacity: 1,
    color: '#1B72BF',
  },
  itemHeight: {
    width: (WIDTH * 40) / 100,
  },
});

export default styles;
