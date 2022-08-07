import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  filterContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Theme.calendar.whiteBackground,
    marginTop: 6,
  },
  sectionHeader: {
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  filterDropdown: {
    width: (WIDTH - 50) / 2,
    marginLeft: 15,
  },
  dropDownText: {
    flex: 1,
    color: Theme.filter_button.textColor,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    textAlign: 'left',
  },
  middleScrollView: {
    flex: 1,
    marginBottom: 6,
    backgroundColor: Theme.calendar.whiteBackground,
  },
  middleScrollViewContent: {
    alignItems: 'center',
  },
  viewDetailButton: {
    width: 125,
    height: 30,
    marginTop: 20,
    marginLeft: 20,
    backgroundColor: Theme.calendar.submitButton,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  viewDetailText: {
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    color: Theme.calendar.textColorWhite,
  },
  bottomButton: {
    width: '88%',
    height: 40,
    marginVertical: 13,
    backgroundColor: Theme.calendar.greenBackground,
  },
  bottomButtonContainer: {
    backgroundColor: Theme.calendar.whiteBackground,
  },
  timeFilterContainer: {
    width: '100%',
    paddingLeft: 14,
    paddingTop: 15,
    paddingBottom: 22,
    backgroundColor: Theme.calendar.whiteBackground,
  },
  timeFilterText: {
    color: Theme.calendar.textColorFilter,
    fontSize: 13,
    fontFamily: fonts.MontserratSemiBold,
  },
  arrowStyle: {
    tintColor: Theme.calendar.textColorFilter,
    width: 10,
    height: 4,
    marginLeft: 9,
  },
  statusDetail: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 27,
    backgroundColor: Theme.calendar.whiteBackground,
  },
  statusItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusItemText: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.calendar.textColorTitle,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  circleView: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  greenBackground: {
    backgroundColor: Theme.calendar.greenBackground,
  },
  blueBackground: {
    backgroundColor: Theme.calendar.blueBackground,
  },
  veryLightPinkBackground: {
    backgroundColor: Theme.calendar.veryLightPinkBackground,
  },
});

export default styles;
