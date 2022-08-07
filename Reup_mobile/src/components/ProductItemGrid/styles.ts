import { StyleSheet } from 'react-native';
import { Theme } from '../Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Theme.productItemGrid.container,
    margin: 6,
  },
  viewContain: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  title: {
    marginTop: 8,
    paddingHorizontal: 8,
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratLight,
    lineHeight: 15,
    color: Theme.productItemGrid.title,
  },
  description: {
    marginTop: 3,
    paddingHorizontal: 8,
    fontSize: 11,
    textAlign: 'left',
    fontFamily: fonts.MontserratLight,
    lineHeight: 15,
  },
  status: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratMedium,
    alignSelf: 'flex-start',
  },
  viewBottom: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  viewPrice: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    textAlign: 'left',
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: Theme.productItemGrid.price,
    marginTop: 3,
  },
  buy: {
    width: 35,
    height: 25,
  },
  iconBuy: {
    width: 35,
    height: 25,
  },
});

export default styles;
