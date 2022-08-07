import { HEIGHT, WIDTH, colors, fonts } from '@constants/vars';
import { StyleSheet, Platform } from 'react-native';
import { Theme } from '../Theme';


export const styles = StyleSheet.create({

  iconImageBtn: {
    height: 10,
    aspectRatio: 1,
    tintColor: '#ffffff'
  },
  containerImageBtn: {
    backgroundColor: '#F1F1F1',
    width: 45,
    height: 37,
    padding: 10
  },
  description: {
    alignSelf: 'flex-start',
    fontSize: 13,
    marginBottom: 15,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
  },
});

export default styles;
