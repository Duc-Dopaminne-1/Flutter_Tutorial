import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, colors, WIDTH } from '@src/constants/vars';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  lineContainer: {
    height: 1,
    width: WIDTH - 30,
    backgroundColor: colors.GRAY300,
    alignSelf: 'center',
  },
  containerSearchFilterBar: {
    backgroundColor: Theme.category.backgroundColorSearchBar,
    padding: 15,
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.building_system.backgroundColorSectionHeader,
  },
  body: {
    flex: 1,
    backgroundColor: Theme.building_system.backgroundColorContentContainer,
  },
  contentContainerFlatlist: {
    flexGrow: 1,
  },
  textAddBuildingBtn: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.building_system.textColorAddBuilding,
  },
  leftIcon: {
    height: 15,
    width: 15,
  },
  addFacilityBtn: {
    width: '88%',
    height: 40,
  },
  containerAddFaciliyBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.building_system.backgroundColorContainerAddBuildingBtn,
    marginTop: 7,
    paddingVertical: 13,
  },
  facilityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  nameBuilding: {
    textAlign: 'left',
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: Theme.building_system.textColorNameBuilding,
    marginLeft: 10,
  },
  containerNameBuilding: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  image: {
    borderWidth: 0,
    borderRadius: 2,
  },
});
