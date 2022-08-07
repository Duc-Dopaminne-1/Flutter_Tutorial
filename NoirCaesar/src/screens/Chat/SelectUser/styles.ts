import { StyleSheet } from 'react-native';
import { WIDTH, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  containerSearch: {
    width: WIDTH,
    height: 55,
    flexDirection: 'row',
    backgroundColor: '#676877',
    paddingStart: 15,
  },
  iconNoItem: {
    width: 13,
    height: 13,
    alignSelf: 'center',
  },
  search: {
    borderRadius: 0,
    height: 55,
    backgroundColor: 'transparent',
  },
  searchTextInputStyle: {
    color: '#0F0F13',
  },
  avatarWrapper: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    resizeMode: 'cover',
    backgroundColor: '#393F4E',
  },
  avatarContainer: {
    backgroundColor: '#393F4E',
  },
  avatarText: {
    color: colors.WHITE,
    fontSize: 16,
  },
  userSelectedName: {
    maxWidth: 60,
    fontSize: 12,
    color: '#ffffff',
  },
  deleteUserIcon: {
    width: 20,
    height: 20,
  },
});

export default styles;
