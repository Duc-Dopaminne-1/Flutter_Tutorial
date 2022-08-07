import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15,
    height: 114,
    marginHorizontal: 6,
  },

  textContainer: {
    flex: 1,
    marginLeft: 18,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  image: {
    height: '100%',
    aspectRatio: 1,
  },

  title: {
    fontSize: 14,
  },

  date: {
    fontSize: 10,
    marginBottom: 6,
  },

  content: {
    fontSize: 10,
    color: '#676877',
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
