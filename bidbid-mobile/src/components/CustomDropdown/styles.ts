import { StyleSheet, Platform } from 'react-native';
import { colors, fonts, screenWidth } from '@/vars';

export const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.8,
  },
  text: {
    fontSize: 16,
    color: colors.text_date,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorIconStyle: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  textColor: {
    color: colors.gray_900,
  },
  errorText: {
    fontSize: 14,
    color: colors.red,
    flex: 1,
  },
  modalDropdown: {
    flex: 1,
    borderWidth: Platform.OS === 'ios' ? 1 : 1.5,
    borderRadius: 4,
    paddingHorizontal: 12,
  },

  modalDropdownView: {
    height: '100%',
    flexDirection: 'row',
    marginLeft: 0,
    marginRight: 0,
    alignItems: 'center',
  },
  icon: {
    height: 12,
    width: 12,
  },
  line: {
    marginTop: 10,
  },
  lineError: {
    marginTop: 20,
  },
  modalDropdownText: {
    flex: 1,
    fontSize: fonts.size.s14,
    color: colors.bg_tab,
    fontFamily: fonts.family.RobotoRegular,
  },
  lineBottom: {
    height: 1,
    marginTop: 20,
  },
  iconArrowStyles: {
    width: 20,
    height: 10,
    margin: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  titleTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
  titleTextStyle: {
    color: colors.white_beta,
    fontSize: fonts.size.s15,
    fontFamily: fonts.family.RobotoRegular,
  },
});

export default styles;
