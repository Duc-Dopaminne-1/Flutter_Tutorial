import { StyleSheet } from 'react-native';
import { Theme } from '@components/Theme';
import { WIDTH, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  maintainenceContainer: {
    marginVertical: 7,
    flex: 1
  },
  listContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Theme.maintenanceRequestScreen.backgroundColor,
    paddingBottom: 20,
    marginTop: 7,
    flexDirection: 'column'
  },
  viewFilter: {
    flex: 1,
    backgroundColor: Theme.maintenanceRequestScreen.backgroundColor,
  },
  dropdownContainer: {
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.maintenanceRequestScreen.backgroundColor,
  },
  contentDropdownStyle: {
    width: WIDTH - 28,
    height: 30,
    backgroundColor: Theme.maintenanceRequestScreen.contentDropdownStyle,
    borderRadius: 2,
    justifyContent: 'center',
    paddingHorizontal: 19,
  },
  buildingText: {
    color: Theme.maintenanceRequestScreen.buildingText,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    flex: 1,
    textAlign: "left",
  },
  arrowImage: {
    marginTop: 5,
    width: 9,
    height: 5,
    marginLeft: 7,
    tintColor: Theme.maintenanceRequestScreen.buildingText,
  },
  rightImageStyle: {
    tintColor: Theme.maintenanceRequestScreen.buildingText,
  },
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: Theme.maintenanceRequestScreen.backgroundColor,
  },
  styleTitle: {
    paddingRight: 14
  },
  styleTitleContain: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  headersLeft: {
    flex: 1,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconHeader: {
    width: 20
  },
  title: {
    marginHorizontal: 7,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: fonts.MontserratRegular,
    color: Theme.maintenanceRequestScreen.buildingText,
  },
  search: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.staff.staff_add_position,
    borderRadius: 2
  },
  iconSearch: {
    width: 20,
    height: 20
  },
  textSearch: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: fonts.MontserratLight,
    color: 'white'
  },
  line: {
    backgroundColor: Theme.staff_detail.lineContentBorder,
    width: WIDTH,
    height: 1,
  },
  addNewRequestContainer: {
    width: '100%',
    height: 66,
    backgroundColor: Theme.maintenanceRequestScreen.backgroundColor
  },
  addNewRequestContents: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22
  },
  btnAddNewRequest: {
    height: 40,
  },
  textAddNewRequest: {
    fontSize: 13,
    lineHeight: 24,
    fontFamily: fonts.MontserratLight,
    color: Theme.maintenanceRequestScreen.backgroundColor
  },
  viewListContent: {
    flex: 1,
  },
  containerSearchFilterBar: {
    backgroundColor: Theme.category.backgroundColorSearchBar,
    padding: 15,
  },
});

export default styles;
