import { StyleSheet } from 'react-native';
import { colors, WIDTH, fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const paddingHorizontalButton = 20;
const paddingBetweenButton = 12;
const widthButton = (WIDTH - (paddingHorizontalButton * 2) - paddingBetweenButton) / 2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.product.backgroundColor
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: colors.WHITE
  },
  bottomButtonView: {
    flexDirection: 'row',
    height: 66,
    paddingHorizontal: paddingHorizontalButton,
    backgroundColor: Theme.product.bottomButtonContainerBackgroundColor,
    marginTop: 5
  },
  approveButton: {
    marginRight: paddingBetweenButton,
    backgroundColor: Theme.product.approveButtonBackgroundColor,
  },
  denyButton: {
    backgroundColor: Theme.product.denyButtonBackgroundColor
  },
  denyText: {
    color: Theme.product.denyButtonTextColor
  },

  widthButton: {
    width: widthButton
  },
  content: {
    paddingHorizontal: 14,
    backgroundColor: colors.WHITE,
    alignItems: 'flex-start'
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  titleText: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 13,
    color: Theme.product.titleColor
  },
  titleContainer: {
    marginTop: 16
  },
  dateText: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.product.dateColor
  },
  dateContainer: {
    marginTop: 10,
    marginBottom: 11
  },
  showImageContainer: {
    width: '100%',
    height: 300,
    marginHorizontal: 0,
    backgroundColor: colors.WHITE
  },
  categoryTitle: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: Theme.product.categoryTitle
  },
  categoryContent: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: Theme.product.categoryContent
  },
  price: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 15,
    color: Theme.product.priceColor
  },
  priceContainer: {
    marginTop: 15
  },
  description: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: Theme.product.description,
    textAlign: 'left'
  },
  descriptionContainer: {
    marginVertical: 20,

  },
  sellerContainer: {
    marginTop: 8
  },

});

export default styles;
