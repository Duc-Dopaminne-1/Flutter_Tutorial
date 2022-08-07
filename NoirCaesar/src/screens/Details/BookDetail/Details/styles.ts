import { StyleSheet } from 'react-native';
import { colors, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems: 'flex-start',
  },

  content: {
    fontSize: 10,
  },

  contentDes: {
    fontSize: 10,
    color: colors.WHITE,
    fontFamily: fonts.AvenirLTStdRoman,
  },
});

export default styles;
