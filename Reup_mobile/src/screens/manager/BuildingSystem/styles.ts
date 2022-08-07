import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, colors } from '@src/constants/vars';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  lineContainer: {
    height: 1,
    backgroundColor: colors.GRAY300,
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
    marginBottom: 6,
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
  addBuildingBtn: {
    width: '88%',
    height: 40,
  },
  containerAddBuildingBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.building_system.backgroundColorContainerAddBuildingBtn,
    height: 80,
  },
});
