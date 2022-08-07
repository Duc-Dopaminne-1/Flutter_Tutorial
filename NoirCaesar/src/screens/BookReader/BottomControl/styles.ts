import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  bottomControl: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomIcon: {
    width: 14,
    height: 14,
  },
  bottomMidIcon: {
    width: 21,
    height: 16,
  },
  bottomTextOn: {
    fontFamily: fonts.AvenirLTStdRoman,
    fontSize: 12,
    color: '#FFFFFF',
  },
  bottomTextOff: {
    fontFamily: fonts.AvenirLTStdRoman,
    fontSize: 12,
    color: '#676877',
  },
});

export default styles;
