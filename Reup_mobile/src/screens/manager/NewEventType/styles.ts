import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.new_event_type.containerBackground,
  },
  listContainer: {
    flex: 1,
  },
  sectionHeader: {
    marginTop: 7,
    backgroundColor: Theme.new_event_type.contentBackground,
  },
  sectionIconStyle: {
    tintColor: Theme.new_event_type.headerTitle,
  },
  inputFormSubContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    marginBottom: 7,
    backgroundColor: Theme.new_event_type.contentBackground,
  },
  buttonContainer: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    backgroundColor: Theme.new_event_type.contentBackground,
  },
  button: {
    backgroundColor: Theme.new_event_type.headerTitle,
  },
});

export default styles;
