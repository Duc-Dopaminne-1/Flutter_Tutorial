import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/vars';

const styles = StyleSheet.create({
  callingCode: {
    paddingHorizontal: 8,
  },
  containers: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  description: {
    color: colors.black_light_alpha,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: 13,
    marginBottom: 15,
  },
  textStyle: {
    color: colors.gray_700,
    fontSize: 16,
    fontFamily: fonts.family.PoppinsRegular,
  },
  wrapCode: {
    borderBottomColor: colors.placeholder_gray,
    borderBottomWidth: 0.7,
  },
  wrapDropDown: {
    height: 8,
    tintColor: colors.gray_product,
    width: 8,
  },
  wrapPhone: {
    flex: 1,
    marginLeft: 5,
  },
});

export default styles;
