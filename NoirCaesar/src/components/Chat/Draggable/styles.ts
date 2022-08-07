import { StyleSheet } from 'react-native';
const CIRCLE_RADIUS = 20;
const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'transparent',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    position: 'absolute',
    right: 3,
  },
});

export default styles;
