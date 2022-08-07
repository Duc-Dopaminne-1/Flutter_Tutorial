import { BORDER_COLOR_DEFAULT, SPACING_DEFAULT, colors } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: SPACING_DEFAULT,
    borderBottomColor: BORDER_COLOR_DEFAULT,
    borderBottomWidth: 1,
  },
  avatarContainer: {},
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    flexWrap: 'wrap',
    paddingLeft: SPACING_DEFAULT,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.BLACK,
  },
  messageText: {
    fontWeight: '400',
    fontSize: 14,
    color: colors.GRAY900,
  },
  createdDate: {
    paddingTop: 5,
    fontSize: 12,
    color: colors.GRAY500,
  },
});

export default styles;
