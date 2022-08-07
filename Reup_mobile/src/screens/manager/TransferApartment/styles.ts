import { fonts } from '@constants/vars';
import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  accessory: {
    height: 45,
  },
  content: {
    paddingHorizontal: 15,
    flexDirection: 'column',
    backgroundColor: Theme.signin.bgContent,
    borderRadius: 1,
    paddingTop: 18,
  },
  filter: {
    height: 35,
    width: '100%',
  },
  contentSd: {
    paddingHorizontal: 15,
    flexDirection: 'column',
    backgroundColor: Theme.transfer_apartment.contentSd,
    borderRadius: 1,
  },
  contentBottom: {
    padding: 15,
    flexDirection: 'column',
    height: 66,
    backgroundColor: Theme.transfer_apartment.contentBottom,
    borderRadius: 1,
  },

  inputStyle: {
    color: Theme.transfer_apartment.inputStyle,
    fontSize: 11,
  },

  headerTitle: {
    backgroundColor: Theme.transfer_apartment.headerTitle,
    marginTop: 7,
  },
  headerTitleStyle: {
    fontFamily: fonts.MontserratSemiBold,
    color: Theme.transfer_apartment.headerTitleStyle,
  },
  inputFormSubContainer: {
    width: '100%',
  },
  containerScrollView: {
    flex: 1,
  },
  buttonTextLogin: {
    fontSize: 13,
  },
  inputContainer: {
    marginTop: 15,
  },
  buttonSubmit: {
    // marginTop: 25,
    backgroundColor: Theme.transfer_apartment.buttonSubmit,
  },
  textSession: {
    marginBottom: 16,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default styles;
