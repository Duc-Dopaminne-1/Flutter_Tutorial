import { StyleSheet } from 'react-native';
import { Theme } from '@components/Theme';
import { fonts, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 15,
  },
  headerContainer: {
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  headerIcon: {
    width: 96,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 9
  },
  iconBlue: {
    width: 8,
    height: 8,
    backgroundColor: Theme.maintenanceRequestListContent.iconBlue,
    marginRight: 9
  },
  headerLabel: {
    textAlign: 'left',
    fontSize: 11,
    fontFamily: fonts.MontserratMedium,
    lineHeight: 14,
    color: Theme.maintenanceRequestListContent.headerLabel,
  },
  viewHeaderText: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerText: {
    textAlign: 'left',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    lineHeight: 16,
    color: Theme.maintenanceRequestListContent.headerText
  },
  divider: {
    height: 1,
    backgroundColor: Theme.maintenanceRequestListContent.divider
  },
  creatorContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  creatorView: {
    paddingLeft: 15
  },
  thumbnail: {
    width: 26,
    height: 26,
    marginRight: 8
  },
  priority: {
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 2
  },
  priorityLow: {
    color: Theme.maintenanceRequestListContent.colorPriorityLow,
    backgroundColor: Theme.maintenanceRequestListContent.bgPriorityLow,
  },
  priorityMedium: {
    color: Theme.maintenanceRequestListContent.colorPriorityMedium,
    backgroundColor: Theme.maintenanceRequestListContent.bgPriorityMedium,
  },
  priorityHigh: {
    color: Theme.maintenanceRequestListContent.colorPriorityHigh,
    backgroundColor: Theme.maintenanceRequestListContent.bgPriorityHigh,
  },
  trash: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    marginRight: 10
  },
  view: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    paddingHorizontal: 0
  },
  iconLeftStyle: {
    marginRight: 0
  },
  customFlatlist: {
    flex: 1,
  },
  contentContainerFlatlist: {
    flexGrow: 1,
    backgroundColor: Theme.building_system.backgroundColorContentContainer,
  },
});

export default styles;
