import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  flexStyle: {
    flex: 1
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.building_system.backgroundColorSectionHeader
  },
  flatListView: {
    paddingTop: 5,
  },
  contentContainerFlatlist: {
    backgroundColor: Theme.document.backgroundColorContentContainer,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 5,
    backgroundColor: Theme.staff.contentBackground,
  },
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headersLeft: {
    flex: 1,
    marginLeft: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginHorizontal: 7,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: fonts.MontserratRegular,
    color: '#1B72BF',
  },
  button: {
    width: '95%',
  },
  textDropDownNative: {
    color: Theme.filter_button.textColor,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    alignSelf: "center"
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: "white",
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 5,
    alignContent: 'center',
  }
});

export default styles;
