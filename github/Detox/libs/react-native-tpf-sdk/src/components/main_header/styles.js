import { StyleSheet } from 'react-native';
import { CUSTOM_COLOR, HEADER_COLOR } from '../../constants/colors';
import { DEVICE_WIDTH, HEADER_HEIGHT, SPACING, STATUS_BAR_HEIGHT } from '../../constants/size';
import { scale } from '../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    backgroundColor: HEADER_COLOR
  },
  shadow: {
    shadowColor: CUSTOM_COLOR.ShuttleGray,
    shadowOffset: {
      width: 0,
      height: scale(2)
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.62,
    elevation: 4
  },
  wrapper: {
    width: DEVICE_WIDTH,
    marginTop: STATUS_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.Medium
  },
  icon: {
    paddingLeft: SPACING.XSmall,
    paddingVertical: scale(5)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  isBackBtn: {
    left: 0,
    height: '100%',
    width: scale(50),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  right: {
    right: SPACING.Medium,
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  }
});
