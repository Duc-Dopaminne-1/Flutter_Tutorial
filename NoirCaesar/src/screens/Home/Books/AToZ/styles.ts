import { StyleSheet } from 'react-native';
import { SPACING_DEFAULT, FONT_COLOR, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingStart: 15,
  },

  listContainer: {
    flex: 1,
  },

  scrollBarColor: {
    color: '#ffffff',
    fontFamily: fonts.AvenirLTStdRoman,
    fontSize: 10,
    marginBottom: 5,
  },

  sectionListStyle: {
    marginTop: 15,
    marginBottom: 10,
  },
});

export default styles;
