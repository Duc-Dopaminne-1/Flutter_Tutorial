import { HEIGHT, fonts, WIDTH } from '@src/constants/vars';
import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: Theme.confirmation.backgroundColor,
  },
  content: {
    height: HEIGHT / 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Theme.confirmation.backgroundColor,
  },
  logoReup: {
    width: 100,
    height: 50,
  },
  title: {
    paddingHorizontal: 8,
    marginTop: 42,
  },
  description: {
    paddingHorizontal: 8,
    marginTop: 8,
  },
  descriptionLogout: {
    paddingHorizontal: 8,
    marginTop: 10,
  },
  text: {
    fontSize: 13,
    color: Theme.confirmation.text,
    fontFamily: fonts.MontserratRegular,
  },
  button: {
    width: 'auto',
    marginTop: 30,
    backgroundColor: Theme.confirmation.bgrButton,
    marginBottom: -20,
  },
  textButton: {
    fontSize: 15,
    color: Theme.confirmation.textButton,
    fontFamily: fonts.MontserratRegular,
  },
});

export default styles;
