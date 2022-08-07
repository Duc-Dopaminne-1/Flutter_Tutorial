import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    backgroundColor: '#131318',
    paddingHorizontal: 15,
  },
  backButton: {
    width: 22,
    height: 19,
  },
  trashButton: {
    width: 21,
    height: 24,
  },
  bottomButton: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderRadius: 0,
  },
  bottomLeftText: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  bottomRightText: {
    alignSelf: 'flex-end',
    marginRight: 30,
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default styles;
