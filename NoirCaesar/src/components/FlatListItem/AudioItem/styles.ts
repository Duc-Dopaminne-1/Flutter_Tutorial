import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15,
    height: 72,
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
    marginBottom: 6,
  },

  content: {
    fontSize: 10,
    color: '#676877',
  },
});

export default styles;
