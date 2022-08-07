import { StyleSheet } from 'react-native';
import { fonts, WIDTH, HEIGHT } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const paddingHorizontalButton = 20;
const paddingBetweenButton = 12;
const widthButton = (WIDTH - paddingHorizontalButton * 2 - paddingBetweenButton) / 2;

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
    flex: 1,
    backgroundColor: Theme.staff.containerBackground,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 7,
    backgroundColor: Theme.staff.contentBackground,
  },
  button: {
    width: '95%',
    backgroundColor: Theme.apartments.bgButton,
  },
  buttonCreateMember: {
    height: 32,
  },
  sectionHeader: {
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  scrollViewContainer: {
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  images: {
    marginRight: 9,
    borderWidth: 0,
  },
  flatListImages: {
    marginVertical: 15,
    marginLeft: 15,
  },
  title: {
    fontSize: 13,
    fontFamily: fonts.MontserratSemiBold,
    textAlign: 'left',
    color: Theme.apartments.bgButton,
  },
  apartmentCode: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginHorizontal: 15,
  },
  rowItem: {
    flexDirection: 'row',
    paddingVertical: 15,
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
  description: {
    fontFamily: fonts.MontserratLight,
    marginVertical: 10,
    marginBottom: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    paddingHorizontal: 15,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.apartments.line,
  },
  textContainers: {
    paddingHorizontal: 15,
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
  textRight: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    textAlign: 'right',
    color: Theme.apartments.text,
  },
  sectionHeaderView: {
    marginTop: 7,
  },
  memberSectionContent: {
    height: HEIGHT * 0.5,
    backgroundColor: Theme.tenant_detail.contentBackground,
  },
  bottomButtonView: {
    flexDirection: 'row',
    height: 66,
    paddingHorizontal: paddingHorizontalButton,
    backgroundColor: Theme.tenant_detail.contentBackground,
    marginTop: 7,
  },
  widthButton: {
    width: widthButton,
  },
  deleteButton: {
    backgroundColor: Theme.tenant_detail.transferBgrButton,
  },
  transferButton: {
    marginRight: paddingBetweenButton,
    backgroundColor: Theme.tenant_detail.addItemText,
  },
  emptyContainerView: {
    width: WIDTH
  },
});

export default styles;
