import { StyleSheet } from 'react-native';
import { WIDTH, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 25,
    paddingVertical: 27,
  },
  imageStyle: {
    width: 110,
    height: 155,
  },
  titleStyle: {
    fontFamily: fonts.AvenirLTStdMedium,
    fontSize: 18,
    color: '#FFFFFF',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  codeStyle: {
    fontFamily: fonts.AvenirLTStdMedium,
    fontSize: 14,
    color: '#676877',
    marginBottom: 10,
  },
  priceStyle: {
    fontFamily: fonts.AvenirLTStdMedium,
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 10,
  },
  quantityStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    color: '#676877',
    marginRight: 5,
  },
  quantityShape: {
    flexDirection: 'row',
    borderColor: '#676877',
    borderRadius: 3,
    borderWidth: 1,
    marginLeft: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  quantityNumView: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityNum: {
    fontSize: 16,
    color: '#FF0000',
    marginVertical: 4,
  },
  quantityNumMiddleView: {
    width: 40,
    height: 30,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#676877',
  },
});

export default styles;
