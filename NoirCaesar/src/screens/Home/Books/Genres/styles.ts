import { StyleSheet } from 'react-native';
import { colors, WIDTH, SPACING_DEFAULT, FONT_COLOR } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  itemGenresContainer: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },

  textItemGenres: {
    fontSize: 14,
    color: 'white',
    marginLeft: 34,
  },

  markRed: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: 4,
    backgroundColor: 'red',
  },

  drawerContainer: {
    width: WIDTH * 0.55,
    backgroundColor: colors.PRIMARY,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },

  flatList: {
    paddingHorizontal: 9,
  },

  transView: {
    flex: 0.45,
    opacity: 0.3,
  },

  containerDrawer: {
    flexDirection: 'row',
    flex: 1,
  },

  containerList: {
    flex: 0.55,
  },
});

export default styles;
