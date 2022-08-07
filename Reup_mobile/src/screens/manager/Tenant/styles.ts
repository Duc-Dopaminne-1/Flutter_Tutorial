import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const paddingHorizontal = 14;

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: Theme.category.backgroundColorSectionHeader,
    marginTop: 8,
  },
  searchSection: {
    backgroundColor: Theme.tenant.contentBackground,
    padding: paddingHorizontal,
    paddingBottom: 0,
  },
  lineContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  line: {
    width: '100%',
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
  },
});

export default styles;
