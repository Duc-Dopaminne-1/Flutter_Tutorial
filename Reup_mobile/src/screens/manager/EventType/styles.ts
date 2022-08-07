import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts } from '@src/constants/vars';
const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.event_type.contentBackground,
  },
  searchContainer: {
    backgroundColor: Theme.event_type.contentBackground,
    padding: 14,
    paddingBottom: 0,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.event_type.contentBackground,
  },
  lineContainer: {
    flexDirection: 'row',
    marginHorizontal: 14,
    height: 1,
    backgroundColor: Theme.event_type.separator,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 10,
    backgroundColor: Theme.event_type.contentBackground,
  },
  button: {
    width: '95%',
  },
  containerItem: {
    paddingVertical: 15,
    marginHorizontal: 14,
    alignItems: 'flex-start',
  },
  itemText: {
    color: Theme.event_type.item_text,
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
  },
});
export default styles;
