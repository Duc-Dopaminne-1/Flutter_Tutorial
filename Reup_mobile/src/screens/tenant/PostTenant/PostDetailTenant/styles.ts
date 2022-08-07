import { StyleSheet } from 'react-native';
import { colors, WIDTH, fonts, HEIGHT } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const paddingHorizontalButton = 20;
const paddingBetweenButton = 12;
const widthButton = (WIDTH - (paddingHorizontalButton * 2) - paddingBetweenButton) / 2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.post_detail.backgroundColor
  },
  bottomButtonView: {
    flexDirection: 'row',
    height: 66,
    paddingHorizontal: paddingHorizontalButton,
    backgroundColor: Theme.post_detail.bottomButtonContainerBackgroundColor,
    marginTop: 5
  },

  approveButton: {
    marginRight: paddingBetweenButton,
    backgroundColor: Theme.post_detail.approveButtonBackgroundColor,
  },
  denyButton: {
    backgroundColor: Theme.post_detail.denyButtonBackgroundColor
  },
  denyText: {
    color: Theme.post_detail.denyButtonTextColor
  },

  widthButton: {
    width: widthButton
  },
  marginSection: {
    marginTop: 5
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: colors.WHITE
  },
  postDetailContainer: {
    backgroundColor: colors.WHITE
  },
  headerPostDetailContainer: {
    alignItems: 'flex-start'
  },
  titleText: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.post_detail.titleColor
  },
  titleContainer: {
    marginTop: 15,
    marginHorizontal: 14,
  },
  dateText: {
    fontFamily: fonts.MontserratLight,
    fontSize: 10,
    color: Theme.post_detail.dateColor
  },
  dateContainer: {
    marginTop: 9,
    marginHorizontal: 14,
  },
  priceText: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 18,
    color: Theme.post_detail.priceColor,
  },
  priceContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 14
  },
  priceStyle: {
    flexDirection: 'row',

  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  monthText: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.post_detail.month,
  },
  description: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: Theme.post_detail.description,
  },
  descriptionContainer: {
    margin: 14
  },
  sellerContainer: {
    marginTop: 7
  },
  separate: {
    width: 12,
    height: HEIGHT * 0.27,
    backgroundColor: 'transparent'
  },
  image: {
    width: WIDTH - 50,
    height: HEIGHT * 0.25
  },
  imageWidth: {
    width: WIDTH - 30
  },
  imageContainer: {
    marginTop: 15,
    width: '100%',
  },
  flatlist: {
    width: '100%',
    height: '100%'
  },
  infoApartmentContainer: {
    marginTop: 7,
    backgroundColor: 'white'
  },
  subTitle: {
    fontSize: 13,
    fontFamily: fonts.MontserratRegular,
    textAlign: 'left',
    color: Theme.apartments.text,
  },
  subTitleDes: {
    fontFamily: fonts.MontserratSemiBold,
    paddingTop: 15,
  },
  descriptionApartment: {
    fontFamily: fonts.MontserratLight,
    marginVertical: 10,
    marginBottom: 15,
  },
  textRight: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    textAlign: 'right',
    color: Theme.apartments.text,
  },
  textContainers: {
    paddingHorizontal: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.apartments.line,
  },
  key: {
    flex: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  value: {
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  rowItem: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  apartmentCode: {
    fontSize: 13,
    fontFamily: fonts.MontserratSemiBold,
    color: Theme.apartments.bgButton,

  },
  imagesListContainer: {
    paddingHorizontal: 14
  },
  status: {
    fontSize: 13,
    fontFamily: fonts.MontserratSemiBold,
  },

});
export default styles;
