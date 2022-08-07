import { WIDTH, colors } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confirmOTPContainer: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  inputStyle: {
    fontSize: 14,
    margin: 5,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10,
    borderRadius: 7,
    height: 45,
    borderColor: 'grey',
    borderWidth: 1,
    width: WIDTH * 0.9,
  },
  headerTitle: {
    fontSize: 18,
    marginTop: 28,
  },
  description: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#469EC7',
    width: WIDTH * 0.8,
    borderRadius: 7,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonTitle: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
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
    paddingHorizontal: 20,
    marginTop: 24,
  },
});

export default styles;
