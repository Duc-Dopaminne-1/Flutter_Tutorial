import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 7.5,
    marginHorizontal: 15,
  },
  containerContent: {
    flex: 3,
    alignItems: 'flex-start',
    paddingStart: 10,
    paddingEnd: 10,
  },
  contentTitle: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
  },
  icon: {
    width: 15,
    height: 15,
    alignSelf: 'center',
  },
});

export default styles;
