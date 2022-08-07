import { StyleSheet } from 'react-native';
import { Theme } from '@components/Theme';
import { WIDTH, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  maintainenceContainer: {
    marginTop: 8,
    flex: 1
  },
  listContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  viewFilter: {
    flex: 1,
  },
  dropdownContainer: {
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  contentDropdownStyle: {
    width: WIDTH - 28,
    height: 30,
    backgroundColor: Theme.maintenanceRequestScreen.contentDropdownStyle,
    borderRadius: 2,
    justifyContent: 'center',
    paddingHorizontal: 19,
  },
  buildingText: {
    color: Theme.maintenanceRequestScreen.buildingText,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    flex: 1,
    textAlign: "left",
  },
  arrowImage: {
    marginTop: 5,
    width: 9,
    height: 5,
    marginLeft: 7,
    tintColor: Theme.maintenanceRequestScreen.buildingText,
  },
  rightImageStyle: {
    tintColor: Theme.maintenanceRequestScreen.buildingText,
  },
  viewLine: {
    height: 7,
    width: '100%',
    backgroundColor: Theme.recurring.containerBackground,
  }
});

export default styles;
