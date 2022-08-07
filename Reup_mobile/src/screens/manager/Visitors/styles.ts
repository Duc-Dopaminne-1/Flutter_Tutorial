import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { WIDTH, fonts } from '@src/constants/vars';

const paddingLeft = 16;

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    height: 46,
    paddingLeft: paddingLeft,
    borderBottomWidth: 1,
    borderColor: Theme.tenant.borderLine,
    backgroundColor: Theme.tenant.contentBackground,
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  searchSection: {
    backgroundColor: Theme.tenant.contentBackground,
    padding: paddingLeft,
  },
  lineContainer: {
    flexDirection: 'row',
    marginHorizontal: paddingLeft,
  },
  line: {
    width: WIDTH - paddingLeft * 2,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
  },
  containerInformBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.building_system.backgroundColorContainerAddBuildingBtn,
    marginTop: 7,
    padding: 20,
  },
  informVisitorBtn: {
    width: '95%',
    height: 40,
  },
});

export default styles;
