import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.staff.contentBackground,
    paddingLeft: 14,
    paddingTop: 17,
    paddingBottom: 16,
  },
  image: {
    marginRight: 15,
  },
  contentContainer: {
    justifyContent: 'space-around',
    flex: 1,
    marginEnd: 15,
  },
  name: {
    color: Theme.general_notification.name,
    fontSize: 13,
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratMedium,
  },
  description: {
    textAlignVertical: 'bottom',
    color: Theme.general_notification.description,
    fontSize: 13,
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratLight,
  },
  date: {
    color: Theme.general_notification.time,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  time: {
    color: Theme.general_notification.time,
    fontSize: 10,
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratLight,
    marginTop: 4,
  },
  type: {
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.general_notification.type,
    marginTop: 4,
  },
  containerTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  containerInfo: {
    flex: 1,
    marginRight: 15,
  },
});

export default styles;
