import { StyleSheet } from 'react-native';
import { colors, BORDER_COLOR_DEFAULT, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'flex-start',
    flex: 1,
  },
  formBar: {
    backgroundColor: colors.INPUT_BG,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    borderColor: 'rgba(219,219,219,0.8)',
    borderWidth: 1,
  },
  textStyle: {
    alignSelf: 'flex-start',
    color: '#707070',
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  image: {
    width: 7,
    height: 14,
  },
  description: {
    fontSize: 13,
    marginBottom: 15,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
  },
  arrowImage: {
    marginTop: 5,
    width: 9,
    height: 5,
    marginLeft: 7,
    tintColor: '#707070',
  },
  customTouchable: {
    height: '100%',
    width: '100%'
  }
});

export default styles;
