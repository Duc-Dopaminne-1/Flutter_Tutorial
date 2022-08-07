import { fonts } from '@src/constants/vars';
import { StyleSheet } from 'react-native';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  container: {},
  sectionHeader: {
    backgroundColor: Theme.productList.backgroundColorSectionHeader,
  },
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: Theme.productList.headers,
  },
  headersLeft: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  iconGrid: {
    width: 30,
    height: 30,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  contentContainerStyleGrid: {
    flexGrow: 1,
  },
  productItemGrid: {
    flex: 0.5,
    margin: 6,
  },
  gridView: {
    backgroundColor: Theme.productList.backgroundColorGridView,
  },
  listView: {
    backgroundColor: Theme.productList.backgroundColorGridView,
  },
  viewMore: {
    backgroundColor: Theme.productList.viewMore,
    width: 130,
    marginBottom: 20,
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
});

export default styles;
