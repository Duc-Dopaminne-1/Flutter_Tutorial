import { StyleSheet } from 'react-native';
import { fonts, WIDTH } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 25,
  },
  mainImage: {
    height: 59,
    width: 85,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingStart: 18,
    justifyContent: 'space-between',
  },
  nameDocument: {
    textAlign: 'left',
    fontSize: 15,
    fontFamily: fonts.MontserratLight,
    color: Theme.document.textColorNameDocument,
  },
  containerTypeDocument: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  containerNameDocument: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  date: {
    flex: 1,
    marginBottom: 0,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    color: Theme.document.textColorDate,
  },
  type: {
    flex: 1,
    marginBottom: 0,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'left',
    color: Theme.document.textColorTypeDocument,
  },
});
