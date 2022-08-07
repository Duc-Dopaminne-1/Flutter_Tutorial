import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    height: 110,
    flexDirection: 'row',
    marginVertical: 7.5,
    backgroundColor: colors.SECONDARY,
  },

  containerContent: {
    flex: 3,
    alignItems: 'flex-start',
    paddingStart: 15,
    paddingEnd: 10,
  },

  contentTitle: {
    fontSize: 14,
  },

  contentDes: {
    fontSize: 10,
    color: colors.GRAY_COLOR,
    marginBottom: 10,
  },

  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },

  coinContainer: {
    flexDirection: 'row',
  },

  iconCoins: {
    width: 16,
    height: 16,
    marginRight: 6,
  },

  textCoins: {
    fontSize: 14,
  },
});

export default styles;
