import { StyleSheet } from 'react-native';
import { WIDTH } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  searchContainer: {
    marginTop: 8,
  },
  styleContainerSearchBar: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  filterButtonContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.recurring.contentBackground,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  longButton: {
    width: (WIDTH - 38) / 2,
  },
  longButtonExtra: {
    marginLeft: 8,
  },
  shortButton: {
    width: (WIDTH - 42 - (WIDTH - 30) * 0.467) / 2,
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 8,
    backgroundColor: Theme.recurring.contentBackground,
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.building_system.backgroundColorSectionHeader,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.recurring.contentBackground,
  },
  lineContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    width: '100%',
  },
  line: {
    width: '100%',
  },
  button: {
    width: '95%',
  },
  containerSearchFilterBar: {
    backgroundColor: Theme.category.backgroundColorSearchBar,
    padding: 15,
  },
});

export default styles;
