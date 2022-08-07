import { WIDTH, colors, HEIGHT } from '@constants/vars';
import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
  },
  email_address: {
    marginTop: 20,
  },
  favorite: {
    marginTop: 20,
  },
  password: {
    marginTop: 20,
  },
  confirm_password: {
    marginTop: 20,
  },
  buttonSubmit: {
    width: WIDTH * 0.8,
  },
  containerFormik: {
    paddingHorizontal: 20,
    flex: 1,
    marginBottom: 52,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
  },
  scrollview: {
    height: HEIGHT * 0.88,
  },
});

export default styles;
