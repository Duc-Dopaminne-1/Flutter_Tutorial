import { StyleSheet } from 'react-native';
import { Theme } from '@components/Theme';
import { WIDTH, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: 'white'
  },
  contents: {
    flexDirection: 'row',
  },
  title: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    lineHeight: 16,
    color: '#333333',
    marginRight: 5
  },
  rightContainer: {
    flex: 1,
    paddingVertical: 15,
  },
  line: {
    backgroundColor: '#F1F1F1',
    width: "100%",
    height: 1,
  },
});

export default styles;
