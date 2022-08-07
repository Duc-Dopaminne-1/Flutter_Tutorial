import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 50,
  },

  touchView: {
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
  },

  firstControl: {
    height: 49,
    aspectRatio: 1,
  },

  secondControl: {
    width: 27,
    height: 13.5,
  },

  thirdControls: {
    width: 21,
    height: 15,
  },

  disable: {
    opacity: 0.4,
  },
});

export default styles;
