import { StyleSheet } from 'react-native'
import { colors, fonts } from '@/vars'

export const styles = StyleSheet.create({
  formBar: {
    backgroundColor: colors.white,
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR_DEFAULT,
    borderRadius: 3,
    width: '100%'
  },
  inputChat: {
    flex: 1,
    padding: 8,
    height: 36,
    fontSize: 16,
    fontFamily: fonts.family.SSPRegular
  },
  iconStyle: {
    height: 20,
    width: 20,
    tintColor: '#637381'
  },
  errorIconStyle: {
    height: 20,
    width: 20,
    marginRight: 6
  },
  errorContainer: {
    marginTop: 5,
    flexDirection: 'row'
  },
  textTitle: {
    fontSize: 17,
    color: colors.TEXT_DATE_COLOR,
    marginBottom: 8,
    fontFamily: fonts.family.SSPRegular
  },
  errorText: {
    flex: 1,
    color: 'red',
    fontSize: 14,
    fontFamily: fonts.family.SSPRegular
  },
  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: colors.DIVIDER
  },
  containerGradient: {
    width: '100%'
  },
  wrapLinearGradient: {
    borderRadius: 3,
    flex: 1
  }
})

export default styles
