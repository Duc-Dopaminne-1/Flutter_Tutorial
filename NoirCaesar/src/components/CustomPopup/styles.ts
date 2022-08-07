import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#292936',
    borderRadius: 10,
    paddingTop: 25,
    maxHeight: 350,
    maxWidth: 301,
    overflow: 'hidden',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },

  image: {
    width: 50,
    height: 75,
  },

  textTitle: {
    marginTop: 21,
    fontSize: 16,
    marginStart: 30,
    marginEnd: 30,
    textAlign: 'center',
  },

  buttonClose: {
    flex: 1,
    marginTop: 30,
    justifyContent: 'center',
    height: 60,
  },

  textButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
  },
});
