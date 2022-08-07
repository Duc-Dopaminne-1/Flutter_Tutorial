import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const paddingHorizontal = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.staff.containerBackground,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.building_system.backgroundColorSectionHeader,
  },
  lineContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    width: '100%',
  },
  line: {
    width: '100%',
  },
  searchContainer: {
    backgroundColor: Theme.tenant.contentBackground,
    padding: paddingHorizontal,
    paddingBottom: 0,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 10,
    backgroundColor: Theme.staff.contentBackground,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingLeft: 14,
    borderBottomWidth: 1,
    borderColor: Theme.staff.borderLine,
    backgroundColor: Theme.staff.contentBackground,
  },
  button: {
    width: '95%',
  },
});

export default styles;
