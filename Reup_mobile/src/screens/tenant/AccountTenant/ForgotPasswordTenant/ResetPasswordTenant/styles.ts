import { WIDTH } from '@constants/vars';
import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confirmOTPContainer: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 15,
  },
  inputStyle: {
    fontSize: 14,
    margin: 5,
  },
  headerTitle: {
    fontSize: 18,
    marginTop: 28,
  },
  description: {
    fontSize: 15,
    marginBottom: 15,
    width: '100%',
  },
  linkTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: WIDTH * 0.9,
  },
  inputFormSubContainer: {
    width: '100%',
  },
  button: {
    marginTop: 25,
    backgroundColor: Theme.reset_password.button,
  },
});

export default styles;
