import { HEIGHT, WIDTH, fonts } from '@src/constants/vars';
import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { isAndroid } from '@src/utils';
const topPadding = isAndroid() ? HEIGHT * 0.035 : HEIGHT <= 736 ? HEIGHT * 0.035 : HEIGHT * 0.05;
const styles = StyleSheet.create({
  background: {
    height: HEIGHT,
    width: WIDTH,
    paddingVertical: topPadding
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  contentContainerStyle: {
    justifyContent: 'center',
    flexGrow: 1,
    paddingVertical: 35,
  },
  content: {
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: Theme.personal_info.bgContent,
    borderRadius: 1,
    paddingHorizontal: 15
  },
  titleText: {
    fontSize: 20,
    marginTop: 10,
    color: Theme.personal_info.headerTitle,
    fontFamily: fonts.MontserratMedium,
  },
  descriptionText: {
    fontSize: 13,
    marginTop: 10,
    color: Theme.personal_info.headerDescription,
    fontFamily: fonts.MontserratLight,
  },
  inputFormSubContainer: {
    width: '100%',
    backgroundColor: Theme.personal_info.bgContent,
  },
  inputStyle: {
    color: Theme.personal_info.inputStyle,
    fontSize: 11,
  },
  buttonContainer: {
    marginTop: 10,
    backgroundColor: Theme.personal_info.headerTitle,
  },
  buttonTitle: {
    fontSize: 15,
  },
});

export default styles;
