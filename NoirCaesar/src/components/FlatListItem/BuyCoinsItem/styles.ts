import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: 16,
    marginBottom: 24,
    borderRadius: 6,
    borderColor: '#676877',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsTitle: {
    color: '#FFFFFF',
    fontFamily: fonts.AvenirLTStdRoman,
    fontSize: 15,
  },
  iconCoins: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  coinsInfo: {
    fontFamily: fonts.AvenirLTStdMedium,
    fontSize: 15,
  },
  priceContainer: {
    width: 95,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#FF0000',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.AvenirLTStdRoman,
  },
});

export default styles;
