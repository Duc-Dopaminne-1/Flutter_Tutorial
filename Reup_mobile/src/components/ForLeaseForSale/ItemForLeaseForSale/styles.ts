import { StyleSheet } from 'react-native';
import { fonts } from '@constants/vars';

// styles
const styles = StyleSheet.create({
  containers: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 14,
  },
  touchableHighlight: {
    backgroundColor: '#F3F3F3',
  },
  contents: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentsRight: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  contentsRight2: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    alignContent: 'space-between',
    alignSelf: 'stretch',
  },
  headers: {
    flexDirection: 'row',

  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: '#333333',
  },
  date: {
    fontSize: 10,
    fontFamily: fonts.MontserratLight,
    color: '#707070',

  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.MontserratLight,
    color: '#333333',
  },
  viewPrice: {
    marginTop: 8,
  },
  price: {
    flex: 1,
    fontSize: 13,
    lineHeight: 21,
    fontFamily: fonts.MontserratSemiBold,
    color: '#333333',
  },
  price2: {
    fontSize: 13,
    lineHeight: 21,
    fontFamily: fonts.MontserratSemiBold,
    color: '#333333',
  },
  subTitle: {
    fontSize: 11,
    lineHeight: 21,
    fontFamily: fonts.MontserratLight,
    color: '#1B72BF',
  },
  line: {
    marginTop: 15,
    width: '100%',
  },
});

export default styles;
