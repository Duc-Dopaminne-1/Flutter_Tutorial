import { StyleSheet } from 'react-native';
import { fonts, colors, HEIGHT } from '@src/constants/vars';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  container: {
    height: (HEIGHT * 2) / 3,
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F9F9FC',
  },
  wrapButton: {
    padding: 8,
    backgroundColor: '#F9F9FC',
  },
  button: {
    paddingVertical: 12,
    backgroundColor: '#1B72BF',
    alignSelf: 'flex-start',
  },
  textButton: {
    color: 'white',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  checkbox: {
    paddingVertical: 5,
  },
  checkboxText: {
    fontSize: 15,
  },
  titleContainer: {
    backgroundColor: '#1B72BF',
    height: 50,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  searchContainer: {
    height: 50,
  },
  lineContainer: {
    height: 1,
    backgroundColor: colors.GRAY300,
    marginHorizontal: 10,
  },
  singleItemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  selectedText: {
    fontFamily: fonts.MontserratSemiBold,
    fontSize: 15,
    color: '#1B72BF',
  },
  noDataText: {
    color: colors.GRAY800,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  selectedSignleItem: {}
});

export default styles;
