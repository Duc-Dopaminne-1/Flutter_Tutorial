import { StyleSheet } from "react-native";
import { Theme } from "@src/components/Theme";

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
    flex: 1,
    backgroundColor: Theme.staff.containerBackground,
  },
  containerSearchFilterBar: {
    backgroundColor: Theme.category.backgroundColorSearchBar,
    padding: 15
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
  },
  lineContainer: {
    flexDirection: 'row',
  },
  line: {
    width: '100%'
  },
  sectionHeader: {
    backgroundColor: Theme.category_details.backgroundColorSectionHeader
  },
  buttonContainer: {
    padding: 20,
    marginTop: 7,
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
  staffImage: {
    height: 17,
    width: 17,
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
    // paddingHorizontal: 15
  },
  button: {
    width: '95%',
  },
  styleContainerSearchBar: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  }
});

export default styles;
