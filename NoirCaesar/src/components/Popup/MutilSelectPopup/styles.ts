import { BORDER_COLOR_DEFAULT, FONT_COLOR, FONT_SIZE_DEFAULT, RADIUS_DEFAULT, WIDTH, HEIGHT } from '@src/constants/vars';
import { StyleSheet } from 'react-native';
import { reducer } from '@src/modules/network';

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    backgroundColor: '#292936',
    borderRadius: 10,
    paddingTop: 25,
    height: HEIGHT * 0.5,
    width: WIDTH * 0.8,
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  flatlist: {
    width: WIDTH * 0.8,
    height: HEIGHT * 0.5,
    padding: 20,
    marginBottom: 10,
  },
  title: {
    color: '#FF0000',
    fontSize: 18,
    marginBottom: 10,
  },
  contentContainerStyle: {
    paddingBottom: 20,
  },
});

export default styles;
