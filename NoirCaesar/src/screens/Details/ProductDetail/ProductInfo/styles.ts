import { StyleSheet } from 'react-native';
import { colors, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
  },

  infoContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    paddingBottom: 20,
    backgroundColor: colors.SECONDARY,
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    fontSize: 18,
    width: '100%',
  },

  codeText: {
    fontFamily: fonts.AvenirLTStdMedium,
    color: '#676877',
    fontSize: 14,
    marginRight: 12,
  },

  productCode: {
    flexDirection: 'row',
    marginTop: 10,
  },

  iconCoins: {
    width: 16,
    height: 16,
    marginRight: 6,
  },

  textCoins: {
    fontSize: 14,
  },

  textPrice: {
    fontFamily: fonts.AvenirLTStdMedium,
    color: '#FF0000',
    fontSize: 16,
    marginVertical: 16,
    alignSelf: 'flex-start',
  },

  contentContainer: {
    flex: 1,
    padding: 15,
    alignItems: 'flex-start',
  },
  contentDes: {
    fontSize: 10,
    color: colors.WHITE,
    fontFamily: fonts.AvenirLTStdRoman,
  },
});

export default styles;
