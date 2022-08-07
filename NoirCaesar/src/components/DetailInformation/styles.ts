import { StyleSheet } from 'react-native';
import { WIDTH, WIDTH_RATIO } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
  },
  subContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 8,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontSize: 10,
    color: '#676877',
    width: 60,
    marginRight: 5,
  },
  detail: {
    fontSize: 10,
    color: '#676877',
    alignSelf: 'flex-start',
  },
  detailHalfWidth: {
    width: (WIDTH / 2 - 80) * WIDTH_RATIO,
  },
  detailFullWidth: {
    width: (WIDTH - 100) * WIDTH_RATIO,
  },
  coinsLayout: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconCoins: {
    width: 15,
    height: 15,
    marginRight: 6,
  },
  coinsTitle: {
    fontSize: 10,
    color: '#676877',
    width: 80,
  },
  coinsText: {
    width: 50,
    fontSize: 10,
    color: '#676877',
  },
});

export default styles;
