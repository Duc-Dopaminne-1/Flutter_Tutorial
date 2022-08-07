import { StyleSheet } from 'react-native';
import { WIDTH } from '@src/constants/vars';

export const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  imageViewer: {
    flex: 1,
    width: WIDTH,
  },
});

export default styles;
