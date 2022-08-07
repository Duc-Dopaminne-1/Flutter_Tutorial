import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  containerContent: {
    flex: 3,
    alignItems: 'flex-start',
    paddingEnd: 10,
  },
  contentTitle: {
    fontSize: 14,
    color: '#ffffff',
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
  icon: {
    width: 15,
    height: 15,
  },
});

export default styles;
