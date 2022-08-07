import { StyleSheet } from 'react-native';
import { colors, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 25,
    paddingVertical: 15,
  },

  separator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 0.5,
    width: WIDTH - 50,
    backgroundColor: colors.GRAY_COLOR,
  },

  avatar: {
    width: 24,
    aspectRatio: 1,
    borderRadius: 12,
    marginRight: 11,
    backgroundColor: colors.GRAY_COLOR,
  },

  avatarText: {
    fontSize: 10,
  },

  containerContent: {
    flex: 1,
    alignItems: 'flex-start',
  },

  containerTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  contentTitle: {
    fontSize: 14,
  },

  contentTime: {
    fontSize: 10,
  },

  contentDes: {
    fontSize: 10,
    color: colors.GRAY_COLOR,
  },
});

export default styles;
