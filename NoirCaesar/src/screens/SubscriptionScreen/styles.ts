import { StyleSheet } from 'react-native';
import { WIDTH, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
  },
  mainViewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: WIDTH * 0.615,
  },
  flatList: {
    paddingHorizontal: 9,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 23,
  },
  subscriptionInfo: {
    fontSize: 10,
    color: '#676877',
    fontFamily: fonts.AvenirLTStdRoman,
    marginTop: 25,
    paddingHorizontal: 20,
  },
  startSubscribeButton: {
    width: '100%',
    justifyContent: 'center',
    height: 52,
    borderRadius: 0,
  },
});

export default styles;
