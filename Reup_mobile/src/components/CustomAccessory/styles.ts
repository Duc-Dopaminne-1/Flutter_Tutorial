import { StyleSheet } from 'react-native';
import { fonts } from '@constants/vars';
import { WIDTH } from '@src/constants/vars';
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTH,
  },
  iconArrowStyles: {
    width: 20,
    height: 10,
    margin: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  titleTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hitSlop: {
    top: 4,
    right: 4,
    bottom: 4,
    left: 4,
  },
  titleTextStyle: {
    color: '#979797',
    fontFamily: fonts.MontserratRegular,
    fontSize: 15,
  },
  done: {
    lineHeight: 20,
    fontFamily: fonts.MontserratRegular,
    fontSize: 15,
    textAlign: 'right',
    color: '#007AFF',
    width: 50,
  },
});

export default styles;
