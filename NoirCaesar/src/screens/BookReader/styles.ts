import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#131318',
    paddingBottom: 8,
    paddingHorizontal: 15,
  },
  closeImageStyle: {
    marginRight: 5,
    marginBottom: 8,
    width: 18,
    height: 18,
    alignSelf: 'center',
  },
  bookName: {
    fontSize: 18,
  },
  chapter: {
    fontSize: 10,
    color: '#676877',
  },
  readerViewContainer: {
    flex: 1,
    paddingVertical: 36,
  },
  logoView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
