import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  opacity: {
    right: 10,
    left: 0,
  },
  button: {
    padding: 15,
    opacity: 1,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  error: {
    backgroundColor: 'rgba(247,79,99,1)',
  },
  information: {
    backgroundColor: 'aqua',
  },
  warning: {
    backgroundColor: 'orange',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  buttonTextTitle: {
    fontSize: 16,
    color: 'black',
    fontWeight: '700',
  },
});

export default styles;
