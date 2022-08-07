import { StyleSheet } from 'react-native';
import { colors, WIDTH, fonts } from '@src/constants/vars';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
  },
  avatarContainer: {
    flexDirection: 'row',
    height: 120,
    width: '100%',
    paddingHorizontal: 14,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageAvatar: {
    width: 80,
    height: 80,
  },
  dialButton: {
    height: 25,
    marginTop: 14,
    backgroundColor: Theme.about_seller.dialButton,
  },
  avatarInfoContainer: {
    marginLeft: 17,
    alignItems: 'flex-start',
  },
  avatarName: {
    fontFamily: fonts.MontserratMedium,
    color: Theme.about_seller.avatarName,
  },
  location: {
    marginTop: 7,
    fontFamily: fonts.MontserratLight,
    color: Theme.about_seller.location,
    fontSize: 11,
  },
  infoContainer: {
    paddingHorizontal: 22,
  },
  paramContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    borderBottomColor: Theme.about_seller.line,
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  titleStyle: {
    color: Theme.about_seller.titleColor,
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
  },
  contentStyle: {
    color: Theme.about_seller.contentColor,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    textAlign: 'right',
  },
  contentContainer: {
    width: '60%',
    alignItems: 'flex-end',
  },
});
export default styles;
