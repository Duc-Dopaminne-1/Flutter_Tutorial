import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
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
    height: 1,
    marginLeft: 23,
    marginRight: 21,
    backgroundColor: Theme.recurring.divider,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 8,
    backgroundColor: Theme.recurring.contentBackground,
  },
  button: {
    width: '95%',
    backgroundColor: Theme.recurring.save_button,
  },
});

export default styles;
