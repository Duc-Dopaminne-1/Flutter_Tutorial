import { StyleSheet } from 'react-native';
import { fonts, HEIGHT, WIDTH } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const spaceHorizontal = 47;
const numberOfRowVisible = 2;
const imageHeight = (WIDTH - (spaceHorizontal * numberOfRowVisible * 2)) / numberOfRowVisible;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spaceHorizontal,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.staff.contentBackground,
  },
  image: {
    height: imageHeight,
    width: imageHeight,
    borderRadius: imageHeight / 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray'
  },
  checkBoxView: {
    width: 35,
    height: 35,
    alignItems: 'center',
  },
  checkBox: {
    height: 22,
    width: 22,
    marginTop: 10,
  },
  widthText: {
    width: imageHeight,
    textAlign: 'center'
  },
  name: {
    color: Theme.staff.nameText,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    marginBottom: 8
  },
  description: {
    color: Theme.staff.idText,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
});

export default styles;
