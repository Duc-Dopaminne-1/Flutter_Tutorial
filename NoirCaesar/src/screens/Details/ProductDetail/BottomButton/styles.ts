import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  bottomButtonView: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 0,
  },
  bottomButtonText: {
    fontSize: 14,
    fontFamily: fonts.AvenirLTStdRoman,
  },
});

export default styles;
