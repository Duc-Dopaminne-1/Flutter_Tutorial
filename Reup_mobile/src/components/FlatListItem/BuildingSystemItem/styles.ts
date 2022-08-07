import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  content: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    paddingStart: 23,
    justifyContent: 'space-between',
  },
  nameBuilding: {
    textAlign: 'left',
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: Theme.building_system.textColorNameBuilding,
  },
  containerNameBuilding: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  iconNation: {
    height: 16,
    width: 16,
    borderRadius: 16 / 2,
  },
  nation: {
    color: Theme.building_system.textColorNameNation,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    paddingStart: 8,
  },
  containerNameNation: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
