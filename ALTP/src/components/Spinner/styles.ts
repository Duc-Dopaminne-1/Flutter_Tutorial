import { StyleSheet, Dimensions } from 'react-native'
import {
  colors,
  WIDTH,
  HEIGHT,
  SPACING_DEFAULT,
  SPACING_LG
} from '@constants/vars'
import { Style } from './'

export const SpinnerStyle: Style = {
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },

  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 110,
    width: 110,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8
  },

  text: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center'
  }
}
