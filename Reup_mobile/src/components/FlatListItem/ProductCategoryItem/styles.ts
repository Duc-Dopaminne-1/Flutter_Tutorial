import { StyleSheet } from 'react-native';
import { fonts, WIDTH, colors } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const imageSize = 40;
const paddingHorizontal = 14;
const paddingText = 15;
const maxWidthIdText = 50;
const maxWidthName = WIDTH - imageSize - (paddingHorizontal * 2) - (paddingText * 2) - maxWidthIdText;

const styles = StyleSheet.create({
  checkbox: {
    height: 20,
    width: 20,
    marginEnd: 20,
  },
  containerText: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  itemText: {
    color: colors.DARK_GRAY,
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratLight,
  },
});

export default styles;
