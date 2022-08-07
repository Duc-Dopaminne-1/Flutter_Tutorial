import { StyleSheet } from "react-native";
import { Theme } from "@src/components/Theme";
import { fonts } from "@src/constants/vars";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  searchFilterBar: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: Theme.category_details.backgroundColorSearchFilterBar,
    marginVertical: 6,
    paddingVertical: 12,
  },
  searchContainer: {
    height: 30,
    marginHorizontal: 14,
  },
  groupFilters: {
    flexDirection: 'row',
    flexGrow: 1,
    height: 30,
    marginHorizontal: 14,
    marginTop: 8,
  },
  mainContainerFilterBuilding: {
    flex: 3,
    marginEnd: 7,
  },
  containerFilterBuilding: {
    height: 30,
  },
  textStyleFilterBuilding: {
    flex: 1,
    textAlign: 'left',
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.category_details.textColorFilter,
  },
  mainContainerFilterStatus: {
    flex: 2,
    marginStart: 7,
  },
  containerFilterStatus: {
    width: '100%',
  },
  textStyleFilterStatus: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.category_details.textColorFilter,
  },
  body: {
    flex: 1,
    paddingBottom: 8,
  },
  sectionHeader: {
    backgroundColor: Theme.category_details.backgroundColorSectionHeader
  },
  imageBtnHeafer: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: Theme.category_details.backgroundColorImageBtnHeafer,
    width: 34,
    height: 30,
  },
  containerImageBtn: {
    alignSelf: 'center'
  },
  iconImageBtn: {
    tintColor: Theme.category_details.tintColorIconImageBtn,
  },
  titleSectionHeader: {
    fontSize: 13,
    fontFamily: fonts.MontserratRegular
  },
  customFlatlist: {
    flex: 1,
    backgroundColor: Theme.category_details.backgroundColorCustomFlatlist
  },
  contentContainerFlatlist: {
    flexGrow: 1,
  },
  containerDeleteCategoryBtn: {
    height: 80,
    backgroundColor: Theme.category_details.backgroundColorContainerDeleteCategoryBtn,
  },
  deleteCategoryBtn: {
    width: "88%",
    height: 40,
    marginTop: 13,
    backgroundColor: Theme.category_details.backgroundColorDeleteCategoryBtn
  },
  textDeleteCategoryBtn: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.category_details.textColorTextDeleteCategoryBtn
  },
});
