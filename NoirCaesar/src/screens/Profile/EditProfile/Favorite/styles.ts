import { WIDTH, colors } from '@constants/vars';
import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: 'transparent',
  },
  textHeaderRight: {
    fontSize: 12,
    color: '#FF0000',
  },
  flatlist: {
    marginBottom: 30,
  },
  contentContainerStyle: {
    paddingBottom: 20,
  },
});

export default styles;
