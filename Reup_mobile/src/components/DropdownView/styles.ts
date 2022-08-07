import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  parentView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#D0E9FF',
  },
  title: {
    color: '#1B72BF',
    fontWeight: '300',
    paddingRight: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default styles;
