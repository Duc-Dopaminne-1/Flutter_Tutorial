import { StyleSheet } from 'react-native';
import { Theme } from '@components/Theme';
import { WIDTH, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  thumbnail: {
    marginRight: 15,
  },
  contents: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: 'black'
  },
  styleContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  content: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: '#333333'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 0,
    borderRadius: 2,
    height: 'auto',
    width: 'auto',
    backgroundColor: 'transparent',
    marginRight: 23,
    marginTop: 5
  },
  textAction: {
    fontSize: 11,
    lineHeight: 20,
    fontFamily: fonts.MontserratLight,
    color: '#1B72BF',
  }
});

export default styles;
