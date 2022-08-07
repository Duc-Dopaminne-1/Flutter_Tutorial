import { StyleSheet } from 'react-native';
import { fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  image: {
    width: 65,
    height: 93,
  },

  ourMission: {
    fontSize: 21,
    marginTop: 30,
  },

  webView: {
    flex: 1,
    margin: 20,
    marginTop: 0,
    fontSize: 12,
    fontFamily: fonts.AvenirLTStdRoman,
  },
});

export default styles;
