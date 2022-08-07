import { StyleSheet } from 'react-native';
import { fonts } from '@constants/vars';
import { Theme } from '../Theme';
// styles
const styles = StyleSheet.create({
  containers: {},
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: Theme.productList.headers,
  },
  sectionHeader: {
    backgroundColor: Theme.category_details.backgroundColorSectionHeader
  },
  headersLeft: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    marginRight: 17,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.MontserratRegular,
    color: Theme.productList.title_show_product,
  },
  customTouchable: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    backgroundColor: Theme.productList.line,
    width: '100%',
    height: 1,
  },
  viewMore: {
    backgroundColor: Theme.productList.viewMore,
    width: 130,
    marginBottom: 20
  },
  textViewMore: {
    color: Theme.productList.textViewMore,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.MontserratLight,
  },
  iconViewMore: {
    width: 8,
    height: 7,
  },
  contentContainerStyle: {
  },
  contentContainerStyleGrid: {
  },
  columnWrapperStyle: {
    justifyContent: 'space-between'
  },
  productItemGrid: {
    flex: 0.5,
    margin: 6
  },
  viewDatePickers: {
    paddingTop: 16,
    paddingHorizontal: 15,
    flexDirection: 'row',
    backgroundColor: Theme.productList.viewDatePickers,
    justifyContent: 'center'
  },
  spaceDatePickerView: {
    marginHorizontal: 5,
    width: '100%',
    textAlign: 'center'
  },
  fiterContainer: {
    marginTop: 0,
    marginBottom: 12,
  },
  filter: {
    height: 30,
    width: '100%'
  },

  dropDownText: {
    flex: 1,
    color: Theme.filter_button.textColor,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
  },
  filterContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  imageListStyle: {
    width: 30,
    height: 30
  }
});

export default styles;
