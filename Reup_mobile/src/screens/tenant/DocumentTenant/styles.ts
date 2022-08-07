import { Theme } from '@src/components/Theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    backgroundColor: Theme.document.backgroundColorContentContainer,
  },
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: Theme.maintenanceRequestScreen.backgroundColor,
  },
  styleTitle: {
    paddingRight: 14,
  },
  styleTitleContain: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  searchContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  flatListView: {
    flex: 1,
  },
  contentContainerFlatList: {
    flexGrow: 1,
    backgroundColor: Theme.document.backgroundColorContentContainer,
  },
  separator: {
    flex: 1,
    height: 0.5,
    backgroundColor: Theme.document.separator,
    marginHorizontal: 16,
  },
  line: {
    width: '100%',
  },
});

export default styles;
