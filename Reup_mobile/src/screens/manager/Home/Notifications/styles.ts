import { StyleSheet } from 'react-native';
import { WIDTH, fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.staff.containerBackground,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
  },
  lineContainer: {
    flexDirection: 'row',
  },
  line: {
    width: '100%',
  },
  searchContainer: {
    marginTop: 5,
  },
  filterButtonContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.staff.contentBackground,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 7,
    alignContent: 'center',
  },
  longButton: {
    width: (WIDTH - 30) * 0.72,
  },
  shortButton: {
    width: (WIDTH - 30) * 0.27,
    flex: 1,
    marginLeft: 8,
  },
  textDropDownNative: {
    flex: 1,
    color: Theme.filter_button.textColor,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    textAlign: 'left',
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
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
  staffImage: {
    height: 17,
    width: 17,
  },
  staffText: {
    marginLeft: 7,
    color: Theme.staff.button,
  },
  button: {
    width: '95%',
  },
  styleContainerSearchBar: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleHeader: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 13,
    color: Theme.general_notification.textColorTitle,
  },
});

export default styles;
