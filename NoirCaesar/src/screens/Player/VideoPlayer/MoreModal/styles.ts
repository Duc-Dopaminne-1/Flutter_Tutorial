import { StyleSheet } from 'react-native';
import { HEIGHT, fonts, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#292936',
    borderRadius: 10,
    height: 52 * 3 + 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },

  textTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fonts.AvenirLTStdRoman,
    marginStart: 30,
    marginEnd: 30,
    textAlign: 'center',
  },

  buttonClose: {
    marginTop: 30,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
    height: 60,
  },
  containerButton: {
    height: 52,
  },
  textButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontFamily: fonts.AvenirLTStdRoman,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default styles;
