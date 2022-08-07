import { StyleSheet } from 'react-native';
import { colors, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    height: 110,
    flexDirection: 'row',
    marginEnd: 25,
    marginVertical: 7.5,
    backgroundColor: colors.SECONDARY,
  },
  containerContent: {
    flex: 3,
    alignItems: 'flex-start',
    paddingStart: 15,
    paddingEnd: 10,
    overflow: 'hidden',
  },
  contentTitle: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
  },
  contentChapter: {
    fontSize: 12,
    color: colors.GRAY_COLOR,
    marginBottom: 5,
  },
  contentDes: {
    fontSize: 10,
    color: colors.GRAY_COLOR,
    marginBottom: 10,
  },
});

export default styles;
