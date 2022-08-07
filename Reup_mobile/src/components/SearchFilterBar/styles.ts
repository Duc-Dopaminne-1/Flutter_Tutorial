import { StyleSheet } from "react-native";
import { Theme } from "../Theme";

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    alignContent: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.search_filter_bar.backgroundContainer,
    flexDirection: 'row',
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingStart: 4,
    paddingEnd: 16
  },
  searchInnerContainer: {
    height: 30,
  },
  iconSearchContainer: {
    marginRight: 8
  },
  iconSearch: {
    width: 18,
    height: 18,
  },
  filterContainer: {
    width: '50%',
    justifyContent: 'center',
    alignContent: 'center',
    paddingStart: 16,
    paddingEnd: 4
  },
  containerStyleDropdown: {
    width: '100%',
    height: 30
  },
  textStyleDropDown: {
    flex: 1,
    textAlign: 'left',
    color: Theme.search_filter_bar.textColorDropDown,
    marginStart: 10,
  }
});
