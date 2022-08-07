import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { colors } from '@src/constants/vars';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
    backgroundColor: Theme.staff.contentBackground,
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  lineContainer: {
    height: 1,
    backgroundColor: colors.GRAY300,
  },
});
