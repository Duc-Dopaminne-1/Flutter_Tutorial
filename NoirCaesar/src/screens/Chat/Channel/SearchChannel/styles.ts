import { StyleSheet } from 'react-native';
import { WIDTH, HEIGHT } from '@src/constants/vars';

const styles = StyleSheet.create({
  search: {
    borderRadius: 0,
    height: 55,
    backgroundColor: 'transparent',
  },
  containerSearch: {
    width: WIDTH,
    height: 55,
    flexDirection: 'row',
    backgroundColor: '#676877',
    paddingStart: 15,
  },
  containerStyle: {
    paddingHorizontal: 8,
  },
  iconNoItem: {
    width: 13,
    height: 13,
    alignSelf: 'center',
  },
});

export default styles;
