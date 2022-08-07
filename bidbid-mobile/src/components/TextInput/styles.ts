import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/vars';
import { isIOS } from '@/shared/devices';

export const styles = StyleSheet.create({
  containerGradient: {
    width: '100%',
  },
  wrapIcon: {
    marginEnd: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  errorIconStyle: {
    height: 20,
    marginRight: 6,
    width: 20,
  },
  errorText: {
    color: colors.red,
    flex: 1,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: 14,
  },
  formBar: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    borderBottomColor: colors.placeholder_gray,
    borderBottomWidth: 1,
    borderRadius: 3,
    flexDirection: 'row',
    width: '100%',
  },
  iconPrefix: {
    color: colors.gray_900,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
  },
  icon: {
    height: 23,
    marginLeft: 10,
    marginRight: 5,
    tintColor: colors.gray_product,
    width: 23,
  },
  iconStyle: {
    height: 20,
    tintColor: colors.gray_ic_beta,
    width: 20,
  },
  iconPrefixStyle: {
    color: colors.bg_tab,
  },
  inputChat: {
    color: colors.gray_900,
    flex: 1,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    paddingVertical: 0,
    paddingTop: isIOS ? 0 : 4,
  },
  separatorLine: {
    backgroundColor: colors.divider,
    height: 1,
    width: '100%',
  },
  textTitle: {
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsMedium,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: fonts.size.s16,
  },
  textSubTitle: {
    fontSize: fonts.size.s11,
    color: colors.blue_grey,
    fontFamily: fonts.family.SSPRegular,
  },
  wrapLinearGradient: {
    borderRadius: 3,
    flex: 1,
  },
  textAsterisk: {
    color: colors.red,
    fontFamily: fonts.family.PoppinsMedium,
  },
  wrapTitle: {
    flexDirection: 'row',
  },
});

export default styles;
