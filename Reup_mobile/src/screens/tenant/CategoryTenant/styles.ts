import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, colors, WIDTH } from '@src/constants/vars';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  containerCustomTabBar: {
    flex: 1,
  },
  containerSearchFilterBar: {
    backgroundColor: Theme.category.backgroundColorSearchBar,
    padding: 15,
  },
  containerImageBtn: {
    alignSelf: 'center',
  },
  iconImageBtn: {
    tintColor: Theme.category_details.tintColorIconImageBtn,
  },
  imageBtnHeafer: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: Theme.category_details.backgroundColorImageBtnHeafer,
    width: 34,
    height: 30,
  },
  line: {
    height: 1,
    backgroundColor: colors.GRAY300,
    width: WIDTH - 46,
    marginBottom: 0,
    alignSelf: 'center',
  },
  searchBar: {},
  sectionHeader: {
    backgroundColor: Theme.category.backgroundColorSectionHeader,
    marginTop: 8,
  },
  body: {
    flex: 1,
    marginBottom: 8,
    backgroundColor: Theme.category.backgroundColorContentContainer,
  },
  contentContainerFlatList: {
    flexGrow: 1,
  },
  textAddBuildingBtn: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.category.textColorAddCategory,
  },
  leftIcon: {
    height: 15,
    width: 15,
  },
  addBuildingBtn: {
    width: '95%',
  },
  checkbox: {
    justifyContent: 'flex-start',
    height: 20,
    width: 20,
    marginEnd: 20,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 23,
    paddingVertical: 18,
  },
  itemText: {
    color: 'black',
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratMedium,
  },
  containerText: {
    flex: 1,
  },
  containerAddBuildingBtn: {
    backgroundColor: Theme.category.backgroundColorContainerAddCategoryBtn,
    padding: 20,
  },
  dotLine: {
    width: '100%',
  },
});
