import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
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
  contentStatusContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },
  titleView: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  title: {
    color: Theme.recurring.titleText,
    fontSize: 13,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratMedium,
  },
  itemCategoryView: {
    flex: 4,
    height: 30,
    alignSelf: 'flex-start',
  },
  itemCategory: {
    alignSelf: 'flex-start',
    color: Theme.recurring.categoryText,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
  },
  status: {
    flex: 1,
    height: 30,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
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
});

export default styles;
