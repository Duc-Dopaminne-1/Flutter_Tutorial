import { StyleSheet } from 'react-native';
import * as vars from '@constants/vars';
import { colors, SPACING_DEFAULT, SPACING_SS } from '@constants/vars';

export const styles = StyleSheet.create({
  containerTitle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: SPACING_DEFAULT,
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    paddingBottom: SPACING_DEFAULT,
    borderBottomColor: '#676877',
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
    marginTop: 15,
    paddingEnd: 15,
    marginStart: 15,
  },
  title: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    flex: 0.9,
  },
  avatarWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    resizeMode: 'cover',
    backgroundColor: '#393F4E',
  },
  dotImg: {
    height: 13,
    width: 13,
    position: 'absolute',
    top: 4,
    right: 1,
  },
  dotCircle: {
    height: 15,
    width: 15,
    tintColor: colors.MESSAGE_FORM,
  },
  wrapperUnread: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundUnread: {
    height: 18,
    minWidth: 18,
    paddingHorizontal: SPACING_SS,
    backgroundColor: colors.BLUE,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  lastMessage: {
    fontSize: 12,
    color: '#676877',
    alignSelf: 'flex-start',
  },

  time: {
    color: '#676877',
    fontSize: 10,
  },

  username: {
    fontSize: 14,
    color: '#ffffff',
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    backgroundColor: '#393F4E',
  },
  avatarText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  iconStyle: {
    width: 7,
    height: 12,
    position: 'absolute',
    bottom: 18,
    right: 5,
  },
  rightButtonContainer: {
    position: 'absolute',
    right: 10,
    bottom: 30,
    width: 80,
    height: 30,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  unRead: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default styles;
