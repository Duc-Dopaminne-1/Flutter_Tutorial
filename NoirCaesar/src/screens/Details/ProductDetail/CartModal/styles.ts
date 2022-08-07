import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomButton: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: 0,
  },
  bottomButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: fonts.AvenirLTStdRoman,
  },
});

export default styles;
