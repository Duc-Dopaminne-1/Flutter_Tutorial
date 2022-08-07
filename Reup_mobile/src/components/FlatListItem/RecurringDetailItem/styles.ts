import { StyleSheet } from 'react-native';
import { fonts, WIDTH } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.recurring.contentBackground,
    paddingLeft: 14,
    paddingTop: 17,
    paddingBottom: 16,
  },
  contentContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 18,
    paddingLeft: 24,
    paddingRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  leftTextStyle: {
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: Theme.event_log.textColorEventName,
    marginRight: 40,
  },
  rightTextStyle: {
    maxWidth: 220,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.event_log.textColorEventDetail,
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  itemCenter: {
    alignItems: 'center',
  },
  itemStart: {
    alignItems: 'flex-start',
  },
  fontMedium: {
    fontFamily: fonts.MontserratMedium,
  },
  fontLight: {
    fontFamily: fonts.MontserratLight,
  },
  containerRadioBtn: {
    marginEnd: WIDTH / 3,
  },
  priority: {
    width: 80,
    height: 30,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: Theme.recurring.priorityBackground,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    color: Theme.recurring.priorityText,
  },
  monthOfYearView: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },
  checkBoxView: {
    flexDirection: 'row',
  },
  checkBoxItemView: {
    flex: 1,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  checkBox: {
    height: 22,
    width: 22,
  },
  checkBoxText: {
    marginStart: 15,
    paddingRight: 10,
  },
  statusActive: {
    color: Theme.recurring.statusActiveText,
    backgroundColor: Theme.recurring.statusActiveBackground,
  },
  statusInActive: {
    color: Theme.recurring.statusInActiveText,
    backgroundColor: Theme.recurring.statusInActiveBackground,
  },
  statusTextActive: {
    color: Theme.recurring.statusActiveText,
  },
  statusTextInActive: {
    color: Theme.recurring.statusInActiveText,
  },
  status: {
    width: 80,
    height: 30,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
});

export default styles;
