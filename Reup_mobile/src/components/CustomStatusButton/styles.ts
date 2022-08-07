import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  containerApproved: {
    width: 85,
    height: 25,
    backgroundColor: Theme.status.backgroundApproved,
    borderRadius: 2,
    justifyContent: 'center',
    alignContent: 'center',
  },
  containerDenied: {
    width: 85,
    height: 25,
    backgroundColor: Theme.status.backgroundDenied,
    borderRadius: 2,
    justifyContent: 'center',
    alignContent: 'center',
  },
  containerPending: {
    width: 85,
    height: 25,
    backgroundColor: Theme.status.backgroundPending,
    borderRadius: 2,
    justifyContent: 'center',
    alignContent: 'center',
  },
  approved: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.status.textColorApproved,
  },
  denied: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.status.textColorDenied,
  },
  pending: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    color: Theme.status.textColorPending,
  },
});

export default styles;
