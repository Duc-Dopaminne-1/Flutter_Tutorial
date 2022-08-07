import { StyleSheet } from 'react-native';
import { colors, WIDTH, fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.product.backgroundColor,
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: colors.WHITE,
  },
  content: {
    paddingHorizontal: 14,
    backgroundColor: colors.WHITE,
    alignItems: 'flex-start',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  titleText: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 13,
    color: Theme.product.titleColor,
  },
  titleContainer: {
    marginTop: 16,
  },
  dateText: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.product.dateColor,
  },
  dateContainer: {
    marginTop: 10,
    marginBottom: 11,
  },
  showImageContainer: {
    width: '100%',
    height: 300,
    marginHorizontal: 0,
    backgroundColor: colors.WHITE,
  },
  categoryTitle: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: Theme.product.categoryTitle,
  },
  categoryContent: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: Theme.product.categoryContent,
  },
  price: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 15,
    color: Theme.product.priceColor,
  },
  priceContainer: {
    marginTop: 15,
  },
  description: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: Theme.product.description,
    textAlign: 'left',
  },
  descriptionContainer: {
    marginVertical: 20,
  },
  sellerContainer: {
    marginTop: 8,
  },
  productItemGrid: {
    width: 160,
    margin: 6,
  },
  relatedProductContainer: {
    marginTop: 7,
    flex: 1,
    backgroundColor: Theme.product.bottomButtonContainerBackgroundColor,
  },
  relatedProductList: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 12,
  },
});

export default styles;
